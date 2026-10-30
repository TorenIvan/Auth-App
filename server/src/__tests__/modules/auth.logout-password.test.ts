import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestApp } from '../test-app';
import {
  createUser,
  findCookie,
  getSession,
  login,
  loginAndGetSession,
  refresh,
  refreshCookieName,
  resetCookieName,
  sameOrigin,
  signTestToken,
} from '../helpers/auth';
import { sendEmail } from '../../config/utils/helpers/general/sendEmail';
import { Strings } from '../../config/utils/constants/Strings';

describe('Logout, logout from all devices, forgot and reset password', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  const logout = (
    url: '/v1/auth/logout' | '/v1/auth/logout-all',
    accessToken: string | undefined,
    refreshToken: string | undefined,
    headers: Record<string, string> = sameOrigin
  ) =>
    app.inject({
      method: 'POST',
      url,
      headers: {
        ...headers,
        ...(accessToken !== undefined && { authorization: `Bearer ${accessToken}` }),
      },
      cookies: refreshToken !== undefined ? { [refreshCookieName()]: refreshToken } : {},
    });

  describe('C7 POST /v1/auth/logout', () => {
    it('revokes the current session only and clears the cookies, including the legacy path=/ ones', async () => {
      const { user, plainPassword } = await createUser(app);
      const current = await loginAndGetSession(app, user, plainPassword);
      const other = await loginAndGetSession(app, user, plainPassword);

      const response = await logout('/v1/auth/logout', current.accessToken, current.refreshToken);

      expect(response.statusCode).toBe(200);
      const session = await getSession(app, current.sid);
      expect(session!.revoked).toBe(true);
      expect(session!.deleteAt).toBeInstanceOf(Date);
      expect((await getSession(app, other.sid))!.revoked).toBe(false);
      const cleared = response.cookies.filter((c) => c.value === '');
      expect(cleared.map((c) => `${c.name}:${c.path}`)).toEqual(
        expect.arrayContaining([
          `${refreshCookieName()}:/api/v1/auth`,
          `${refreshCookieName()}:/`,
          `${process.env.COOKIE_NAME_SOCIAL_PROFILE}:/`,
        ])
      );
      expect((await refresh(app, current.refreshToken)).statusCode).toBe(401);
    });

    it('is idempotent', async () => {
      const { user, plainPassword } = await createUser(app);
      const { accessToken, refreshToken } = await loginAndGetSession(app, user, plainPassword);

      await logout('/v1/auth/logout', accessToken, refreshToken);
      const second = await logout('/v1/auth/logout', accessToken, refreshToken);

      expect(second.statusCode).toBe(200);
    });

    it.each([undefined, 'garbage'])(
      'succeeds and clears cookies with cookie %s',
      async (cookie) => {
        const { user, plainPassword } = await createUser(app);
        const { accessToken } = await loginAndGetSession(app, user, plainPassword);

        const response = await logout('/v1/auth/logout', accessToken, cookie);

        expect(response.statusCode).toBe(200);
        expect(findCookie(response, refreshCookieName())!.value).toBe('');
      }
    );

    it('requires an access token and then revokes nothing', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);

      const response = await logout('/v1/auth/logout', undefined, refreshToken);

      expect(response.statusCode).toBe(401);
      expect((await getSession(app, sid))!.revoked).toBe(false);
    });

    it("does not revoke another user's session (Bearer of A, cookie of B)", async () => {
      const a = await createUser(app);
      const b = await createUser(app);
      const sessionA = await loginAndGetSession(app, a.user, a.plainPassword);
      const sessionB = await loginAndGetSession(app, b.user, b.plainPassword);

      await logout('/v1/auth/logout', sessionA.accessToken, sessionB.refreshToken);

      expect((await getSession(app, sessionB.sid))!.revoked).toBe(false);
    });

    it('rejects a cross-site request without revoking or clearing', async () => {
      const { user, plainPassword } = await createUser(app);
      const { accessToken, refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);

      const response = await logout('/v1/auth/logout', accessToken, refreshToken, {
        'sec-fetch-site': 'cross-site',
      });

      expect(response.statusCode).toBe(403);
      expect(response.cookies).toHaveLength(0);
      expect((await getSession(app, sid))!.revoked).toBe(false);
    });
  });

  describe('C7b POST /v1/auth/logout-all', () => {
    it('revokes every session of the user and only theirs', async () => {
      const { user, plainPassword } = await createUser(app);
      const someoneElse = await createUser(app);
      const sessions = [
        await loginAndGetSession(app, user, plainPassword),
        await loginAndGetSession(app, user, plainPassword),
        await loginAndGetSession(app, user, plainPassword),
      ];
      const otherUserSession = await loginAndGetSession(
        app,
        someoneElse.user,
        someoneElse.plainPassword
      );

      const response = await logout(
        '/v1/auth/logout-all',
        sessions[0].accessToken,
        sessions[0].refreshToken
      );

      expect(response.statusCode).toBe(200);
      expect(response.json().message).toBe(Strings.LoggedOutAllDevices);
      for (const session of sessions) {
        const stored = await getSession(app, session.sid);
        expect(stored!.revoked).toBe(true);
        expect(stored!.deleteAt).toBeInstanceOf(Date);
        expect((await refresh(app, session.refreshToken)).statusCode).toBe(401);
      }
      expect((await getSession(app, otherUserSession.sid))!.revoked).toBe(false);
      expect(findCookie(response, refreshCookieName())!.value).toBe('');
    });

    it('keeps the access token of other devices valid until it expires (stateless), and login works again', async () => {
      const { user, plainPassword } = await createUser(app);
      const thisDevice = await loginAndGetSession(app, user, plainPassword);
      const otherDevice = await loginAndGetSession(app, user, plainPassword);

      await logout('/v1/auth/logout-all', thisDevice.accessToken, thisDevice.refreshToken);

      const details = await app.inject({
        method: 'GET',
        url: '/v1/user/details',
        headers: { authorization: `Bearer ${otherDevice.accessToken}` },
      });
      expect(details.statusCode).toBe(200);
      expect((await refresh(app, otherDevice.refreshToken)).statusCode).toBe(401);
      expect((await login(app, user.email, plainPassword)).statusCode).toBe(200);
    });

    it('is idempotent', async () => {
      const { user, plainPassword } = await createUser(app);
      const { accessToken, refreshToken } = await loginAndGetSession(app, user, plainPassword);

      await logout('/v1/auth/logout-all', accessToken, refreshToken);
      const second = await logout('/v1/auth/logout-all', accessToken, refreshToken);

      expect(second.statusCode).toBe(200);
    });

    it('requires a valid access token', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);
      const expired = signTestToken(
        { userId: user._id.toString(), signInMethod: 'credentials', sid },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: -10 }
      );

      expect((await logout('/v1/auth/logout-all', undefined, refreshToken)).statusCode).toBe(401);
      expect((await logout('/v1/auth/logout-all', expired, refreshToken)).statusCode).toBe(401);
      expect((await getSession(app, sid))!.revoked).toBe(false);
    });

    it('rejects a cross-site request', async () => {
      const { user, plainPassword } = await createUser(app);
      const { accessToken, refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);

      const response = await logout('/v1/auth/logout-all', accessToken, refreshToken, {
        'sec-fetch-site': 'cross-site',
      });

      expect(response.statusCode).toBe(403);
      expect(response.cookies).toHaveLength(0);
      expect((await getSession(app, sid))!.revoked).toBe(false);
    });
  });

  describe('C8 forgot and reset password', () => {
    const forgot = (email: string) =>
      app.inject({ method: 'POST', url: '/v1/auth/forgot-password', payload: { email } });

    const reset = (
      email: string,
      token: string,
      resetCookie: string | undefined,
      payload: object = { newPassword: 'NewPassword1', confirmNewPassword: 'NewPassword1' }
    ) =>
      app.inject({
        method: 'POST',
        url: `/v1/auth/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
        payload,
        cookies: resetCookie !== undefined ? { [resetCookieName()]: resetCookie } : {},
      });

    /** forgot-password, then what the user receives: the email link token and the reset cookie */
    const requestReset = async (email: string) => {
      const response = await forgot(email);
      expect(response.statusCode).toBe(200);
      const token: string = vi.mocked(sendEmail).mock.calls.at(-1)![1];
      const cookie: string = findCookie(response, resetCookieName())!.value;
      return { token, cookie, response };
    };

    it('sends the reset email and sets the reset cookie on the auth path', async () => {
      const { user } = await createUser(app);

      const { response } = await requestReset(user.email);

      expect(sendEmail).toHaveBeenCalledWith(
        user.email,
        expect.any(String),
        Strings.ActionResetPassword
      );
      expect(findCookie(response, resetCookieName())).toMatchObject({
        path: '/api/v1/auth',
        httpOnly: true,
        sameSite: 'Strict',
      });
    });

    it('resets the password, revokes every session and clears the reset cookie', async () => {
      const { user, plainPassword } = await createUser(app);
      const sessions = [
        await loginAndGetSession(app, user, plainPassword),
        await loginAndGetSession(app, user, plainPassword),
      ];
      const { token, cookie } = await requestReset(user.email);

      const response = await reset(user.email, token, cookie);

      expect(response.statusCode).toBe(200);
      expect(findCookie(response, resetCookieName())).toMatchObject({
        value: '',
        path: '/api/v1/auth',
      });
      for (const session of sessions) {
        expect((await getSession(app, session.sid))!.revoked).toBe(true);
        expect((await refresh(app, session.refreshToken)).statusCode).toBe(401);
      }
      expect((await login(app, user.email, plainPassword)).statusCode).toBe(400);
      expect((await login(app, user.email, 'NewPassword1')).statusCode).toBe(200);
      const stored = await app.db.collection('users').findOne({ _id: user._id });
      expect(stored!.passwordChangedAt).toBeInstanceOf(Date);
    });

    it.each([
      ['an unknown email', 'nobody@example.com', {}],
      [
        'an unverified user',
        'unverified@example.com',
        { isVerified: false, customEmail: 'unverified@example.com' },
      ],
    ])('answers 200 without an email for %s', async (_, email, userOptions) => {
      if (Object.keys(userOptions).length > 0) await createUser(app, userOptions);

      const response = await forgot(email);

      expect(response.statusCode).toBe(200);
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('rejects the same link a second time, with the original reset cookie', async () => {
      const { user } = await createUser(app);
      const { token, cookie } = await requestReset(user.email);
      await reset(user.email, token, cookie);

      const second = await reset(user.email, token, cookie, {
        newPassword: 'OtherPassword1',
        confirmNewPassword: 'OtherPassword1',
      });

      expect(second.statusCode).toBe(403);
      expect((await login(app, user.email, 'NewPassword1')).statusCode).toBe(200);
    });

    it('allows forgot → reset → forgot → reset', async () => {
      const { user } = await createUser(app);
      const first = await requestReset(user.email);
      await reset(user.email, first.token, first.cookie);
      // Step out of the second in which the password changed (iat has second granularity)
      await app.db
        .collection('users')
        .updateOne({ _id: user._id }, { $set: { passwordChangedAt: new Date(Date.now() - 2000) } });

      const secondRequest = await requestReset(user.email);
      const second = await reset(user.email, secondRequest.token, secondRequest.cookie, {
        newPassword: 'ThirdPassword1',
        confirmNewPassword: 'ThirdPassword1',
      });

      expect(second.statusCode).toBe(200);
      expect((await login(app, user.email, 'ThirdPassword1')).statusCode).toBe(200);
    });

    it("rejects A's link with B's reset cookie", async () => {
      const a = await createUser(app);
      const b = await createUser(app);
      const linkOfA = await requestReset(a.user.email);
      const cookieOfB = await requestReset(b.user.email);

      const response = await reset(a.user.email, linkOfA.token, cookieOfB.cookie);

      expect(response.statusCode).toBe(403);
      expect((await login(app, a.user.email, a.plainPassword)).statusCode).toBe(200);
      expect((await login(app, b.user.email, b.plainPassword)).statusCode).toBe(200);
    });

    it('rejects a reset without the reset cookie', async () => {
      const { user } = await createUser(app);
      const { token } = await requestReset(user.email);

      expect((await reset(user.email, token, undefined)).statusCode).toBe(403);
    });

    it.each([
      ['a confirm email token', Strings.ConfirmEmailType, 'EMAIL_SECRET', '1h'],
      ['an expired token', Strings.ForgotPasswordType, 'EMAIL_SECRET', -10],
      ['a token with another secret', Strings.ForgotPasswordType, 'another-secret', '1h'],
    ] as const)('rejects %s', async (_, type, secret, expiresIn) => {
      const { user } = await createUser(app);
      const { cookie } = await requestReset(user.email);
      const token = signTestToken(
        { userId: user._id.toString(), type },
        process.env[secret] ?? secret,
        { expiresIn }
      );

      expect((await reset(user.email, token, cookie)).statusCode).toBe(403);
    });

    it.each([
      [
        'passwords that do not match',
        { newPassword: 'NewPassword1', confirmNewPassword: 'NewPassword2' },
      ],
      ['a weak password', { newPassword: 'weak', confirmNewPassword: 'weak' }],
    ])('rejects %s with 400', async (_, payload) => {
      const { user } = await createUser(app);
      const { token, cookie } = await requestReset(user.email);

      expect((await reset(user.email, token, cookie, payload)).statusCode).toBe(400);
    });

    it('answers a single 400 when both the query and the body are invalid', async () => {
      const { user } = await createUser(app);
      const { cookie } = await requestReset(user.email);

      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/reset-password?email=not-an-email',
        payload: { newPassword: 'weak' },
        cookies: { [resetCookieName()]: cookie },
      });

      expect(response.statusCode).toBe(400);
    });

    it('rate limits forgot-password after 5 requests per minute', async () => {
      for (let i = 0; i < 5; i++) {
        await forgot('nobody@example.com');
      }

      expect((await forgot('nobody@example.com')).statusCode).toBe(429);
    });
  });
});
