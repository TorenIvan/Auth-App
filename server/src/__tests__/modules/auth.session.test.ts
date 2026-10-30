import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { ObjectId } from 'mongodb';
import * as jwt from 'jsonwebtoken';
import { createTestApp } from '../test-app';
import {
  createUser,
  expireGraceWindow,
  findCookie,
  findSessionByToken,
  getSession,
  login,
  loginAndGetSession,
  refresh,
  refreshCookieName,
  sameOrigin,
  signTestToken,
} from '../helpers/auth';
import { hashToken } from '../../config/utils/helpers';
import { Errors } from '../../config/utils/constants/Errors';

describe('Sessions: login, access token, refresh rotation, check', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('C3 POST /v1/auth/login/credentials', () => {
    it('issues an access token and a hardened refresh cookie, and stores only the hash of the token', async () => {
      const { user, plainPassword } = await createUser(app);

      const response = await login(app, user.email, plainPassword);

      expect(response.statusCode).toBe(200);
      const accessToken: string = response.json().access_token;
      const cookie = findCookie(response, refreshCookieName())!;
      expect(cookie).toMatchObject({
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/api/v1/auth',
      });
      expect(Number.isInteger(cookie.maxAge)).toBe(true);

      const refreshPayload = jwt.decode(cookie.value) as jwt.JwtPayload;
      const accessPayload = jwt.decode(accessToken) as jwt.JwtPayload;
      expect(cookie.maxAge).toBeGreaterThan(refreshPayload.exp! - Date.now() / 1000 - 5);
      expect(cookie.maxAge).toBeLessThanOrEqual(refreshPayload.exp! - Date.now() / 1000 + 1);
      expect(accessPayload.sid).toBe(refreshPayload.sid);
      expect(accessPayload.jti).toBeDefined();
      expect(refreshPayload.jti).toBeDefined();

      const session = await getSession(app, refreshPayload.sid);
      expect(session!.token).toBe(hashToken(cookie.value));
      expect(session!.token).not.toBe(cookie.value);
      expect(session!.expiresAt.getTime()).toBe(refreshPayload.exp! * 1000);
      expect(session!.userId.toString()).toBe(user._id.toString());
    });

    it('creates a separate session per device', async () => {
      const { user, plainPassword } = await createUser(app);

      const first = await loginAndGetSession(app, user, plainPassword);
      const second = await loginAndGetSession(app, user, plainPassword);

      expect(first.sid).not.toBe(second.sid);
      expect(first.refreshToken).not.toBe(second.refreshToken);
      expect(await app.db.collection('refresh_tokens').countDocuments({ userId: user._id })).toBe(
        2
      );
    });

    it('creates two sessions for two parallel logins (no duplicate key)', async () => {
      const { user, plainPassword } = await createUser(app);

      const responses = await Promise.all([
        login(app, user.email, plainPassword),
        login(app, user.email, plainPassword),
      ]);

      expect(responses.map((r) => r.statusCode)).toEqual([200, 200]);
      expect(await app.db.collection('refresh_tokens').countDocuments({ userId: user._id })).toBe(
        2
      );
    });

    it('accepts an email with spaces and capitals', async () => {
      const { user, plainPassword } = await createUser(app, { customEmail: 'case@example.com' });

      const response = await login(app, '  CASE@Example.com ', plainPassword);

      expect(response.statusCode).toBe(200);
      expect(user.email).toBe('case@example.com');
    });

    it('answers a wrong password and an unknown user identically', async () => {
      const { user } = await createUser(app);

      const wrongPassword = await login(app, user.email, 'WrongPassword1');
      const unknownUser = await login(app, 'nobody@example.com', 'WrongPassword1');

      expect(wrongPassword.statusCode).toBe(400);
      expect(unknownUser.statusCode).toBe(400);
      expect(wrongPassword.body).toBe(unknownUser.body);
      expect(wrongPassword.body).toBe(Errors.UserNotFoundWithTheseCreds);
    });

    it('forbids an inactive user without creating a session', async () => {
      const { user, plainPassword } = await createUser(app, { isActive: false });

      const response = await login(app, user.email, plainPassword);

      expect(response.statusCode).toBe(403);
      expect(await app.db.collection('refresh_tokens').countDocuments()).toBe(0);
    });

    it('rate limits after 5 attempts per minute', async () => {
      const { user } = await createUser(app);
      for (let i = 0; i < 5; i++) {
        await login(app, user.email, 'WrongPassword1');
      }

      const response = await login(app, user.email, 'WrongPassword1');

      expect(response.statusCode).toBe(429);
    });
  });

  describe('C4 access token on a protected route', () => {
    const details = (authorization?: string) =>
      app.inject({
        method: 'GET',
        url: '/v1/user/details',
        headers: authorization !== undefined ? { authorization } : {},
      });

    it('returns the data of the user of the token (also with a lowercase bearer)', async () => {
      const { user, plainPassword } = await createUser(app);
      const { accessToken } = await loginAndGetSession(app, user, plainPassword);

      const response = await details(`Bearer ${accessToken}`);
      const lowercase = await details(`bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.json().email).toBe(user.email);
      expect(lowercase.statusCode).toBe(200);
    });

    it.each([undefined, 'Bearer', 'Bearer ', 'Basic abc'])('rejects header %s', async (header) => {
      expect((await details(header)).statusCode).toBe(401);
    });

    it('rejects forged, expired and swapped tokens', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);
      const payload = { userId: user._id.toString(), signInMethod: 'credentials', sid };

      const forged = [
        signTestToken(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: -10 }),
        signTestToken(payload, process.env.REFRESH_TOKEN_SECRET!),
        signTestToken(payload, 'another-secret'),
        signTestToken(payload, '', { algorithm: 'none' }),
        signTestToken(
          { userId: user._id.toString(), signInMethod: 'credentials' },
          process.env.ACCESS_TOKEN_SECRET!
        ),
        refreshToken,
      ];

      for (const token of forged) {
        expect((await details(`Bearer ${token}`)).statusCode).toBe(401);
      }
    });
  });

  describe('C5 POST /v1/auth/refresh', () => {
    it('rotates: new access token and cookie, previous token remembered', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);

      const response = await refresh(app, refreshToken);

      expect(response.statusCode).toBe(200);
      const newRefreshToken = findCookie(response, refreshCookieName())!;
      expect(newRefreshToken.value).not.toBe(refreshToken);
      expect(newRefreshToken).toMatchObject({
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/api/v1/auth',
      });
      const session = await getSession(app, sid);
      expect(session!.token).toBe(hashToken(newRefreshToken.value));
      expect(session!.previousToken).toBe(hashToken(refreshToken));
      expect(session!.rotatedAt).toBeInstanceOf(Date);

      const detailsResponse = await app.inject({
        method: 'GET',
        url: '/v1/user/details',
        headers: { authorization: `Bearer ${response.json().access_token}` },
      });
      expect(detailsResponse.statusCode).toBe(200);
    });

    it('rotates three times in a row', async () => {
      const { user, plainPassword } = await createUser(app);
      let { refreshToken } = await loginAndGetSession(app, user, plainPassword);

      for (let i = 0; i < 3; i++) {
        const response = await refresh(app, refreshToken);
        expect(response.statusCode).toBe(200);
        const next = findCookie(response, refreshCookieName())!.value;
        const session = await findSessionByToken(app, next);
        expect(session!.previousToken).toBe(hashToken(refreshToken));
        refreshToken = next;
      }
    });

    it('accepts the previous token within the grace window without changing previousToken', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);
      const first = await refresh(app, refreshToken);
      const firstCookie = findCookie(first, refreshCookieName())!.value;

      const replay = await refresh(app, refreshToken);

      expect(replay.statusCode).toBe(200);
      const session = await getSession(app, sid);
      expect(session!.previousToken).toBe(hashToken(refreshToken));
      expect(session!.token).toBe(hashToken(findCookie(replay, refreshCookieName())!.value));
      // The cookie given by the first rotation is neither current nor previous anymore: using it is reuse
      const late = await refresh(app, firstCookie);
      expect(late.statusCode).toBe(401);
      expect((await getSession(app, sid))!.revoked).toBe(true);
    });

    it('serves two parallel refreshes with the same cookie (step 1 and step 2)', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);

      const responses = await Promise.all([refresh(app, refreshToken), refresh(app, refreshToken)]);

      expect(responses.map((r) => r.statusCode)).toEqual([200, 200]);
      const session = await getSession(app, sid);
      expect(session!.revoked).toBe(false);
      const cookies = responses.map((r) => findCookie(r, refreshCookieName())!.value);
      const current = cookies.find((c) => hashToken(c) === session!.token)!;
      const stale = cookies.find((c) => c !== current)!;
      // Known limit of the grace window (why the client serializes refreshes with a Web Lock)
      expect((await refresh(app, stale)).statusCode).toBe(401);
      expect((await getSession(app, sid))!.revoked).toBe(true);
    });

    it('revokes the family when an old token is reused after the grace window', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);
      const rotated = await refresh(app, refreshToken);
      const current = findCookie(rotated, refreshCookieName())!.value;
      await expireGraceWindow(app, sid);

      const reuse = await refresh(app, refreshToken);

      expect(reuse.statusCode).toBe(401);
      expect(findCookie(reuse, refreshCookieName())!.value).toBe('');
      const session = await getSession(app, sid);
      expect(session!.revoked).toBe(true);
      expect(session!.deleteAt).toBeInstanceOf(Date);
      // The current token of the revoked family is dead too
      expect((await refresh(app, current)).statusCode).toBe(401);
    });

    it('revoking one family leaves the other sessions of the user working', async () => {
      const { user, plainPassword } = await createUser(app);
      const stolen = await loginAndGetSession(app, user, plainPassword);
      const other = await loginAndGetSession(app, user, plainPassword);
      await refresh(app, stolen.refreshToken);
      await expireGraceWindow(app, stolen.sid);
      await refresh(app, stolen.refreshToken);

      expect((await refresh(app, other.refreshToken)).statusCode).toBe(200);
    });

    it('accepts a request without Sec-Fetch-Site (non-browser client)', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken } = await loginAndGetSession(app, user, plainPassword);

      expect((await refresh(app, refreshToken, {})).statusCode).toBe(200);
    });

    it.each(['cross-site', 'same-site', 'none'])(
      'rejects Sec-Fetch-Site %s with 403 and leaves cookie and session untouched',
      async (site) => {
        const { user, plainPassword } = await createUser(app);
        const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);
        const before = await getSession(app, sid);

        const response = await refresh(app, refreshToken, { 'sec-fetch-site': site });

        expect(response.statusCode).toBe(403);
        expect(findCookie(response, refreshCookieName())).toBeUndefined();
        expect(await getSession(app, sid)).toEqual(before);
      }
    );

    it('rejects a missing or garbage cookie', async () => {
      const missing = await app.inject({
        method: 'POST',
        url: '/v1/auth/refresh',
        headers: sameOrigin,
      });
      const garbage = await refresh(app, 'garbage');

      expect(missing.statusCode).toBe(401);
      expect(garbage.statusCode).toBe(401);
    });

    it('rejects an expired session document', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);
      await app.db
        .collection('refresh_tokens')
        .updateOne(
          { _id: new ObjectId(sid) },
          { $set: { expiresAt: new Date(Date.now() - 1000) } }
        );

      expect((await refresh(app, refreshToken)).statusCode).toBe(401);
    });

    it('rejects forged refresh tokens without crashing', async () => {
      const { user, plainPassword } = await createUser(app);
      const { accessToken, sid } = await loginAndGetSession(app, user, plainPassword);
      const userId = user._id.toString();
      const secret = process.env.REFRESH_TOKEN_SECRET!;

      const forged = [
        accessToken,
        signTestToken({ userId, signInMethod: 'credentials', sid }, secret, { expiresIn: -10 }),
        signTestToken({ userId, signInMethod: 'credentials', sid }, '', { algorithm: 'none' }),
        signTestToken({ userId, signInMethod: 'credentials', sid }, 'another-secret'),
        signTestToken({ userId, signInMethod: 'credentials' }, secret),
        signTestToken({ userId, signInMethod: 'credentials', sid: 'not-an-object-id' }, secret),
      ];

      for (const token of forged) {
        expect((await refresh(app, token)).statusCode).toBe(401);
      }
      expect((await getSession(app, sid))!.revoked).toBe(false);
    });

    it("rejects a valid token pointing to another user's session without touching it", async () => {
      const victim = await createUser(app);
      const attacker = await createUser(app);
      const victimSession = await loginAndGetSession(app, victim.user, victim.plainPassword);
      const forged = signTestToken(
        {
          userId: attacker.user._id.toString(),
          signInMethod: 'credentials',
          sid: victimSession.sid,
        },
        process.env.REFRESH_TOKEN_SECRET!
      );

      expect((await refresh(app, forged)).statusCode).toBe(401);
      expect((await getSession(app, victimSession.sid))!.revoked).toBe(false);
    });

    it('rejects an inactive user', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken } = await loginAndGetSession(app, user, plainPassword);
      await app.db.collection('users').updateOne({ _id: user._id }, { $set: { isActive: false } });

      expect((await refresh(app, refreshToken)).statusCode).toBe(401);
    });

    it('does not accept GET', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/auth/refresh',
        headers: sameOrigin,
      });

      expect(response.statusCode).toBe(404);
    });

    it('stores a user agent starting with $ as is', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);

      await refresh(app, refreshToken, { ...sameOrigin, 'user-agent': '$token' });

      expect((await getSession(app, sid))!.userAgent).toBe('$token');
    });
  });

  describe('C6 GET /v1/auth/check', () => {
    const check = (headers: Record<string, string>, refreshToken?: string) =>
      app.inject({
        method: 'GET',
        url: '/v1/auth/check',
        headers: { ...sameOrigin, ...headers },
        cookies: refreshToken !== undefined ? { [refreshCookieName()]: refreshToken } : {},
      });

    it('accepts a valid access token', async () => {
      const { user, plainPassword } = await createUser(app);
      const { accessToken } = await loginAndGetSession(app, user, plainPassword);

      expect((await check({ authorization: `Bearer ${accessToken}` })).statusCode).toBe(200);
    });

    it('accepts a valid refresh cookie without rotating it', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);

      const response = await check({}, refreshToken);

      expect(response.statusCode).toBe(200);
      expect((await getSession(app, sid))!.token).toBe(hashToken(refreshToken));
    });

    it('accepts the previous token within the grace window', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken } = await loginAndGetSession(app, user, plainPassword);
      await refresh(app, refreshToken);

      expect((await check({}, refreshToken)).statusCode).toBe(200);
    });

    it('falls back to the cookie when the access token is expired or invalid, without clearing it', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);
      const expired = signTestToken(
        { userId: user._id.toString(), signInMethod: 'credentials', sid },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: -10 }
      );

      const withExpired = await check({ authorization: `Bearer ${expired}` }, refreshToken);
      const withGarbage = await check({ authorization: 'Bearer garbage' }, refreshToken);

      expect(withExpired.statusCode).toBe(200);
      expect(withGarbage.statusCode).toBe(200);
      expect(findCookie(withExpired, refreshCookieName())).toBeUndefined();
    });

    it('rejects nothing, revoked, and previous token outside the grace window', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken, sid } = await loginAndGetSession(app, user, plainPassword);
      await refresh(app, refreshToken);
      await expireGraceWindow(app, sid);

      expect((await check({})).statusCode).toBe(403);
      expect((await check({}, refreshToken)).statusCode).toBe(403);

      const other = await loginAndGetSession(app, user, plainPassword);
      await app.db
        .collection('refresh_tokens')
        .updateOne({ _id: new ObjectId(other.sid) }, { $set: { revoked: true } });
      expect((await check({}, other.refreshToken)).statusCode).toBe(403);
    });

    it('rejects a cross-site request with 403 without clearing the cookie', async () => {
      const { user, plainPassword } = await createUser(app);
      const { refreshToken } = await loginAndGetSession(app, user, plainPassword);

      const response = await check({ 'sec-fetch-site': 'cross-site' }, refreshToken);

      expect(response.statusCode).toBe(403);
      expect(findCookie(response, refreshCookieName())).toBeUndefined();
    });
  });
});
