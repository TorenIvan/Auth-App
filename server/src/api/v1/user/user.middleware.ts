import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { fastifyPlugin as fp } from "fastify-plugin";
import { EnvironmentVariables } from "../../../config/utils/constants/EnvironmentVariables";
import { Strings } from "../../../config/utils/constants/Strings";
import { verifyJWT } from "../../../config/utils/helpers/auth/generateJWTs";

export default fp((fastify: FastifyInstance) => {
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
        if (
          !!request.cookies[`${EnvironmentVariables.Cookie_Name}`] === false
        ) {
          throw "error";
        }
        const token =
          request.cookies[`${EnvironmentVariables.Cookie_Name}`] ?? "";
        const data = verifyJWT(
          token,
          EnvironmentVariables.Refresh_Token_Secret
        );
        if (!!data?.userId === false || !!data?.signInMethod === false) {
          throw "error";
        }
      } catch (error) {
        reply.code(401);
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
        if (request.cookies === null || request.cookies === undefined) {
          throw "error";
        }
        const cookieName = EnvironmentVariables.Reset_Pass_Cookie_Name;
        if (!!request.cookies[`${cookieName}`] === false) {
          throw "error";
        }
        const token = request.cookies[`${cookieName}`] ?? "";
        const data = verifyJWT(
          token,
          EnvironmentVariables.Reset_Pass_Cookie_Secret
        );
        if (!!data?.userId === false || !!data?.type === false) {
          throw "error";
        }
        if (data.type !== Strings.ActionResetPassword) {
          throw "error";
        }
      } catch (error) {
        reply.code(401);
      }
    }
  );
});
