import { FastifyInstance } from "fastify";
import login from "./login";
import register from "./register";

/**
 * Encapsulates the login route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const authRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify
    .register(login, { prefix: "/login" })
    .register(register, { prefix: "/register" });
};

export default authRoutes;
