import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { MongoClient, Db} from "mongodb";
import { EnvironmentVariables } from "../utils/constants/EnvironmentVariables";
import { Strings } from "../utils/constants/Strings";

/**
 * @description Encapsulates DataBase connect/disconnect operations
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
const databasePlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance): Promise<void> => {
    try {
      const client: MongoClient = new MongoClient(EnvironmentVariables.DatabaseUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        monitorCommands: true,
      });
      await client.connect();
      const db: Db = client.db(EnvironmentVariables.DatabaseName);

      fastify.decorate("db", db);
      fastify.decorate("mongoClient", client);

      fastify.addHook("onClose", async () => {
        await client.close();
        fastify.log.info(Strings.CloseDB);
      });
    } catch (error) {
      console.error(error);
    }
  }
);

export default databasePlugin;
