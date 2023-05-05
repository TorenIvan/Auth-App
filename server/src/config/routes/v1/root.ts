import { FastifyInstance, FastifyPluginAsync } from "fastify";
import authRoutes from "./auth/root";

/**
 * Encapsulates all the routes belonging to api version 1
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const v1Routes: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.register(authRoutes, { prefix: "/auth" });
  // fastify.register(profileRoutes, { prefix: "/profile" });
};

export default v1Routes;
