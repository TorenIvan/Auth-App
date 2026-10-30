import Fastify, { FastifyInstance } from 'fastify';
import fastifySensible from '@fastify/sensible';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { testDbUri, testDbName } from './setup';
import databasePlugin from '../config/plugins/database.plugin';
import loggerPlugin from '../config/plugins/logger.plugin';
import { DIPlugin } from '../config/plugins/di.plugin';
import { authMiddleware, userMiddleware } from '../config/middleware';
import { authRoutesV1 } from '../modules/auth/v1';
import { userRoutesV1 } from '../modules/user/v1';
import httpErrorPlugin from '../config/plugins/httpError.plugin';
import notFoundPlugin from '../config/plugins/notFound.plugin';
import { MAX_FILE_SIZE_MB } from '../config/utils/helpers/general/isFileSizeExceeded';

/**
 * @description Same plugins and order as app.ts. `beforeRoutes` lets a test declare extra routes
 * (e.g. one that throws) while the error handler is in place.
 */
export async function createTestApp(
  overrides: { DatabaseUri?: string; beforeRoutes?: (fastify: FastifyInstance) => void } = {}
): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: false,
  });

  const options = {
    DatabaseUri: overrides.DatabaseUri ?? testDbUri,
    DatabaseName: testDbName,
  };

  // Same request parsing as app.ts
  await fastify.register(cookie, { hook: 'onRequest', parseOptions: {} });
  await fastify.register(multipart, {
    addToBody: true,
    limits: {
      fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
      files: 1,
    },
  });
  await fastify.register(rateLimit, { global: false });

  await fastify.register(databasePlugin, options);
  await fastify.register(fastifySensible);
  await fastify.register(httpErrorPlugin, options);
  await fastify.register(loggerPlugin);
  await fastify.register(DIPlugin, options);
  await fastify.register(authMiddleware, options);
  await fastify.register(userMiddleware, options);
  overrides.beforeRoutes?.(fastify);
  await fastify.register(authRoutesV1(fastify.controllers.auth), options);
  await fastify.register(userRoutesV1(fastify.controllers.user), options);
  await fastify.register(notFoundPlugin, options);

  return fastify;
}
