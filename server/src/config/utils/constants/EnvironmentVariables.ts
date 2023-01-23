export const EnvironmentVariables = {
  DatabaseUri: `mongodb://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_URI}`,
} as const;
