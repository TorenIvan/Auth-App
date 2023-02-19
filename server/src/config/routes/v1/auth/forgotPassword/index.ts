import { FastifyInstance, FastifyPluginAsync } from "fastify";
import UserController from "../../../../../api/v1/user/user.controller";
import { $ref } from "../../../../../api/v1/user/user.schema";

/**
 * Encapsulates the forgot password operation route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const forgotPassword: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: $ref("forgotPasswordRequestSchema"),
      },
    },
    new UserController(fastify).forgotPasswordHandler
  );
};

export default forgotPassword;
