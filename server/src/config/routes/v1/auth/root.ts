import { FastifyInstance, FastifyPluginAsync } from "fastify";
import login from "./login/root";
import register from "./register/root";
import confirmEmail from "./confirmEmail";
import resetPassword from "./resetPassword";

/**
 * Encapsulates all the authentication routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const authRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify
    .register(login, { prefix: "/login" })
    .register(register, { prefix: "/register" })
    .register(confirmEmail, { prefix: "/verify" })
    .register(resetPassword, { prefix: "/reset-password" });
};

export default authRoutes;
