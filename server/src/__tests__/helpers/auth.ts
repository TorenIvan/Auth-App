import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { ObjectId } from 'mongodb';
import * as jwt from 'jsonwebtoken';
import { expect } from 'vitest';
import { generateTestUser } from './seed';
import { hashToken } from '../../config/utils/helpers';
import { Strings } from '../../config/utils/constants/Strings';

export const sameOrigin = { 'sec-fetch-site': 'same-origin' };

export const refreshCookieName = (): string => process.env.COOKIE_NAME!;
export const resetCookieName = (): string => process.env.RESET_PASS_COOKIE_NAME!;

/**
 * @description The Set-Cookie of the response for the given cookie name (the last one wins).
 */
export function findCookie(
  response: LightMyRequestResponse,
  name: string
): LightMyRequestResponse['cookies'][number] | undefined {
  return response.cookies.filter((cookie) => cookie.name === name).pop();
}

/**
 * @description Creates a verified, active credentials user (unless overridden) and stores it.
 */
export async function createUser(
  app: FastifyInstance,
  options: Parameters<typeof generateTestUser>[0] = {}
) {
  const { user, plainPassword } = await generateTestUser({
    isVerified: true,
    isActive: true,
    signInMethod: 'credentials',
    ...options,
  });
  await app.db.collection('users').insertOne(user);
  return { user, plainPassword };
}

export async function login(app: FastifyInstance, email: string, password: string) {
  return app.inject({
    method: 'POST',
    url: '/v1/auth/login/credentials',
    payload: { email, password },
  });
}

/**
 * @description Logs the user in and returns what a browser would hold: the access token (memory)
 * and the refresh token (cookie), plus the session id.
 */
export async function loginAndGetSession(
  app: FastifyInstance,
  user: { email: string },
  plainPassword: string
) {
  const response = await login(app, user.email, plainPassword);
  expect(response.statusCode).toBe(200);
  const accessToken: string = response.json().access_token;
  const refreshToken: string = findCookie(response, refreshCookieName())!.value;
  const sid: string = (jwt.decode(accessToken) as { sid: string }).sid;
  return { accessToken, refreshToken, sid };
}

export async function refresh(
  app: FastifyInstance,
  refreshToken: string,
  headers: Record<string, string> = sameOrigin
) {
  return app.inject({
    method: 'POST',
    url: '/v1/auth/refresh',
    headers,
    cookies: { [refreshCookieName()]: refreshToken },
  });
}

export async function getSession(app: FastifyInstance, sid: string) {
  return app.db.collection('refresh_tokens').findOne({ _id: new ObjectId(sid) });
}

/**
 * @description Moves the last rotation of a session back in time, to step outside the grace window.
 */
export async function expireGraceWindow(app: FastifyInstance, sid: string) {
  await app.db
    .collection('refresh_tokens')
    .updateOne(
      { _id: new ObjectId(sid) },
      { $set: { rotatedAt: new Date(Date.now() - Strings.RefreshTokenReuseGraceMs - 1000) } }
    );
}

export async function findSessionByToken(app: FastifyInstance, token: string) {
  return app.db.collection('refresh_tokens').findOne({ token: hashToken(token) });
}

/**
 * @description Signs arbitrary payloads, to forge tokens the way an attacker would try to.
 */
export function signTestToken(
  payload: object,
  secret: string,
  options: jwt.SignOptions = { expiresIn: '15m' }
): string {
  return jwt.sign(payload, secret, options);
}
