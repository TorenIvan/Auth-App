import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the register route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const registerWithCredentials: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an example route with credentials";
  });
};

export default registerWithCredentials;
