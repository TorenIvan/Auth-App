import { FastifyReply } from 'fastify';
import { EnvironmentVariables } from '../../constants/EnvironmentVariables';
import { generateCookieOptionsToClear } from './generateCookieOptions';

/**
 * @description Clears the refresh token cookie.
 * TODO: remove the legacy `path=/` cookies (refresh and social profile) after 2027-01-31.
 * Before the auth hardening they were set on `/` with a ~400 days Max-Age.
 */
export const clearAuthCookies = (reply: FastifyReply): FastifyReply => {
  return reply
    .clearCookie(EnvironmentVariables.Cookie_Name, generateCookieOptionsToClear())
    .clearCookie(EnvironmentVariables.Cookie_Name, { path: '/' })
    .clearCookie(EnvironmentVariables.Cookie_Name_Social_Profile, { path: '/' });
};
