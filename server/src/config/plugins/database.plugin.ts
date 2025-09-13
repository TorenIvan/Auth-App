import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient, Db } from 'mongodb';
import { EnvironmentVariables } from '../utils/constants/EnvironmentVariables';
import { Strings } from '../utils/constants/Strings';
import { logger } from '../utils/helpers';

/**
 * @description
 * Database connection plugin using singleton pattern for optimal concurrency.
 *
 * **Concurrency Model**:
 * - Runs on `ONE process`, `ONE thread` (due to Node.js).
 * - Creates `ONE MongoClient` instance with connection pooling (120 connections max).
 * - Node.js event loop handles async I/O without blocking the main thread.
 * - Multiple requests share the same client but use different pool connections.
 * - Services can be singletons because DB operations are non-blocking.
 *
 * @example
 * Request 1 → Service → DB Query (async) → Event Loop → Other work
 * Request 2 → Service → DB Query (async) → Event Loop → Other work
 * Request 3 → Service → DB Query (async) → Event Loop → Other work
 * // Later when DB responds:
 * DB Response 1 → Callback Queue → Event Loop → Complete Request 1
 * DB Response 2 → Callback Queue → Event Loop → Complete Request 2
 *
 * @summary
 * Database connection plugin (singleton client + pooled connections).
 * Ensures non-blocking I/O with safe concurrent access across all requests.
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance.
 */
const databasePlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance): Promise<void> => {
  try {
    // Single client instance with connection pool for concurrent operations
    const client: MongoClient = new MongoClient(EnvironmentVariables.DatabaseUri, {
      maxPoolSize: 120, // Connection pool: up to 120 concurrent DB operations
      serverSelectionTimeoutMS: 5000, // Fail fast if DB unavailable
      socketTimeoutMS: 45000, // Drop long-hanging sockets
      monitorCommands: true, // Debug/logging support
    });
    await client.connect();

    // DB reference; shared across all requests safely
    const db: Db = client.db(EnvironmentVariables.DatabaseName);
    await createIndexes(db);

    // Decorate Fastify db and client instances for dependency injection
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

/**
 * @description Creates database indexes for optimal query performance.
 * Runs once during startup.
 */
async function createIndexes(db: Db) {
  const usersCollection = db.collection('users');

  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ email: 1, signInMethod: 1 });
  await usersCollection.createIndex({ isVerified: 1 });
  await usersCollection.createIndex({ isActive: 1 });
  await usersCollection.createIndex({ refreshToken: 1 });

  logger.debug('Database indexes created successfully');
}
