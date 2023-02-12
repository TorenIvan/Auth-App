import { FastifyInstance, FastifyPluginAsync } from "fastify";
import UserController from "../../../../../api/v1/user/user.controller";
import { $ref } from "../../../../../api/v1/user/user.schema";

/**
 * Encapsulates the email verification process route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const confirmEmail: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: {
        querystring: $ref("verifyEmailQueryStringSchema"),
        response: {
          200: $ref("verifyEmailResponseSchema"),
        },
      },
    },
    new UserController(fastify).confirmEmailHandler
  );
};

export default confirmEmail;
