import { FastifyReply, FastifyRequest } from "fastify";

const registerCredentialsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return JSON.stringify(request.body);
};

export { registerCredentialsHandler };
