import { FastifyReply, FastifyRequest } from "fastify";
import { credsUserInput } from "./user.schema";

export async function registerCredentialsHandler(
  request: FastifyRequest<{ Body: credsUserInput }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;
  reply.code(201);
  return `Hello ${email}. You have a password of a ${password}`;
}
