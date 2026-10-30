import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { ObjectId } from 'mongodb';
import { verifyJWT } from '../utils/helpers/auth/generateJWTs';
import { EnvironmentVariables } from '../utils/constants/EnvironmentVariables';
import { Strings } from '../utils/constants/Strings';
import {
  clearAuthCookies,
  hashToken,
  isRequestFromSameOrigin,
  logger,
  retrieveAccessToken,
  retrieveRefreshToken,
} from '../utils/helpers';
import { Errors } from '../utils/constants/Errors';

/**
 * Summary: This Fastify plugin decorates the instance with reusable authentication verification functions.
 *
 * - Tokens can be extracted from HTTP headers (access token) or cookies (refresh, reset password).
 * - Tokens are verified and validated before attaching user information to requests.
 * - Provides proper error handling for unauthorized or invalid tokens.
 * - Supports special cases such as reset password flows, cross-site request rejection
 *   and checking authentication status.
 */
const authMiddleware: FastifyPluginAsync = fp(async (fastify: FastifyInstance): Promise<void> => {
  /**
   * Decorates the Fastify request object with a `userId` property.
   *
   * This property is used to store the authenticated user's ID as a string.
   * Initialized as an empty string by default.
   *
   * @property {string} userId - The authenticated user's unique identifier.
   */
  fastify.decorateRequest('userId', '');

  /**
   * Decorates the Fastify request object with a `signInMethod` property.
   *
   * This property represents the method used for user sign-in, e.g., "credentials" or social login types.
   * Initialized with the default value "credentials".
   *
   * @property {string} signInMethod - The sign-in method used by the authenticated user.
   */
  fastify.decorateRequest('signInMethod', 'credentials');

  /**
   * Decorates the Fastify request object with a `refreshTokenId` property.
   *
   * This property stores the MongoDB ObjectId of the session (refresh token document) being refreshed.
   * It is the `sid` claim of the refresh token. Populated by verifyRefreshTokenCookie middleware.
   *
   * @property {string} refreshTokenId - The refresh token document's ID for the current session.
   */
  fastify.decorateRequest('refreshTokenId', '');

  /**
   * Decorates the Fastify request object with a `refreshTokenHash` property.
   *
   * The sha256 of the presented refresh token, compared atomically during rotation.
   * Populated by verifyRefreshTokenCookie middleware.
   *
   * @property {string} refreshTokenHash - The hash of the presented refresh token.
   */
  fastify.decorateRequest('refreshTokenHash', '');

  /**
   * Decorates the Fastify request object with a `sessionId` property.
   *
   * The `sid` claim of the access token: the session the request belongs to.
   * Populated by verifyAccessTokenHeader middleware.
   *
   * @property {string} sessionId - The session of the access token.
   */
  fastify.decorateRequest('sessionId', '');

  /**
   * Rejects cross-site and same-site requests on the routes that read the refresh token cookie.
   *
   * - Uses `isRequestFromSameOrigin` on the Sec-Fetch-Site header.
   * - On failure, responds with 403 Forbidden and leaves the cookies untouched (no logout CSRF).
   *
   * @param {FastifyRequest} request - The incoming Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object used to send responses.
   * @returns {Promise<void>}
   */
  fastify.decorate(
    'verifySameOrigin',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      if (isRequestFromSameOrigin(request) === false) {
        return reply.status(403).send(fastify.httpErrors.forbidden());
      }
    }
  );

  /**
   * Verifies the access token from the Authorization header.
   *
   * - Extracts token using `retrieveAccessToken` from the Authorization header.
   * - Verifies the JWT token using the access token secret.
   * - Validates the token payload to ensure it contains `userId`, `signInMethod` and `sid`.
   * - On success, attaches `userId`, `signInMethod` and `sessionId` to the request object.
   * - On failure, responds with 401 Unauthorized error.
   *
   * @param {FastifyRequest} request - The incoming Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object used to send responses.
   * @returns {Promise<void>}
   */
  fastify.decorate(
    'verifyAccessTokenHeader',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const authHeader = request.headers.authorization;
        const authToken = retrieveAccessToken(authHeader);
        if (!authToken) {
          throw new Error('Access token missing');
        }

        const data = verifyJWT(authToken, EnvironmentVariables.Access_Token_Secret);
        validateTokenPayload(data);

        request.userId = data.userId;
        request.signInMethod = (data.signInMethod as SignInMethod) ?? 'credentials';
        request.sessionId = data.sid;
      } catch {
        return reply.status(401).send(fastify.httpErrors.unauthorized());
      }
    }
  );

  /**
   * Verifies the refresh token from cookies.
   *
   * - Extracts token using `retrieveRefreshToken` from the request cookies.
   * - Verifies the JWT token using the refresh token secret.
   * - Validates the token payload to ensure it contains `userId`, `signInMethod` and `sid`.
   * - Checks that the user is active and that its session (`sid`) exists, is not revoked and not expired.
   *   Whether the token is the current one of the session is decided atomically during rotation.
   * - On success, attaches `userId`, `signInMethod`, `refreshTokenId` and `refreshTokenHash` to the request.
   * - On failure, clears the authentication cookies and responds with 401 Unauthorized.
   *
   * @param {FastifyRequest} request - The incoming Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object used to send responses.
   * @returns {Promise<void>}
   */
  fastify.decorate(
    'verifyRefreshTokenCookie',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const token = retrieveRefreshToken(request.cookies);
        if (!token) {
          throw new Error('Refresh token missing');
        }

        const data = verifyJWT(token!, EnvironmentVariables.Refresh_Token_Secret);
        validateTokenPayload(data);

        const user = await fastify.db.collection('users').findOne({
          _id: new ObjectId(data.userId),
          isActive: true,
        });

        if (!user) {
          throw new Error(`User with id: ${data.userId} not found or inactive.`);
        }

        const session = await fastify.db.collection('refresh_tokens').findOne({
          _id: new ObjectId(data.sid),
          userId: new ObjectId(data.userId),
          revoked: false,
          expiresAt: { $gt: new Date() },
        });

        if (!session) {
          throw new Error(`Refresh token session invalid, revoked, or expired.`);
        }

        request.userId = data.userId;
        request.refreshTokenId = data.sid;
        request.refreshTokenHash = hashToken(token);
        request.signInMethod = (data.signInMethod as SignInMethod) ?? 'credentials';
      } catch (error) {
        logger.debug({ error }, 'Refresh token verification failed');
        clearAuthCookies(reply).status(401).send(fastify.httpErrors.unauthorized());
      }
    }
  );

  /**
   * Verifies the reset password token from a specific cookie.
   *
   * - Checks for presence of the reset password cookie.
   * - Verifies JWT token using the reset password secret.
   * - Validates the token payload contains a valid `userId` and `type` equal to `ForgotPasswordType`.
   * - On success, attaches the cookie's `userId` to the request, so the email link can be bound to it.
   * - On failure, responds with 403 Forbidden and a relevant error message.
   *
   * @param {FastifyRequest} request - The incoming Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object used to send responses.
   * @returns {Promise<void>}
   */
  fastify.decorate(
    'verifyResetPasswordCookie',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const cookieName = EnvironmentVariables.Reset_Pass_Cookie_Name;

        if (!request.cookies || !request.cookies[cookieName]) {
          throw new Error('Reset password cookie missing');
        }

        const token = request.cookies[cookieName];
        if (!token) {
          throw new Error('No reset token found in cookies');
        }
        const data = verifyJWT(token!, EnvironmentVariables.Reset_Pass_Cookie_Secret);

        if (!data?.userId || !data?.type || data.type !== Strings.ForgotPasswordType) {
          throw new Error('Invalid reset password token');
        }

        request.userId = data.userId;
      } catch {
        return reply
          .status(403)
          .send(fastify.httpErrors.forbidden(Errors.InvalidResetPasswordCookie));
      }
    }
  );

  /**
   * Middleware to check if a user is authenticated.
   *
   * - A valid access token is enough.
   * - Otherwise (missing, expired or invalid access token) the refresh token cookie is checked:
   *   active user, live session, and the token is the current one or the previous one within the grace window.
   *   Nothing is rotated here.
   * - If authenticated, responds with 200 OK.
   * - If not authenticated, clears the cookies and responds with 403 Forbidden.
   *
   * @param {FastifyRequest} request - The incoming Fastify request object.
   * @param {FastifyReply} reply - The Fastify reply object used to send responses.
   * @returns {Promise<void>}
   */
  fastify.decorate(
    'isAuthenticated',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const authHeader = request.headers.authorization;
        const accessToken = retrieveAccessToken(authHeader);

        if (accessToken) {
          try {
            const accessTokenData = verifyJWT(
              accessToken!,
              EnvironmentVariables.Access_Token_Secret
            );
            validateTokenPayload(accessTokenData);
            return reply.status(200).send();
          } catch {
            // An expired access token is normal here: fall back to the refresh token cookie
          }
        }

        const refreshToken = retrieveRefreshToken(request.cookies);
        if (refreshToken) {
          const refreshTokenData = verifyJWT(
            refreshToken!,
            EnvironmentVariables.Refresh_Token_Secret
          );
          validateTokenPayload(refreshTokenData);

          const user = await fastify.db.collection('users').findOne({
            _id: new ObjectId(refreshTokenData.userId),
            isActive: true,
          });

          if (!user) {
            throw new Error('Invalid user or inactive account');
          }

          const refreshTokenHash = hashToken(refreshToken);
          const session = await fastify.db.collection('refresh_tokens').findOne({
            _id: new ObjectId(refreshTokenData.sid),
            userId: new ObjectId(refreshTokenData.userId),
            revoked: false,
            expiresAt: { $gt: new Date() },
            $or: [
              { token: refreshTokenHash },
              {
                previousToken: refreshTokenHash,
                rotatedAt: { $gt: new Date(Date.now() - Strings.RefreshTokenReuseGraceMs) },
              },
            ],
          });

          if (!session) {
            throw new Error('Invalid, revoked, or expired refresh token');
          }

          return reply.status(200).send();
        }

        return reply.status(403).send();
      } catch (error) {
        logger.debug({ error }, 'Authentication failed on isAuthenticated middleware');
        clearAuthCookies(reply).status(403).send(fastify.httpErrors.forbidden());
      }
    }
  );
});

export default authMiddleware;

function validateTokenPayload(
  data: unknown
): asserts data is { userId: string; signInMethod: string; sid: string } {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('userId' in data) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (data as any).userId !== 'string' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ObjectId.isValid((data as any).userId) === false ||
    !('signInMethod' in data) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (data as any).signInMethod !== 'string' ||
    !('sid' in data) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (data as any).sid !== 'string' ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ObjectId.isValid((data as any).sid) === false
  ) {
    throw new Error('Invalid token payload');
  }
}
