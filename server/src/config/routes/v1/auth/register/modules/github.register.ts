import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the register github route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const registerWithGithub: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an example github";
  });
};

export default registerWithGithub;
