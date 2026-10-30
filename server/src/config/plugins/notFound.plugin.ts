import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const notFoundPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.setNotFoundHandler((request, reply) => {
    if (process.env.NODE_ENV === 'production' && !request.url.startsWith('/api')) {
      return reply.sendFile('index.html');
    }

    const error = fastify.httpErrors.notFound(
      `Route ${request.method} ${request.url.split('?')[0]} not found`
    );
    reply.send(error);
  });
});

export default notFoundPlugin;
