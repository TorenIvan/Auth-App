const encodedDBPassword = encodeURI(String(process.env.DB_PASSWORD));
const DatabaseUri = `mongodb://${process.env.DB_USERNAME}:${encodedDBPassword}@${process.env.DB_URI}&AuthSource=${process.env.DB_NAME}`;

export const EnvironmentVariables = {
  DatabaseUri: DatabaseUri,
  DatabaseName: process.env.DB_NAME!,
  Access_Token_Secret: process.env.ACCESS_TOKEN_SECRET!,
  Refresh_Token_Secret: process.env.REFRESH_TOKEN_SECRET!,
  Access_Token_Expiration_Time: process.env.ACCESS_TOKEN_SECRET_EXPIRATION!,
  Refresh_Token_Expiration_Time: process.env.REFRESH_TOKEN_SECRET_EXPIRATION!,
} as const;
