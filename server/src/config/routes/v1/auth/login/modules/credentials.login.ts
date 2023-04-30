import { FastifyInstance, FastifyPluginAsync } from "fastify";
import UserController from "../../../../../../api/v1/user/user.controller";
import { $ref } from "../../../../../../api/v1/user/user.schema";

/**
 * Encapsulates the login with credentials route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const loginWithCredentials: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: $ref("authCredsBodySchema"),
        response: {
          201: $ref("authCredsUserResponseSchema"),
        },
      },
    },
    new UserController(fastify).loginCredentialsHandler
  );
};

export default loginWithCredentials;
