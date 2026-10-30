import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestApp } from '../test-app';
import { createUser, getSession, login, loginAndGetSession, refresh } from '../helpers/auth';
import { Errors } from '../../config/utils/constants/Errors';

const PNG = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.from('rest-of-png'),
]);
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.from('rest-of-jpeg')]);

type FilePart = { filename: string; mimetype: string; data: Buffer };

/**
 * @description A multipart/form-data body like the one ProfileEdit sends.
 */
function multipartBody(fields: Record<string, string>, files: FilePart[] = []) {
  const boundary = `----auth-app-test-${Date.now()}`;
  const parts: Buffer[] = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
      )
    );
  }
  for (const file of files) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${file.filename}"\r\nContent-Type: ${file.mimetype}\r\n\r\n`
      ),
      file.data,
      Buffer.from('\r\n')
    );
  }
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  return {
    payload: Buffer.concat(parts),
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
  };
}

const editFields = (overrides: Record<string, string> = {}) => ({
  username: 'New Name',
  biography: 'New biography',
  phone: '',
  currentPassword: '',
  newPassword: '',
  ...overrides,
});

describe('C9 profile: details and edit', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  const edit = (accessToken: string, fields: Record<string, string>, files: FilePart[] = []) => {
    const { payload, headers } = multipartBody(fields, files);
    return app.inject({
      method: 'POST',
      url: '/v1/user/edit',
      payload,
      headers: { ...headers, authorization: `Bearer ${accessToken}` },
    });
  };

  const details = (accessToken: string) =>
    app.inject({
      method: 'GET',
      url: '/v1/user/details',
      headers: { authorization: `Bearer ${accessToken}` },
    });

  it('updates username, biography and phone', async () => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(accessToken, editFields({ phone: '+30 210 123 4567' }));

    expect(response.statusCode).toBe(200);
    const stored = await app.db.collection('users').findOne({ _id: user._id });
    expect(stored).toMatchObject({
      username: 'New Name',
      biography: 'New biography',
      phone: '+30 210 123 4567',
    });
  });

  it.each([
    ['png', 'avatar.png', 'image/png', PNG],
    ['jpeg', 'avatar.jpg', 'image/jpeg', JPEG],
  ])('uploads a %s that /details returns as a data URL', async (_, filename, mimetype, data) => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(accessToken, editFields(), [{ filename, mimetype, data }]);

    expect(response.statusCode).toBe(200);
    expect((await details(accessToken)).json().image).toBe(
      `data:${mimetype};base64,${data.toString('base64')}`
    );
  });

  it('changes the password: other sessions revoked, this one kept, old password rejected', async () => {
    const { user, plainPassword } = await createUser(app);
    const current = await loginAndGetSession(app, user, plainPassword);
    const other = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(
      current.accessToken,
      editFields({ currentPassword: plainPassword, newPassword: 'abcdefg1A' })
    );

    expect(response.statusCode).toBe(200);
    expect((await getSession(app, other.sid))!.revoked).toBe(true);
    expect((await getSession(app, current.sid))!.revoked).toBe(false);
    expect((await refresh(app, current.refreshToken)).statusCode).toBe(200);
    expect((await login(app, user.email, plainPassword)).statusCode).toBe(400);
    // Uppercase letter at the end: accepted (regression for the profile password regex)
    expect((await login(app, user.email, 'abcdefg1A')).statusCode).toBe(200);
    const stored = await app.db.collection('users').findOne({ _id: user._id });
    expect(stored!.passwordChangedAt).toBeInstanceOf(Date);
  });

  it.each([
    ['username of 2', { username: 'ab' }, 200],
    ['username of 18', { username: 'a'.repeat(18) }, 200],
    ['biography of 500', { biography: 'b'.repeat(500) }, 200],
    ['username of 1', { username: 'a' }, 400],
    ['username of 19', { username: 'a'.repeat(19) }, 400],
    ['biography of 501', { biography: 'b'.repeat(501) }, 400],
    ['an invalid phone', { phone: '12' }, 400],
  ])('validates %s', async (_, overrides, status) => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);

    expect((await edit(accessToken, editFields(overrides))).statusCode).toBe(status);
  });

  it('rejects an empty file', async () => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(accessToken, editFields(), [
      { filename: 'empty.png', mimetype: 'image/png', data: Buffer.alloc(0) },
    ]);

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toBe(Errors.InvalidFileData);
  });

  it('rejects a wrong current password without revoking anything', async () => {
    const { user, plainPassword } = await createUser(app);
    const current = await loginAndGetSession(app, user, plainPassword);
    const other = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(
      current.accessToken,
      editFields({ currentPassword: 'WrongPassword1', newPassword: 'NewPassword1' })
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(Errors.IncorrectPassword);
    expect((await getSession(app, other.sid))!.revoked).toBe(false);
  });

  it('does not let a social user set a password', async () => {
    const { user } = await createUser(app, { signInMethod: 'google' });
    // A social session, as a provider login would create it
    await app.db.collection('users').updateOne({ _id: user._id }, { $set: { password: '' } });
    const { generateAuthJWTs } = await import('../../config/utils/helpers/auth/generateJWTs');
    const { access_token } = generateAuthJWTs(
      user._id.toString(),
      'google',
      '507f1f77bcf86cd799439011'
    );

    const response = await edit(
      access_token,
      editFields({ currentPassword: '', newPassword: 'NewPassword1' })
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(Errors.SignInMethodUpdatePassword);
  });

  it.each([
    ['a gif', 'a.gif', 'image/gif', Buffer.from('GIF89a....')],
    ['an svg', 'a.svg', 'image/svg+xml', Buffer.from('<svg onload="alert(1)"/>')],
  ])('rejects %s by mimetype', async (_, filename, mimetype, data) => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(accessToken, editFields(), [{ filename, mimetype, data }]);

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toBe(Errors.InvalidFileType);
  });

  it.each([
    ['html declared as png', 'image/png', Buffer.from('<html><script>alert(1)</script></html>')],
    ['svg declared as jpeg', 'image/jpeg', Buffer.from('<svg onload="alert(1)"/>')],
    ['a real png declared as jpeg', 'image/jpeg', PNG],
    ['a real jpeg declared as png', 'image/png', JPEG],
    ['a file shorter than the png signature', 'image/png', Buffer.from([0x89, 0x50])],
  ])('rejects %s by content (magic bytes)', async (_, mimetype, data) => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(accessToken, editFields(), [{ filename: 'x', mimetype, data }]);

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toBe(Errors.InvalidFileType);
    expect((await details(accessToken)).json().image).toBeUndefined();
  });

  it('rejects a file larger than 2 MB', async () => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);
    const big = Buffer.concat([PNG, Buffer.alloc(2 * 1024 * 1024)]);

    const response = await edit(accessToken, editFields(), [
      { filename: 'big.png', mimetype: 'image/png', data: big },
    ]);

    expect(response.statusCode).toBe(400);
    expect((await details(accessToken)).json().image).toBeUndefined();
  });

  it('never fails with 500 on two files and stores at most one image', async () => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(accessToken, editFields(), [
      { filename: 'a.png', mimetype: 'image/png', data: PNG },
      { filename: 'b.jpg', mimetype: 'image/jpeg', data: JPEG },
    ]);

    expect(response.statusCode).toBeLessThan(500);
    const image: string | undefined = (await details(accessToken)).json().image;
    expect(image === undefined || image.startsWith('data:image/')).toBe(true);
  });

  it('ignores email, isVerified and signInMethod in the body', async () => {
    const { user, plainPassword } = await createUser(app);
    const { accessToken } = await loginAndGetSession(app, user, plainPassword);

    const response = await edit(
      accessToken,
      editFields({ email: 'evil@example.com', isVerified: 'false', signInMethod: 'google' })
    );

    expect(response.statusCode).toBe(200);
    const stored = await app.db.collection('users').findOne({ _id: user._id });
    expect(stored).toMatchObject({
      email: user.email,
      isVerified: true,
      signInMethod: 'credentials',
    });
  });
});
