import Fastify, { FastifyInstance } from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import fastifySensible from '@fastify/sensible';
import { join } from 'path';
import { testDbUri, testDbName } from './setup';
import databasePlugin from '../config/plugins/database.plugin';
import loggerPlugin from '../config/plugins/logger.plugin';
import { DIPlugin } from '../config/plugins/di.plugin';
import { authMiddleware, userMiddleware } from '../config/middleware';
import { authRoutesV1 } from '../modules/auth/v1';
import { userRoutesV1 } from '../modules/user/v1';
import httpErrorPlugin from '../config/plugins/httpError.plugin';
import notFoundPlugin from '../config/plugins/notFound.plugin';

export async function createTestApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: false,
  });

  const options = {
    DatabaseUri: testDbUri,
    DatabaseName: testDbName,
  };

  await fastify.register(databasePlugin, options);
  await fastify.register(fastifyAutoload, {
    dir: join(__dirname, '../src/config/utils'),
    options: options,
  });
  await fastify.register(fastifySensible);
  await fastify.register(loggerPlugin);
  await fastify.register(DIPlugin, options);
  await fastify.register(authMiddleware, options);
  await fastify.register(userMiddleware, options);
  await fastify.register(authRoutesV1(fastify.controllers.auth), options);
  await fastify.register(userRoutesV1(fastify.controllers.user), options);
  await fastify.register(httpErrorPlugin, options);
  await fastify.register(notFoundPlugin, options);

  return fastify;
}
