import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";
import { verifyJWT } from "../utils/helpers/auth/generateJWTs";
import { EnvironmentVariables } from "../utils/constants/EnvironmentVariables";
import { Strings } from "../utils/constants/Strings";
import { retrieveAccessToken, retrieveRefreshToken, verifySocialProfileToken } from "../utils/helpers";
import { Errors } from "../utils/constants/Errors";

/**
 * Summary: This Fastify plugin decorates the instance with reusable authentication verification functions.
 * 
 * - Tokens can be extracted from HTTP headers (access token) or cookies (refresh, social profile, reset password).
 * - Tokens are verified and validated before attaching user information to requests.
 * - Provides proper error handling for unauthorized or invalid tokens.
 * - Supports special cases such as reset password flows, forbidding authenticated users from certain routes, 
 *   and checking authentication status.
 */
const authMiddleware: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance): Promise<void> => {
    /**
     * Decorates the Fastify request object with a `userId` property.
     * 
     * This property is used to store the authenticated user's ID as a string.
     * Initialized as an empty string by default.
     * 
     * @property {string} userId - The authenticated user's unique identifier.
     */
    fastify.decorateRequest("userId", "");

    /**
     * Decorates the Fastify request object with a `signInMethod` property.
     * 
     * This property represents the method used for user sign-in, e.g., "credentials" or social login types.
     * Initialized with the default value "credentials".
     * 
     * @property {string} signInMethod - The sign-in method used by the authenticated user.
     */
    fastify.decorateRequest("signInMethod", "credentials");

    /**
     * Verifies the access token from the Authorization header.
     * 
     * - Extracts token using `retrieveAccessToken` from the Authorization header.
     * - Verifies the JWT token using the access token secret.
     * - Validates the token payload to ensure it contains `userId` and `signInMethod`.
     * - On success, attaches `userId` and `signInMethod` to the request object.
     * - On failure, responds with 401 Unauthorized error.
     * 
     * @param {FastifyRequest} request - The incoming Fastify request object.
     * @param {FastifyReply} reply - The Fastify reply object used to send responses.
     * @returns {Promise<void>}
     */
    fastify.decorate(
      "verifyAccessTokenHeader",
      async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
          const authHeader = request.headers.authorization;
          const authToken = retrieveAccessToken(authHeader);
          if (!authToken) {
            throw new Error("Access token missing");
          }

          const data = verifyJWT(authToken, EnvironmentVariables.Access_Token_Secret);
          validateTokenPayload(data);

          request.userId = data.userId;
          request.signInMethod = data.signInMethod as SignInMethod ?? "credentials";
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
     * - Validates the token payload to ensure it contains `userId` and `signInMethod`.
     * - On success, attaches `userId` and `signInMethod` to the request object.
     * - On failure, clears relevant authentication cookies and responds with 401 Unauthorized.
     * 
     * @param {FastifyRequest} request - The incoming Fastify request object.
     * @param {FastifyReply} reply - The Fastify reply object used to send responses.
     * @returns {Promise<void>}
     */
    fastify.decorate(
      "verifyRefreshTokenCookie",
      async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
          const token = retrieveRefreshToken(request.cookies);
          if (!token) {
            throw new Error("Refresh token missing");
          }

          const data = verifyJWT(token!, EnvironmentVariables.Refresh_Token_Secret);
          validateTokenPayload(data);

          request.userId = data.userId;
          request.signInMethod = data.signInMethod as SignInMethod ?? "credentials";
        } catch {
          reply
            .clearCookie(EnvironmentVariables.Cookie_Name, { path: "/" })
            .clearCookie(EnvironmentVariables.Cookie_Name_Social_Profile, { path: "/" });
          return reply.status(401).send(fastify.httpErrors.unauthorized());
        }
      }
    );

    /**
     * Verifies the social profile token present in cookies.
     * 
     * - Calls `verifySocialProfileToken` helper with cookies and the sign-in method.
     * - On failure, clears authentication cookies and responds with 401 Unauthorized.
     * 
     * @param {FastifyRequest} request - The incoming Fastify request object.
     * @param {FastifyReply} reply - The Fastify reply object used to send responses.
     * @returns {Promise<void>}
     */
    fastify.decorate(
      "verifySocialProfileTokenCookie",
      async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
          await verifySocialProfileToken(request.cookies, request.signInMethod);
        } catch {
          reply
            .clearCookie(EnvironmentVariables.Cookie_Name, { path: "/" })
            .clearCookie(EnvironmentVariables.Cookie_Name_Social_Profile, { path: "/" });
          return reply.status(401).send(fastify.httpErrors.unauthorized());
        }
      }
    );

    /**
     * Verifies the reset password token from a specific cookie.
     * 
     * - Checks for presence of the reset password cookie.
     * - Verifies JWT token using the reset password secret.
     * - Validates the token payload contains a valid `userId` and `type` equal to `ForgotPasswordType`.
     * - On failure, responds with 403 Forbidden and a relevant error message.
     * 
     * @param {FastifyRequest} request - The incoming Fastify request object.
     * @param {FastifyReply} reply - The Fastify reply object used to send responses.
     * @returns {Promise<void>}
     */
    fastify.decorate(
      "verifyResetPasswordCookie",
      async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
          const cookieName = EnvironmentVariables.Reset_Pass_Cookie_Name;

          if (!request.cookies || !request.cookies[cookieName]) {
            throw new Error("Reset password cookie missing");
          }

          const token = request.cookies[cookieName];
          if (!token) {
            throw new Error("No reset token found in cookies");
          }
          const data = verifyJWT(token!, EnvironmentVariables.Reset_Pass_Cookie_Secret);

          if (!data?.userId || !data?.type || data.type !== Strings.ForgotPasswordType) {
            throw new Error("Invalid reset password token");
          }
        } catch {
          return reply.status(403).send(fastify.httpErrors.forbidden(Errors.InvalidResetPasswordCookie));
        }
      }
    );

    /**
     * Middleware to forbid actions for authenticated users.
     * 
     * - Checks for valid access or refresh tokens.
     * - If user is authenticated, responds with 403 Forbidden.
     * - Otherwise, allows request to proceed.
     * - Useful to block authenticated users from accessing sign-in or sign-up routes.
     * 
     * @param {FastifyRequest} request - The incoming Fastify request object.
     * @param {FastifyReply} reply - The Fastify reply object used to send responses.
     * @returns {Promise<void>}
     */
    fastify.decorate(
      "actionForbiddenToAuthenticatedUser",
      async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
          const authHeader = request.headers.authorization;
          const accessToken = retrieveAccessToken(authHeader);

          if (accessToken) {
            const accessTokenData = verifyJWT(accessToken!, EnvironmentVariables.Access_Token_Secret);
            if (accessTokenData?.userId && accessTokenData?.signInMethod) {
              return reply.status(403).send();
            }
          }

          const refreshToken = retrieveRefreshToken(request.cookies);
          if (refreshToken) {
            const refreshTokenData = verifyJWT(refreshToken!, EnvironmentVariables.Refresh_Token_Secret);
            if (refreshTokenData?.userId && refreshTokenData?.signInMethod) {
              return reply.status(403).send();
            }
          }
          // If no tokens or invalid tokens, just continue
        } catch {
          return reply.status(400).send();
        }
      }
    );

    /**
     * Middleware to check if a user is authenticated.
     * 
     * - Verifies access token and refresh token if present.
     * - Also verifies social profile token as part of authentication.
     * - If authenticated, responds with 200 OK.
     * - If not authenticated, responds with 403 Forbidden.
     * 
     * @param {FastifyRequest} request - The incoming Fastify request object.
     * @param {FastifyReply} reply - The Fastify reply object used to send responses.
     * @returns {Promise<void>}
     */
    fastify.decorate(
      "isAuthenticated",
      async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
          const authHeader = request.headers.authorization;
          const accessToken = retrieveAccessToken(authHeader);

          if (accessToken) {
            const accessTokenData = verifyJWT(accessToken!, EnvironmentVariables.Access_Token_Secret);
            if (accessTokenData?.userId && accessTokenData?.signInMethod) {
              await verifySocialProfileToken(request.cookies, accessTokenData.signInMethod);
              return reply.status(200).send();
            }
          }

          const refreshToken = retrieveRefreshToken(request.cookies);
          if (refreshToken) {
            const refreshTokenData = verifyJWT(refreshToken!, EnvironmentVariables.Refresh_Token_Secret);
            if (refreshTokenData?.userId && refreshTokenData?.signInMethod) {
              await verifySocialProfileToken(request.cookies, refreshTokenData.signInMethod);
              return reply.status(200).send();
            }
          }

          return reply.status(403).send();
        } catch {
          return reply.status(403).send();
        }
      }
    );
  }
);

export default authMiddleware;

function validateTokenPayload(
  data: unknown
): asserts data is { userId: string; signInMethod: string } {
  if (
    typeof data !== "object" ||
    data === null ||
    !("userId" in data) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (data as any).userId !== "string" ||
    !("signInMethod" in data) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (data as any).signInMethod !== "string"
  ) {
    throw new Error("Invalid token payload");
  }
}