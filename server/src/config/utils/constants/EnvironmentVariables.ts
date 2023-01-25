const encodedDBPassword = encodeURI(String(process.env.DB_PASSWORD));
const DatabaseUri = `mongodb://${process.env.DB_USERNAME}:${encodedDBPassword}@${process.env.DB_URI}&AuthSource=${process.env.DB_NAME}`;

export const EnvironmentVariables = {
  DatabaseUri: DatabaseUri,
  CloseDB: "Closing DataBase...",
} as const;
