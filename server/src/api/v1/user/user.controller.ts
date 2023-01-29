import { FastifyReply, FastifyRequest } from "fastify";
import { credsUserInput } from "./user.schema";

export const registerCredentialsHandler = async (
  request: FastifyRequest<{ Body: credsUserInput }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;
  return `Hello ${email}. You have a password of a ${password}`;
};
