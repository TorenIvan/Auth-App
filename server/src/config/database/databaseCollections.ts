import User from "../../api/v1/models/User";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Collection } from "mongodb";

/**
 * Encapsulates db collections and decorates them, for global access on fastify root context
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
const databaseCollectionsPlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    const users: Collection<User> = fastify.MongoDB.collection<User>("users");
    fastify.decorate("User", users);
  }
);

export default databaseCollectionsPlugin;
