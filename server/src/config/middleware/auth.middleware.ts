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
import { retrieveAccessToken, retrieveRefreshToken } from "../utils/helpers";

const authMiddleware: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.decorateRequest("userId", "");
    fastify.decorateRequest("signInMethod", "credentials");
    fastify.decorate(
      "verifyAccessTokenHeader",
      async function (
        request: FastifyRequest,
        reply: FastifyReply
      ): Promise<void> {
        try {
          const authHeader: string | undefined = request.headers?.authorization;

          const authToken: string | null = retrieveAccessToken(authHeader);
          if (authToken === null) {
            throw "error";
          }

          const data = verifyJWT(
            authToken,
            EnvironmentVariables.Access_Token_Secret
          );

          const userIdExistsInJWTPayload: boolean = !!data?.userId === true;
          const signInMethodExistsInJWTPayload: boolean =
            !!data?.signInMethod === true;

          if (userIdExistsInJWTPayload === false) {
            throw "error";
          }
          if (signInMethodExistsInJWTPayload === false) {
            throw "error";
          }
          request.userId = data.userId;
        } catch (error) {
          const errorMessage = fastify.httpErrors.unauthorized();
          reply.send(errorMessage);
        }
      }
    );

    fastify.decorate(
      "verifyRefreshTokenCookie",
      async function (
        request: FastifyRequest,
        reply: FastifyReply
      ): Promise<void> {
        try {
          const token = retrieveRefreshToken(request.cookies) ?? "";

          const data = verifyJWT(
            token,
            EnvironmentVariables.Refresh_Token_Secret
          );

          const userIdExistsInJWTPayload: boolean = !!data?.userId === true;
          const signInMethodExistsInJWTPayload: boolean =
            !!data?.signInMethod === true;

          if (userIdExistsInJWTPayload === false) {
            throw "error";
          }
          if (signInMethodExistsInJWTPayload === false) {
            throw "error";
          }

          request.userId = data.userId.toString();
          request.signInMethod = data.signInMethod ?? "credentials";
        } catch (error) {
          const errorMessage = fastify.httpErrors.unauthorized();
          reply.send(errorMessage);
        }
      }
    );

    fastify.decorate(
      "verifyResetPasswordCookie",
      async function (
        request: FastifyRequest,
        reply: FastifyReply
      ): Promise<void> {
        try {
          const cookieName = EnvironmentVariables.Reset_Pass_Cookie_Name;

          if (request.cookies === null || request.cookies === undefined) {
            throw "error";
          }
          if (!!request.cookies[cookieName] === false) {
            throw "error";
          }
          const token = request.cookies[cookieName] ?? "";

          const data = verifyJWT(
            token,
            EnvironmentVariables.Reset_Pass_Cookie_Secret
          );

          if (!!data?.userId === false || !!data?.type === false) {
            throw "error";
          }
          if (data.type !== Strings.ForgotPasswordType) {
            throw "error";
          }
        } catch (error) {
          const errorMessage = fastify.httpErrors.forbidden();
          reply.send(errorMessage);
        }
      }
    );

    fastify.decorate(
      "checkIfUserIsAuthenticated",
      async function (
        request: FastifyRequest,
        reply: FastifyReply
      ): Promise<void> {
        try {
          const authHeader: string | undefined = request.headers?.authorization;
          const access_token: string | null = retrieveAccessToken(authHeader);

          if (access_token !== null) {
            const access_token_data = verifyJWT(
              access_token,
              EnvironmentVariables.Access_Token_Secret
            );
            if (access_token_data?.userId && access_token_data?.signInMethod) {
              return reply.status(200);
            }
          }

          const refresh_token = retrieveRefreshToken(request.cookies) ?? "";

          const refresh_token_data = verifyJWT(
            refresh_token,
            EnvironmentVariables.Refresh_Token_Secret
          );

          if (refresh_token_data?.userId && refresh_token_data?.signInMethod) {
            return reply.status(200);
          }
        } catch {
          reply.status(403);
        }
      }
    );
  }
);

export default authMiddleware;
