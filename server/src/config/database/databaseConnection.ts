import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { MongoClient, Db, Collection } from "mongodb";
import User from "../../api/v1/models/User";
import { EnvironmentVariables } from "../utils/constants/EnvironmentVariables";
import { Strings } from "../utils/constants/Strings";

/**
 * Encapsulates DataBase connect/disconnect operations
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
const databaseConnectionPlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    try {
      const client: MongoClient = new MongoClient(
        EnvironmentVariables.DatabaseUri
      );
      await client.connect();

      const db: Db = client.db(EnvironmentVariables.DatabaseName);
      const users: Collection<User> = db.collection<User>("users");

      fastify
        .decorate("MongoDB", db)
        .decorate("User", users)
        .addHook("onClose", () => {
          console.error(Strings.CloseDB);
        });
    } catch (error) {
      console.error(error);
    }
  }
);

export default databaseConnectionPlugin;
