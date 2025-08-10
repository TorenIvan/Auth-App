import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { logger } from "../utils/helpers";

const loggerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (request) => {
    const { method, url } = request.raw;
    logger.info({ method, url }, "Incoming request");
  });

  fastify.addHook("onResponse", async (request, reply) => {
    const { method, url } = request.raw;
    const statusCode = reply.statusCode;
    logger.info({ method, url, statusCode }, "Request completed");
  });
};

export default fp(loggerPlugin);
