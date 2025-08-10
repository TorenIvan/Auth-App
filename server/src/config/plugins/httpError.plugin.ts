import { FastifyPluginAsync } from "fastify";
import { ZodError } from "zod";

const httpErrorPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    // Handle Fastify validation errors
    if (error.validation) {
      return reply.status(400).send({
        ...fastify.httpErrors.badRequest(error.message),
        details: error.validation,
      });
    }

    // Handle Zod errors with custom formatting
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
        code: err.code,
      }));

      return reply.status(400).send({
        ...fastify.httpErrors.badRequest("Request validation failed"),
        details: formattedErrors,
      });
    }

    // Fallback for other errors
    const statusCode = error.statusCode ?? 500;

    const fastifyError =
      statusCode >= 400 && statusCode < 600
        ? fastify.httpErrors.createError(statusCode, error.message)
        : fastify.httpErrors.internalServerError("Something went wrong");

    return reply.status(statusCode).send({
      error: fastifyError.name,
      message: fastifyError.message,
    });
  });
};

export default httpErrorPlugin;


