import { FastifyInstance, FastifyPluginAsync } from "fastify";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const example: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: object
): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "this is an example";
  });
};

export default example;
