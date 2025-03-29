import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

const transactionPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  fastify.decorateRequest("session", null); // Attach session to request

  fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.routerPath?.includes("/transactional")) { // Only start for specific routes
      request.session = fastify.MongoDB.client.startSession();
      request.session.startTransaction();
    }
  });

  fastify.addHook("onResponse", async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.session) {
      await request.session.commitTransaction();
      request.session.endSession();
      request.session = null;
    }
  });

  fastify.addHook("onError", async (request: FastifyRequest, reply: FastifyReply, error) => {
    if (request.session) {
      await request.session.abortTransaction();
      request.session.endSession();
      request.session = null;
    }
  });
});

export default transactionPlugin;
