import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import UserService from "../../modules/user/v1/user.service";

const userServicePlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    const userService = new UserService(fastify.User);
    fastify.decorate("userService", userService);
  }
);


export { userServicePlugin};