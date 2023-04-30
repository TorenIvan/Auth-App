import { FastifyInstance, FastifyPluginAsync } from "fastify";
import UserController from "../../../../../api/v1/user/user.controller";
import { $ref } from "../../../../../api/v1/user/user.schema";

/**
 * Encapsulates the refresh token verification and renewing tokens
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 */
const refreshTokens: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.addHook("onRequest", async (request, reply) => {
    await fastify.verifyRefreshTokenCookie(request, reply);
  });
  fastify.get(
    "/",
    {
      schema: {
        response: { 200: $ref("authCredsUserResponseSchema") },
      },
    },
    new UserController(fastify).renewTokens
  );
};

export default refreshTokens;
