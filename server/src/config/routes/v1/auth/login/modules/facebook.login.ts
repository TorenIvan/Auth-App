import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the login with facebook route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const loginWithFacebook: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is a login example route with facebook";
  });
};

export default loginWithFacebook;
