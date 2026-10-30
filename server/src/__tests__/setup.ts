import { beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, `../../.env.test`), quiet: true });

/**
 * *** No network requests may leave the test environment ***
 * - Emails are captured instead of sent (tests read the link token from the mock calls).
 * - Provider calls (OAuth) reject unless a test defines an explicit response.
 * - fetch is disabled as a backstop (Resend uses it).
 */
vi.mock('../config/utils/helpers/general/sendEmail', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('axios', () => {
  const networkDisabled = () => Promise.reject(new Error('Network disabled in tests'));
  const axiosMock = { get: vi.fn(networkDisabled), post: vi.fn(networkDisabled) };
  return { default: axiosMock, ...axiosMock };
});

Object.assign(globalThis, { fetch: () => Promise.reject(new Error('Network disabled in tests')) });

let mongoServer: MongoMemoryServer;
let mongoClient: MongoClient;

export let testDbUri: string;
export let testDbName: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  testDbUri = mongoServer.getUri();
  testDbName = process.env.DB_NAME || 'test_db';

  process.env.DB_URI = testDbUri;
  process.env.DB_NAME = testDbName;
  process.env.DB_USERNAME = '';
  process.env.DB_PASSWORD = '';

  // Create a client for test utilities
  mongoClient = new MongoClient(testDbUri);
  await mongoClient.connect();
}, 60000);

afterAll(async () => {
  await mongoClient?.close();
  await mongoServer?.stop();
});

beforeEach(async () => {
  const db = mongoClient.db(testDbName);
  const collections = await db.listCollections().toArray();

  for (const collection of collections) {
    await db.collection(collection.name).deleteMany({});
  }
});
