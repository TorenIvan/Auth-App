import { describe, it, expect, afterEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestApp } from '../test-app';
import { createUser, findCookie, refresh, refreshCookieName, signTestToken } from '../helpers/auth';

describe('C11 infrastructure', () => {
  let app: FastifyInstance | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it('creates the indexes, including the TTL ones', async () => {
    app = await createTestApp();
    await app.ready();

    const userIndexes = await app.db.collection('users').indexes();
    const tokenIndexes = await app.db.collection('refresh_tokens').indexes();

    expect(userIndexes).toEqual(
      expect.arrayContaining([expect.objectContaining({ key: { email: 1 }, unique: true })])
    );
    expect(tokenIndexes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: { token: 1 }, unique: true }),
        expect.objectContaining({ key: { expiresAt: 1 }, expireAfterSeconds: 0 }),
        expect.objectContaining({ key: { deleteAt: 1 }, expireAfterSeconds: 0 }),
      ])
    );
  });

  it('answers unparsable JSON with 400 through our error handler', async () => {
    app = await createTestApp();
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/v1/auth/login/credentials',
      headers: { 'content-type': 'application/json' },
      payload: '{"email":',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ error: 'Invalid' });
  });

  it('never leaks the message of an internal error', async () => {
    app = await createTestApp({
      beforeRoutes: (fastify) => {
        fastify.get('/test/throw', async () => {
          throw new Error('secret internal detail');
        });
      },
    });
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/test/throw' });

    expect(response.statusCode).toBe(500);
    expect(response.body).not.toContain('secret');
    expect(response.body).not.toContain('at ');
    expect(response.json()).toMatchObject({ message: 'Internal server error' });
  });

  it('answers an unknown route with 404 without echoing the query string', async () => {
    app = await createTestApp();
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/v1/nope?token=secret-token' });

    expect(response.statusCode).toBe(404);
    expect(response.body).not.toContain('secret-token');
  });

  it('does not start without a database', async () => {
    const start = async () => {
      const failing = await createTestApp({
        DatabaseUri: 'mongodb://127.0.0.1:1/?serverSelectionTimeoutMS=500',
      });
      await failing.ready();
    };

    await expect(start()).rejects.toThrow();
  }, 20000);

  it('migration: a legacy refresh token (no sid) is rejected and every legacy cookie is cleared', async () => {
    app = await createTestApp();
    await app.ready();
    const { user } = await createUser(app);
    const legacyToken = signTestToken(
      { userId: user._id.toString(), signInMethod: 'credentials' },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    const response = await refresh(app, legacyToken);

    expect(response.statusCode).toBe(401);
    const cleared = response.cookies.filter((cookie) => cookie.value === '');
    expect(cleared.map((cookie) => `${cookie.name}:${cookie.path}`)).toEqual(
      expect.arrayContaining([
        `${refreshCookieName()}:/api/v1/auth`,
        `${refreshCookieName()}:/`,
        `${process.env.COOKIE_NAME_SOCIAL_PROFILE}:/`,
      ])
    );
    expect(findCookie(response, refreshCookieName())!.value).toBe('');
  });
});
