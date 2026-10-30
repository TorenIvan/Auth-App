import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';

/**
 * @description Registered with fastify-plugin and before the routes: a route keeps the error handler
 * that exists when the route is declared, so registering it later never applies it.
 */
const httpErrorPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    // Handle Fastify validation errors
    if (error.validation) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: error.message,
        details: error.validation,
      });
    }

    // Handle Zod errors with custom formatting
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      return reply.status(400).send({
        error: 'Bad Request',
        message: 'Request validation failed',
        details: formattedErrors,
      });
    }

    // Fallback for other errors
    const statusCode = error.statusCode ?? 500;

    const defaultMessages: Record<number, string> = {
      400: 'Invalid request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not found',
      500: 'Internal server error',
    };

    // Internal error messages never reach the client
    const message =
      statusCode >= 500
        ? defaultMessages[500]
        : (error.message ?? defaultMessages[statusCode] ?? 'Something went wrong');
    const errorName =
      statusCode >= 400 && statusCode < 600
        ? (defaultMessages[statusCode]?.split(' ')[0] ?? 'Error')
        : 'InternalError';

    return reply.status(statusCode).send({
      error: errorName,
      message,
    });
  });
});

export default httpErrorPlugin;
