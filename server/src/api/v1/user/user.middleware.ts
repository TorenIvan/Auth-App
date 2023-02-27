import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";
import UserService from "./user.service";
import {
  generateAccessToken,
  verifyJWT,
} from "../../../config/utils/helpers/auth/generateJWTs";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";
import { Strings } from "../../../config/utils/constants/Strings";

const userMiddleware: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance): Promise<void> => {
    const userService = new UserService(fastify.User);

    fastify.decorate(
      "verifyAccessTokenHeader",
      async function (
        request: FastifyRequest,
        reply: FastifyReply
      ): Promise<void> {
        try {
          if (
            request.headers?.authorization === null ||
            request.headers?.authorization === undefined
          ) {
            throw "error";
          }

          const authHeader = request.headers.authorization;
          if (
            authHeader.startsWith("Bearer ") === false &&
            authHeader.startsWith("bearer ") === false
          ) {
            throw "error";
          }

          const authToken: string = authHeader.split(" ")[1];
          const data = verifyJWT(
            authToken,
            EnvironmentVariables.Access_Token_Secret
          );

          if (!!data?.userId === false || !!data?.signInMethod === false) {
            throw "error";
          }

          const userIdExistsInDB = await userService.CheckUserIdExistence(
            data.userId
          );
          if (userIdExistsInDB.success === false) {
            const errorMessage = fastify.httpErrors.unauthorized();
            reply.send(errorMessage);
          }
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
          if (request.cookies === null || request.cookies === undefined) {
            throw "error";
          }

          const cookieName = EnvironmentVariables.Cookie_Name;
          if (!!request.cookies[cookieName] === false) {
            throw "error";
          }
          const token = request.cookies[cookieName] ?? "";
          const data = verifyJWT(
            token,
            EnvironmentVariables.Refresh_Token_Secret
          );
          if (!!data?.userId === false || !!data?.signInMethod === false) {
            throw "error";
          }

          const userIdExistsInDB = await userService.CheckUserIdExistence(
            data.userId
          );
          if (userIdExistsInDB.success === false) {
            const errorMessage = fastify.httpErrors.unauthorized();
            reply.send(errorMessage);
          }

          const tokenOptions: TokenInterface = {
            userId: data.userId.toString(),
            signInMethod: data.signInMethod,
          };
          const access_token = generateAccessToken(tokenOptions);

          reply.code(200).send({ access_token: access_token });
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
          console.log("cookiename : ", cookieName);

          console.log("token: ", token);

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

          const userIdExistsInDB = await userService.CheckUserIdExistence(
            data.userId
          );
          if (userIdExistsInDB.success === false) {
            const errorMessage = fastify.httpErrors.unauthorized();
            reply.send(errorMessage);
          }
        } catch (error) {
          const errorMessage = fastify.httpErrors.forbidden();
          reply.send(errorMessage);
        }
      }
    );

    fastify.decorate(
      "checkIfTokenAlreadyExists",
      async function (
        request: FastifyRequest,
        reply: FastifyReply
      ): Promise<void> {
        try {
          let accessToken: string | null = null;
          let refreshToken: string | null = null;

          const authHeader: string | undefined = request.headers?.authorization;
          if (authHeader !== undefined) {
            if (authHeader.startsWith("Bearer ") === true) {
              accessToken = authHeader.split(" ")[1];
            }
            if (authHeader.startsWith("bearer ") === true) {
              accessToken = authHeader.split(" ")[1];
            }
          }

          if (accessToken !== null) {
            try {
              await fastify.verifyRefreshTokenCookie(request, reply);
            } catch (error) {
              console.error(error);
              return;
            }
          }

          let requestCookiesExist: boolean = false;
          const authCookieName = EnvironmentVariables.Cookie_Name;

          if (request.cookies !== null && request.cookies !== undefined) {
            requestCookiesExist = true;
          }
          if (requestCookiesExist === true) {
            refreshToken = request.cookies[authCookieName] ?? null;
          }

          if (refreshToken !== null) {
            const data = verifyJWT(
              refreshToken,
              EnvironmentVariables.Refresh_Token_Secret
            );

            const userIdExistsInJWTPayload: boolean = !!data?.userId === true;
            const signInMethodExistsInJWTPayload: boolean =
              !!data?.signInMethod === true;

            if (
              userIdExistsInJWTPayload === false ||
              signInMethodExistsInJWTPayload === false
            ) {
              throw "error";
            }

            const userIdExistsInDB = await userService.CheckUserIdExistence(
              data.userId
            );
            if (userIdExistsInDB.success === false) {
              const errorMessage = fastify.httpErrors.unauthorized();
              reply.send(errorMessage);
            }
          }
        } catch (error) {
          const errorMessage = fastify.httpErrors.unauthorized();
          reply.send(errorMessage);
        }
      }
    );
  }
);

export default userMiddleware;
