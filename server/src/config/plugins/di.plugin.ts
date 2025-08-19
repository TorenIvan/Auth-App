import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import UserService from '../../modules/user/v1/user.service';
import UserController from '../../modules/user/v1/user.controller';
import AuthService from '../../modules/auth/v1/auth.service';
import AuthController from '../../modules/auth/v1/auth.controller';

const DIPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  const authService = new AuthService(fastify.db);
  const userService = new UserService(fastify.db);
  const authController = new AuthController(authService);
  const userController = new UserController(fastify.mongoClient, userService, authService);

  fastify.decorate('services', {
    ...(fastify.services || {}),
    auth: authService,
    user: userService,
  });

  fastify.decorate('controllers', {
    ...(fastify.controllers || {}),
    auth: authController,
    user: userController,
  });
});

export { DIPlugin };
