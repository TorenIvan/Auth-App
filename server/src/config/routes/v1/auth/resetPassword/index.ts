import { FastifyInstance, FastifyPluginAsync } from "fastify";
import UserController from "../../../../../api/v1/user/user.controller";
import { $ref } from "../../../../../api/v1/user/user.schema";

/**
 * Encapsulates the reset password operation route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const resetPassword: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  //fastify.addHook("onRequest", fastify.verifyResetPasswordCookie);
  fastify.post(
    "/",
    {
      schema: {
        body: $ref("resetPasswordRequestSchema"),
        querystring: $ref("verifyEmailResponseSchema"),
      },
    },
    new UserController(fastify).resetPasswordHandler
  );
};

export default resetPassword;
