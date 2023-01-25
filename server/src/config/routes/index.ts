import { FastifyInstance, FastifyPluginAsync } from "fastify";
import v1Routes from "./v1/root";

/**
 * Encapsulates all the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
const routes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: object
): Promise<void> => {
  fastify.register(v1Routes, { prefix: "/v1" });
};

export default routes;
