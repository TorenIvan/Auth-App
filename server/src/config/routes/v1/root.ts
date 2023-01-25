import { FastifyInstance } from "fastify";
import authRoutes from "./auth/root";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const v1Routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoutes, { prefix: "/auth" });
};

export default v1Routes;
