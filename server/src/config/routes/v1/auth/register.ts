import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the register route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const register: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: Object
): Promise<void> => {
  fastify.get("/v1/auth/register/", async function (request, reply) {
    return "this is an example";
  });
};

export default register;
