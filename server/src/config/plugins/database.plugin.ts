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
 * - Multiple requests share the same client, but use different pool connections.
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
const databasePlugin: FastifyPluginAsync<DatabasePluginOptions> = fp(
  async (fastify: FastifyInstance, options: DatabasePluginOptions): Promise<void> => {
    try {
      // Options take precedence (e.g. the in-memory test database), otherwise the environment
      const databaseUri: string = options.DatabaseUri ?? EnvironmentVariables.DatabaseUri;
      const databaseName: string | undefined =
        options.DatabaseName ?? EnvironmentVariables.DatabaseName;

      // Single client instance with connection pool for concurrent operations
      const client: MongoClient = new MongoClient(databaseUri, {
        maxPoolSize: 120, // Connection pool: up to 120 concurrent DB operations
        serverSelectionTimeoutMS: 5000, // Fail fast if DB unavailable
        socketTimeoutMS: 45000, // Drop long-hanging sockets
        monitorCommands: true, // Debug/logging support
      });
      await client.connect();

      // DB reference; shared across all requests safely
      const db: Db = client.db(databaseName);
      await createIndexes(db);

      // Decorate Fastify db and client instances for dependency injection
      fastify.decorate('db', db);
      fastify.decorate('mongoClient', client);

      fastify.addHook('onClose', async () => {
        await client.close();
        fastify.log.info(Strings.CloseDB);
      });
    } catch (error) {
      // Fail fast: the app must not stay up without a database
      logger.error(error);
      throw error;
    }
  }
);

export default databasePlugin;

interface DatabasePluginOptions {
  DatabaseUri?: string;
  DatabaseName?: string;
}

/**
 * @description Creates database indexes for optimal query performance.
 * Runs once during startup.
 */
async function createIndexes(db: Db) {
  const usersCollection = db.collection('users');
  const refreshTokensCollection = db.collection('refresh_tokens');

  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ email: 1, signInMethod: 1 });
  await usersCollection.createIndex({ isVerified: 1 });
  await usersCollection.createIndex({ isActive: 1 });

  await refreshTokensCollection.createIndex({ userId: 1, revoked: 1, expiresAt: 1 });
  await refreshTokensCollection.createIndex({ token: 1 }, { unique: true });
  // Expired sessions (including ones never revoked) delete themselves
  await refreshTokensCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await refreshTokensCollection.createIndex(
    { deleteAt: 1 },
    { expireAfterSeconds: 0, sparse: true } // sparse: true skips docs without deleteAt. Only documents with a deleteAt field are indexed.
  );

  logger.debug('Database indexes created successfully');
}
