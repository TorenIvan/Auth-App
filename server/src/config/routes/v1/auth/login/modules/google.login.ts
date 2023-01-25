import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the login with google route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const loginWithGoogle: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is a login example route with google";
  });
};

export default loginWithGoogle;
