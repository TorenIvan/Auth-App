import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the login with twitter route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const loginWithTwitter: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is a login example route with twitter";
  });
};

export default loginWithTwitter;
