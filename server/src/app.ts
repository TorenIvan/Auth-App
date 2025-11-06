import { FastifyPluginAsync } from 'fastify';
import FastifyOverview from 'fastify-overview';
import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import cookie from '@fastify/cookie';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifySensible from '@fastify/sensible';
import { join, resolve } from 'path';
import { config } from 'dotenv';
import Fastify from 'fastify';
import { readFileSync } from 'fs';

const nodeEnv = process.env.NODE_ENV || 'development';
config({ path: resolve(__dirname, `../.env.${nodeEnv}`) });

import { DIPlugin } from './config/plugins/di.plugin';
import databasePlugin from './config/plugins/database.plugin';
import loggerPlugin from './config/plugins/logger.plugin';
import httpErrorPlugin from './config/plugins/httpError.plugin';
import notFoundPlugin from './config/plugins/notFound.plugin';
import { authMiddleware, userMiddleware } from './config/middleware';
import { authRoutesV1 } from './modules/auth/v1';
import { userRoutesV1 } from './modules/user/v1';

export type AppOptions = Partial<AutoloadPluginOptions>;

const appPlugin: FastifyPluginAsync<AppOptions> = async (fastify, options): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    await fastify.register(FastifyOverview);
    await fastify.register(cors, {
      origin: process.env.CLIENT_URI,
      methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
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
  }

  await fastify.register(fastifyHelmet, {
    global: true,
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production'
        ? {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
              connectSrc: ["'self'"],
            },
          }
        : false,
  });

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
  await fastify.register(
    async function (api) {
      api.addHook('onRequest', async (request, reply) => {
        if (request.method !== 'GET') return;
        const accept = request.headers.accept || '';
        const isBrowserNavigation = accept.includes('text/html');
        if (isBrowserNavigation && process.env.NODE_ENV === 'production') {
          return reply.sendFile('index.html');
        }
      });
      await api.register(authRoutesV1(api.controllers.auth));
      await api.register(userRoutesV1(api.controllers.user));
    },
    { prefix: '/api' }
  );
  await fastify.register(httpErrorPlugin, options);
  await fastify.register(notFoundPlugin, options);

  if (process.env.NODE_ENV === 'production') {
    await fastify.register(fastifyStatic, {
      root: resolve(__dirname, '../../client/dist'),
      prefix: '/',
      wildcard: false,
    });
  }
};

if (require.main === module) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const fastify = Fastify({
    logger: true,
    ...(isDevelopment && {
      https: {
        key: readFileSync(resolve(__dirname, '../key.pem')),
        cert: readFileSync(resolve(__dirname, '../cert.pem')),
      },
    }),
  });

  fastify.register(appPlugin);

  const start = async () => {
    try {
      const port = Number(process.env.PORT) || 3000;
      const host = isDevelopment ? 'localhost' : '0.0.0.0';

      await fastify.listen({ port, host });

      const protocol = isDevelopment ? 'https' : 'http';
      console.log(`🚀 Server running on ${protocol}://${host}:${port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

  start();
}

export default appPlugin;
