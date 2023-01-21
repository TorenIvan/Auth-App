import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the login route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const login: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: object
): Promise<void> => {
  fastify.get("/v1/auth/login/", async function (request, reply) {
    return "WTF is going on here; plz help";
  });
};

export default login;
