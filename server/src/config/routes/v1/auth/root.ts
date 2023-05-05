import { FastifyInstance, FastifyPluginAsync } from "fastify";
import login from "./login/root";
import register from "./register/root";
import logout from "./logout";
import confirmEmail from "./confirmEmail";
import resetPassword from "./resetPassword";
import forgotPassword from "./forgotPassword";
import refreshTokens from "./refreshTokens";

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
    .register(forgotPassword, { prefix: "/forgot-password" })
    .register(resetPassword, { prefix: "/reset-password" })
    .register(refreshTokens, { prefix: "/refresh" })
    .register(logout, { prefix: "/logout" });
};

export default authRoutes;
