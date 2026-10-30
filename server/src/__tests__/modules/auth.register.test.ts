import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestApp } from '../test-app';
import { createUser, signTestToken } from '../helpers/auth';
import { sendEmail } from '../../config/utils/helpers/general/sendEmail';
import { Strings } from '../../config/utils/constants/Strings';
import { Errors } from '../../config/utils/constants/Errors';

const register = (app: FastifyInstance, payload: object) =>
  app.inject({ method: 'POST', url: '/v1/auth/register/credentials', payload });

describe('Register and confirm email', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('C1 POST /v1/auth/register/credentials', () => {
    it('creates an unverified credentials user with a hashed password and sends a confirmation email', async () => {
      const response = await register(app, { email: 'new@example.com', password: 'Password1' });

      expect(response.statusCode).toBe(201);
      const user = await app.db.collection('users').findOne({ email: 'new@example.com' });
      expect(user).toMatchObject({
        isVerified: false,
        isActive: true,
        signInMethod: 'credentials',
      });
      expect(user!.password).not.toBe('Password1');
      expect(user!.password).toMatch(/^\$2[aby]\$/);
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        'new@example.com',
        expect.any(String),
        Strings.ActionConfirmEmail
      );
    });

    it('trims and lowercases the email', async () => {
      const response = await register(app, { email: ' Foo@Bar.COM ', password: 'Password1' });

      expect(response.statusCode).toBe(201);
      expect(await app.db.collection('users').countDocuments({ email: 'foo@bar.com' })).toBe(1);
    });

    it.each(['Abcdefg1', 'A1' + 'a'.repeat(34)])(
      'accepts the password length bounds (%s)',
      async (password) => {
        const response = await register(app, { email: `${password.length}@example.com`, password });
        expect(response.statusCode).toBe(201);
      }
    );

    it.each(['Abcdef1', 'A1' + 'a'.repeat(35), 'abcdefg1', 'ABCDEFG1', 'Abcdefgh'])(
      'rejects a password outside the policy (%s)',
      async (password) => {
        const response = await register(app, { email: 'weak@example.com', password });
        expect(response.statusCode).toBe(400);
        expect(await app.db.collection('users').countDocuments()).toBe(0);
      }
    );

    it('rejects an email that already exists without creating a second user', async () => {
      const { user } = await createUser(app);

      const response = await register(app, { email: user.email, password: 'Password1' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toBe(Errors.UserAlreadyExists);
      expect(await app.db.collection('users').countDocuments({ email: user.email })).toBe(1);
    });

    it('rejects a NoSQL operator instead of an email', async () => {
      const response = await register(app, { email: { $ne: null }, password: 'Password1' });

      expect(response.statusCode).toBe(400);
      expect(await app.db.collection('users').countDocuments()).toBe(0);
    });

    it('ignores fields that are not part of the schema (mass assignment)', async () => {
      const response = await register(app, {
        email: 'mass@example.com',
        password: 'Password1',
        isVerified: true,
        signInMethod: 'google',
      });

      expect(response.statusCode).toBe(201);
      const user = await app.db.collection('users').findOne({ email: 'mass@example.com' });
      expect(user).toMatchObject({ isVerified: false, signInMethod: 'credentials' });
    });

    it('rate limits after 5 requests per minute', async () => {
      for (let i = 0; i < 5; i++) {
        await register(app, { email: `rate${i}@example.com`, password: 'Password1' });
      }
      const response = await register(app, { email: 'rate6@example.com', password: 'Password1' });

      expect(response.statusCode).toBe(429);
    });
  });

  describe('C2 GET /v1/auth/verify', () => {
    const verify = (email: string, token: string) =>
      app.inject({
        method: 'GET',
        url: `/v1/auth/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
      });

    it('verifies the user with the token of the confirmation email, and is idempotent', async () => {
      await register(app, { email: 'confirm@example.com', password: 'Password1' });
      const token: string = vi.mocked(sendEmail).mock.calls[0][1];

      const first = await verify('confirm@example.com', token);
      const second = await verify('confirm@example.com', token);

      expect(first.statusCode).toBe(200);
      expect(second.statusCode).toBe(200);
      const user = await app.db.collection('users').findOne({ email: 'confirm@example.com' });
      expect(user!.isVerified).toBe(true);
    });

    it.each([
      ['expired', Strings.ConfirmEmailType, 'EMAIL_SECRET', -10],
      ['signed with another secret', Strings.ConfirmEmailType, 'another-secret', '1h'],
      ['of reset password type', Strings.ForgotPasswordType, 'EMAIL_SECRET', '1h'],
    ] as const)('rejects a token that is %s', async (_, type, secret, expiresIn) => {
      const { user } = await createUser(app, { isVerified: false });
      const token = signTestToken(
        { userId: user._id.toString(), type },
        process.env[secret] ?? secret,
        { expiresIn }
      );

      const response = await verify(user.email, token);

      expect(response.statusCode).toBe(400);
      expect((await app.db.collection('users').findOne({ _id: user._id }))!.isVerified).toBe(false);
    });

    it('rejects a token for a user that does not exist', async () => {
      const token = signTestToken(
        { userId: '507f1f77bcf86cd799439011', type: Strings.ConfirmEmailType },
        process.env.EMAIL_SECRET!
      );

      const response = await verify('ghost@example.com', token);

      expect(response.statusCode).toBe(400);
    });
  });
});
