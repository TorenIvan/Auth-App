import { config } from "dotenv";

config({ path: `../../../../.env.${process.env.NODE_ENV}` });
console.log("path: ", `../../../../.env.${process.env.NODE_ENV}`);

export const EnvironmentVariables = {
  DatabaseUri: process.env.DB_URI,
} as const;
