import { FastifyPluginAsync } from 'fastify';

const notFoundPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setNotFoundHandler((request, reply) => {
    const error = fastify.httpErrors.notFound(`Route ${request.method} ${request.url} not found`);
    reply.send(error);
  });
};

export default notFoundPlugin;
