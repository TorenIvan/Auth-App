import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the login with credentials route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const loginWithCredentials: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is a login example route with credentials";
  });
};

export default loginWithCredentials;
