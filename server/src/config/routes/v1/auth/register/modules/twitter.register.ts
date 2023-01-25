import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the register twitter route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const registerWithTwitter: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an example twitter";
  });
};

export default registerWithTwitter;
