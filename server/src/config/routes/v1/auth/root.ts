import { FastifyInstance, FastifyPluginAsync } from "fastify";
import login from "./login/root";
import register from "./register/root";

/**
 * Encapsulates all the authentication routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const authRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify
    .register(login, { prefix: "/login" })
    .register(register, { prefix: "/register" });
};

export default authRoutes;
