export function retrieveDBUrl() {
  try {
    const encodedDBPassword = encodeURI(String(process.env.DB_PASSWORD));
    const DatabaseUri = `mongodb://${process.env.DB_USERNAME}:${encodedDBPassword}@${process.env.DB_URI}&AuthSource=${process.env.DB_NAME}`;
    return DatabaseUri;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
