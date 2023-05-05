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
      "checkIfUserIsAuthenticated",
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
          reply.status(200).send({ success: true, isAuthed: true });
        } catch (error) {
          const errorMessage = fastify.httpErrors.unauthorized();
          reply.send({ ...errorMessage, isAuthed: false });
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
  }
);

export default authMiddleware;
