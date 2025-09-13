import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import UserService from '../../modules/user/v1/user.service';
import UserController from '../../modules/user/v1/user.controller';
import AuthService from '../../modules/auth/v1/auth.service';
import AuthController from '../../modules/auth/v1/auth.controller';

/**
 * @description
 * Dependency Injection plugin - creates singleton services and wires controllers.
 *
 * **Pattern:**
 * - Services are singletons sharing the same DB connection.
 * - Controllers receive dependencies via constructor injection.
 * - All wiring happens in one place (composition root).
 *
 * @param {FastifyInstance} fastify - The encapsulated Fastify instance.
 */
const DIPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  // Instantiate services (singletons) by passing db instance as a dependency
  const authService = new AuthService(fastify.db);
  const userService = new UserService(fastify.db);

  // Instantiate controllers with required dependencies
  const authController = new AuthController(authService);
  const userController = new UserController(fastify.mongoClient, userService, authService);

  // Decorate Fastify with services
  fastify.decorate('services', {
    ...(fastify.services || {}),
    auth: authService,
    user: userService,
  });

  // Decorate Fastify with controllers
  fastify.decorate('controllers', {
    ...(fastify.controllers || {}),
    auth: authController,
    user: userController,
  });
});

export { DIPlugin };
