import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import UserController from "../../modules/user/v1/user.controller";
import UserService from "../../modules/user/v1/user.service";

const userServicePlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    const userService = new UserService(fastify.User);
    fastify.decorate("userService", userService);
  }
);

const userControllerPlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    if (!fastify.userService) {
      throw new Error("UserService must be registered before UserController");
    }
    const userController = new UserController(fastify.userService);
    fastify.decorate("userController", userController);
  }
);

export { userServicePlugin, userControllerPlugin };