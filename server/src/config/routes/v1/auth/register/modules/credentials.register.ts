import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { $ref } from "../../../../../../api/v1/user/user.schema";
import UserController from "../../../../../../api/v1/user/user.controller";

/**
 * Encapsulates the register with credentials route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const registerWithCredentials: FastifyPluginAsync = async (
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
    new UserController(fastify).registerCredentialsHandler
  );
};

export default registerWithCredentials;
