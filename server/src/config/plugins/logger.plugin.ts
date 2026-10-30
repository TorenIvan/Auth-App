import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { logger } from '../utils/helpers';

/**
 * The route pattern is logged instead of the raw URL: query strings carry email and reset tokens.
 */
const routeOf = (request: FastifyRequest): string =>
  request.routeOptions.url ?? request.url.split('?')[0];

const loggerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request) => {
    logger.info({ method: request.method, url: routeOf(request) }, 'Incoming request');
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const statusCode = reply.statusCode;
    logger.info({ method: request.method, url: routeOf(request), statusCode }, 'Request completed');
  });
};

export default fp(loggerPlugin);
