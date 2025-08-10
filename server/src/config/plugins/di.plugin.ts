import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import UserService from "../../modules/user/v1/user.service";
import UserController from "../../modules/user/v1/user.controller";

const DIPlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
  const userService = new UserService(fastify.db);
  const userController = new UserController(fastify.mongoClient, userService);

  fastify.decorate("services", {
    ...(fastify.services || {}),
    user: userService,
  });

  fastify.decorate("controllers", {
    ...(fastify.controllers || {}),
    user: userController,
  });
  }
);


export { DIPlugin };