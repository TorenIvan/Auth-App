import { FastifyInstance, FastifyPluginAsync } from "fastify";
import UserController from "../../../../../api/v1/user/user.controller";

/**
 * Encapsulates the logout operation route
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const logout: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.post("/", {}, new UserController(fastify).logout);
};

export default logout;
