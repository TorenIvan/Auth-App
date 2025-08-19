import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError, ZodSchema } from 'zod';

export async function validateRequestBody<T>(
  request: FastifyRequest,
  reply: FastifyReply,
  schema: ZodSchema<T>
): Promise<void> {
  try {
    request.body = await schema.parseAsync(request.body);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return reply.status(400).send(firstError);
    }
    return reply.status(400).send(error);
  }
}

export async function validateRequestQuery<T>(
  request: FastifyRequest,
  reply: FastifyReply,
  schema: ZodSchema<T>
): Promise<void> {
  try {
    request.query = await schema.parseAsync(request.query);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      return reply.status(400).send(firstError);
    }
    return reply.status(400).send(error);
  }
}
