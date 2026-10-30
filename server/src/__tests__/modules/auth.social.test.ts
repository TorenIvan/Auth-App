import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { createTestApp } from '../test-app';
import { createUser, findCookie, login, refreshCookieName } from '../helpers/auth';
import { Errors } from '../../config/utils/constants/Errors';

type Provider = 'google' | 'github' | 'gitlab' | 'discord' | 'facebook';
type Profile = { email?: string; name?: string; verified?: boolean };

const networkDisabled = () => Promise.reject(new Error('Network disabled in tests'));

/**
 * @description Fake provider APIs (by URL). Anything else keeps failing: no request leaves the tests.
 */
function mockProvider(profile: Profile) {
  const { email, name = 'Social Name', verified = true } = profile;
  const responses: Record<string, unknown> = {
    'https://oauth2.googleapis.com/token': { access_token: 'provider-token' },
    'https://www.googleapis.com/oauth2/v2/userinfo': { email, name, verified_email: verified },
    'https://github.com/login/oauth/access_token': { access_token: 'provider-token' },
    'https://api.github.com/user': { name, email: 'public-unverified@example.com' },
    'https://api.github.com/user/emails': [{ email, primary: true, verified }],
    'https://gitlab.com/oauth/token': { access_token: 'provider-token' },
    'https://gitlab.com/api/v4/user': {
      email,
      name,
      confirmed_at: verified ? '2024-01-01T00:00:00Z' : null,
    },
    'https://discord.com/api/oauth2/token': { access_token: 'provider-token' },
    'https://discord.com/api/users/@me': { email, username: name, verified },
    'https://graph.facebook.com/v23.0/oauth/access_token': { access_token: 'provider-token' },
    'https://graph.facebook.com/me': { email, name },
  };
  const respond = (url: string) =>
    url in responses ? Promise.resolve({ status: 200, data: responses[url] }) : networkDisabled();
  vi.mocked(axios.get).mockImplementation(respond as never);
  vi.mocked(axios.post).mockImplementation(respond as never);
}

describe('C10 social logins (providers mocked)', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestApp();
    await app.ready();
  });

  afterEach(async () => {
    vi.mocked(axios.get).mockImplementation(networkDisabled as never);
    vi.mocked(axios.post).mockImplementation(networkDisabled as never);
    await app.close();
  });

  const socialLogin = (provider: Provider, payload: object = { code: 'auth-code' }) =>
    app.inject({ method: 'POST', url: `/v1/auth/login/${provider}`, payload });

  const providers: Provider[] = ['google', 'github', 'gitlab', 'discord', 'facebook'];

  it.each(providers)(
    '%s: creates a verified user and a session, without a social cookie',
    async (provider) => {
      mockProvider({ email: `${provider}@example.com` });

      const response = await socialLogin(provider);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty('access_token');
      expect(findCookie(response, refreshCookieName())).toBeDefined();
      expect(findCookie(response, process.env.COOKIE_NAME_SOCIAL_PROFILE!)).toBeUndefined();
      const user = await app.db.collection('users').findOne({ email: `${provider}@example.com` });
      expect(user).toMatchObject({ isVerified: true, signInMethod: provider, isActive: true });
      expect(await app.db.collection('refresh_tokens').countDocuments({ userId: user!._id })).toBe(
        1
      );
    }
  );

  it.each(providers)('%s: logs the same user in again with a new session', async (provider) => {
    mockProvider({ email: `again-${provider}@example.com` });

    await socialLogin(provider);
    const second = await socialLogin(provider);

    expect(second.statusCode).toBe(200);
    expect(await app.db.collection('users').countDocuments()).toBe(1);
    expect(await app.db.collection('refresh_tokens').countDocuments()).toBe(2);
  });

  it.each(['google', 'github', 'gitlab', 'discord'] as Provider[])(
    '%s: rejects an email the provider has not verified',
    async (provider) => {
      mockProvider({ email: `unverified-${provider}@example.com`, verified: false });

      const response = await socialLogin(provider);

      expect(response.statusCode).toBe(400);
      expect(await app.db.collection('users').countDocuments()).toBe(0);
      expect(await app.db.collection('refresh_tokens').countDocuments()).toBe(0);
    }
  );

  it('github: ignores the public (unverified) email field', async () => {
    mockProvider({ email: 'verified-primary@example.com' });

    await socialLogin('github');

    expect(
      await app.db.collection('users').countDocuments({ email: 'public-unverified@example.com' })
    ).toBe(0);
    expect(
      await app.db.collection('users').countDocuments({ email: 'verified-primary@example.com' })
    ).toBe(1);
  });

  it('logs a verified provider email into an existing verified credentials account, keeping its password', async () => {
    const { user, plainPassword } = await createUser(app);
    mockProvider({ email: user.email });

    const response = await socialLogin('google');

    expect(response.statusCode).toBe(200);
    expect(await app.db.collection('users').countDocuments()).toBe(1);
    expect((await login(app, user.email, plainPassword)).statusCode).toBe(200);
  });

  it.each(['google', 'github', 'gitlab', 'discord'] as Provider[])(
    '%s: claims a pre-registered unverified account (pre-account hijacking)',
    async (provider) => {
      const { user, plainPassword } = await createUser(app, { isVerified: false });
      mockProvider({ email: user.email });

      const response = await socialLogin(provider);

      expect(response.statusCode).toBe(200);
      const stored = await app.db.collection('users').findOne({ _id: user._id });
      expect(stored).toMatchObject({ isVerified: true, password: '' });
      // The squatter's password is gone
      expect((await login(app, user.email, plainPassword)).statusCode).toBe(400);
    }
  );

  it.each([
    ['credentials', 'credentials'],
    ['google', 'google'],
  ])('facebook: never links to an account created with %s', async (_, signInMethod) => {
    await createUser(app, { signInMethod, customEmail: 'linked@example.com' });
    mockProvider({ email: 'linked@example.com' });

    const response = await socialLogin('facebook');

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(Errors.UserAlreadyExists);
    expect(await app.db.collection('refresh_tokens').countDocuments()).toBe(0);
  });

  it.each(providers)('%s: forbids an inactive user without a session', async (provider) => {
    await createUser(app, {
      isActive: false,
      signInMethod: provider,
      customEmail: `inactive-${provider}@example.com`,
    });
    mockProvider({ email: `inactive-${provider}@example.com` });

    const response = await socialLogin(provider);

    expect(response.statusCode).toBe(403);
    expect(await app.db.collection('refresh_tokens').countDocuments()).toBe(0);
  });

  it.each([
    ['a missing code', {}],
    ['an empty code', { code: '' }],
    ['a code of 2049 characters', { code: 'c'.repeat(2049) }],
    ['a code that is not a string', { code: { $ne: null } }],
  ])('rejects %s before calling the provider', async (_, payload) => {
    const response = await socialLogin('google', payload);

    expect(response.statusCode).toBe(400);
    expect(axios.post).not.toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('facebook: passes the code as an encoded param, never inside the URL', async () => {
    mockProvider({ email: 'fb-param@example.com' });

    await socialLogin('facebook', { code: 'x&redirect_uri=https://evil.example' });

    const [url, config] = vi.mocked(axios.get).mock.calls[0];
    expect(url).toBe('https://graph.facebook.com/v23.0/oauth/access_token');
    expect((config as { params: { code: string } }).params.code).toBe(
      'x&redirect_uri=https://evil.example'
    );
  });

  it('answers a generic 500 when the provider fails', async () => {
    // Default mocks: every provider call fails like a network error
    const response = await socialLogin('google');

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(Errors.GenericError);
  });
});
