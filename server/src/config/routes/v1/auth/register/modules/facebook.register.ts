import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the register facebook route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const registerWithFacebook: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an example facebook";
  });
};

export default registerWithFacebook;
