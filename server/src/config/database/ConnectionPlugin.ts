import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { MongoClient, Db, Collection } from "mongodb";
import Image from "../../api/v1/image/image.model";
import User from "../../api/v1/user/user.model";
import { EnvironmentVariables } from "../utils/constants/EnvironmentVariables";
import { Strings } from "../utils/constants/Strings";

/**
 * Encapsulates DataBase connect/disconnect operations
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
const databasePlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance): Promise<void> => {
    try {
      const client: MongoClient = new MongoClient(
        EnvironmentVariables.DatabaseUri,
        {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          monitorCommands: true,
          /**
           * To be added...
           */
          // tls: !EnvironmentVariables.IsProduction,
          // tlsAllowInvalidCertificates: !EnvironmentVariables.IsProduction,
        }
      );

      await client.connect();

      const db: Db = client.db(EnvironmentVariables.DatabaseName);
      const users: Collection<User> = db.collection<User>("users");
      const images: Collection<Image> = db.collection<Image>("images");

      fastify
        .decorate("MongoDB", db)
        .decorate("User", users)
        .decorate("Image", images)
        .addHook("onClose", () => {
          console.error(Strings.CloseDB);
        });

      // await users.updateMany(
      //   { schemaVersion: { $exists: false } },
      //   {
      //     $set: { schemaVersion: 1 },
      //   }
      // );
    } catch (error) {
      console.error(error);
    }
  }
);

export default databasePlugin;
