import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createTestApp } from '../test-app';
import { generateTestUser, generateAuthCredentials } from '../helpers/seed';
import { sendEmail } from '../../config/utils/helpers/general/sendEmail';
import { Strings } from '../../config/utils/constants/Strings';

describe('Auth Login Credentials', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await createTestApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /v1/auth/login/credentials', () => {
    it('should login with valid credentials for verified user', async () => {
      const { user, plainPassword } = await generateTestUser({
        isVerified: true,
      });

      await app.db.collection('users').insertOne(user);

      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          email: user.email,
          password: plainPassword,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty('access_token');
      expect(response.cookies).toHaveLength(1);
      expect(response.cookies[0].name).toBe(process.env.COOKIE_NAME || 'refreshToken');
    });

    it('should reject login for unverified user and send verification email', async () => {
      const { user, plainPassword } = await generateTestUser({
        isVerified: false,
      });

      await app.db.collection('users').insertOne(user);

      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          email: user.email,
          password: plainPassword,
        },
      });

      expect(response.statusCode).toBe(403);
      // handleError sends the message as plain text
      expect(response.body).toContain('confirm');
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        user.email,
        expect.any(String),
        Strings.ActionConfirmEmail
      );
    });

    it('should reject login with invalid credentials', async () => {
      const { user } = await generateTestUser({
        isVerified: true,
      });

      await app.db.collection('users').insertOne(user);

      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          email: user.email,
          password: 'WrongPassword123!',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject login for non-existent user', async () => {
      const credentials = generateAuthCredentials();

      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: credentials,
      });

      expect(response.statusCode).toBe(400);
    });

    it('should validate email format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          email: 'invalid-email',
          password: 'ValidPassword123!',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toHaveProperty('message');
    });

    it('should validate password format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          email: 'test@example.com',
          password: 'weak', // Doesn't meet requirements
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toHaveProperty('message');
    });

    it('should require email field', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          password: 'ValidPassword123!',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should require password field', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          email: 'test@example.com',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should handle case insensitive email', async () => {
      const { user, plainPassword } = await generateTestUser({
        isVerified: true,
        customEmail: 'test@example.com',
      });

      await app.db.collection('users').insertOne(user);

      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          email: 'TEST@EXAMPLE.COM',
          password: plainPassword,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveProperty('access_token');
    });

    it('should store a refresh token session on successful login', async () => {
      const { user, plainPassword } = await generateTestUser({
        isVerified: true,
      });

      await app.db.collection('users').insertOne(user);

      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login/credentials',
        payload: {
          email: user.email,
          password: plainPassword,
        },
      });

      expect(response.statusCode).toBe(200);
      const sessions = await app.db
        .collection('refresh_tokens')
        .find({ userId: user._id })
        .toArray();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].revoked).toBe(false);
      expect(sessions[0].expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });
});
