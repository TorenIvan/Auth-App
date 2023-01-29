import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { registerCredentialsSchema } from "../../../../../../api/v1/user/user.schema";
import { registerCredentialsHandler } from "../../../../../../api/v1/user/user.controller";

/**
 * Encapsulates the register with credentials route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const registerWithCredentials: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.post(
    "/",
    { schema: registerCredentialsSchema },
    registerCredentialsHandler
  );
};

export default registerWithCredentials;
