import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient, Db } from 'mongodb';
import { EnvironmentVariables } from '../utils/constants/EnvironmentVariables';
import { Strings } from '../utils/constants/Strings';
import { logger } from '../utils/helpers';

/**
 * @description Encapsulates DataBase connect/disconnect operations
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 */
const databasePlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance): Promise<void> => {
  try {
    const client: MongoClient = new MongoClient(EnvironmentVariables.DatabaseUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      monitorCommands: true,
    });
    await client.connect();
    const db: Db = client.db(EnvironmentVariables.DatabaseName);

    await createIndexes(db);

    fastify.decorate('db', db);
    fastify.decorate('mongoClient', client);

    fastify.addHook('onClose', async () => {
      await client.close();
      fastify.log.info(Strings.CloseDB);
    });
  } catch (error) {
    console.error(error);
  }
});

export default databasePlugin;

async function createIndexes(db: Db) {
  const usersCollection = db.collection('users');

  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ email: 1, signInMethod: 1 });
  await usersCollection.createIndex({ isVerified: 1 });
  await usersCollection.createIndex({ isActive: 1 });
  await usersCollection.createIndex({ refreshToken: 1 });

  logger.debug('Database indexes created successfully');
}
