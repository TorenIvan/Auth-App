import { FastifyInstance, FastifyPluginAsync } from "fastify";
import UserController from "../../../../../api/v1/user/user.controller";
import { $ref } from "../../../../../api/v1/user/user.schema";

/**
 * Encapsulates the register with credentials route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const verifyEmail: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: {
        querystring: $ref("verifyEmailQueryStringSchema"),
        response: {
          200: $ref("verifyEmailResponseSchema"),
          400: $ref("verifyEmailErrorSchema"),
        },
      },
    },
    new UserController(fastify).confirmEmailHandler
  );
};

export default verifyEmail;
