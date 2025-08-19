import { beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, `../../.env.test`) });

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
  process.env.DB_USERNAME = "";
  process.env.DB_PASSWORD = "";

  // Create a client for test utilities
  mongoClient = new MongoClient(testDbUri);
  await mongoClient.connect();
}, 60000);

afterAll(async () => {
  await mongoClient?.close();
  await mongoServer?.stop();
});

beforeEach(async () => {
  // Clean database before each test
  const db = mongoClient.db(testDbName);
  const collections = await db.listCollections().toArray();
  
  for (const collection of collections) {
    await db.collection(collection.name).deleteMany({});
  }
});
