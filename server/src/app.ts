import { FastifyPluginAsync } from 'fastify';
import FastifyOverview from 'fastify-overview';
import fastifyHelmet from '@fastify/helmet';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import cookie from '@fastify/cookie';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifySensible from '@fastify/sensible';
import { join, resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

import { DIPlugin } from './config/plugins/di.plugin';
import databasePlugin from './config/plugins/database.plugin';
import loggerPlugin from './config/plugins/logger.plugin';
import httpErrorPlugin from './config/plugins/httpError.plugin';
import notFoundPlugin from './config/plugins/notFound.plugin';
import { authMiddleware, userMiddleware } from './config/middleware';
import { authRoutesV1 } from './modules/auth/v1';
import { userRoutesV1 } from './modules/user/v1';

export type AppOptions = {
  // Place your custom options for app below here.
  https: {
    key: '../key.pem';
    cert: '../cert.pem';
  };
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (fastify, options): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    await fastify.register(FastifyOverview);
  }

  await fastify.register(cors, {
    origin: process.env.CLIENT_URI,
    methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      process.env.COOKIE_NAME!,
      process.env.RESET_PASS_COOKIE_NAME!,
    ],
    credentials: true,
    exposedHeaders: [
      'Content-Type',
      'Authorization',
      process.env.COOKIE_NAME!,
      process.env.RESET_PASS_COOKIE_NAME!,
    ],
  });

  await fastify.register(fastifyHelmet, { global: true });

  await fastify.register(cookie, {
    hook: 'onRequest',
    parseOptions: {},
  } as FastifyCookieOptions);

  await fastify.register(multipart, {
    addToBody: true,
    limits: {
      fileSize: 16 * 1024 * 1024,
      files: 1,
    },
  });

  await fastify.register(databasePlugin, options);
  await fastify.register(AutoLoad, {
    dir: join(__dirname, './config/utils'),
    options: options,
  });
  await fastify.register(fastifySensible);
  await fastify.register(loggerPlugin);
  await fastify.register(DIPlugin);
  await fastify.register(authMiddleware, options);
  await fastify.register(userMiddleware, options);
  await fastify.register(authRoutesV1(fastify.controllers.auth), options);
  await fastify.register(userRoutesV1(fastify.controllers.user), options);
  await fastify.register(httpErrorPlugin, options);
  await fastify.register(notFoundPlugin, options);
};

export default app;
