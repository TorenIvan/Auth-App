import { FastifyPluginAsync } from 'fastify';

const notFoundPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setNotFoundHandler((request, reply) => {
    if (process.env.NODE_ENV === 'production' && !request.url.startsWith('/api')) {
      return reply.sendFile('index.html');
    }

    const error = fastify.httpErrors.notFound(`Route ${request.method} ${request.url} not found`);
    reply.send(error);
  });
};

export default notFoundPlugin;
