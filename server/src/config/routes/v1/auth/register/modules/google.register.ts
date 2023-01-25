import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the register google route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const registerWithGoogle: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an example google";
  });
};

export default registerWithGoogle;
