const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

db = db.getSiblingDB(dbName);

if (db.getUser(dbUsername) === null) {
  db.createUser({
    user: dbUsername,
    pwd: dbPassword,
    roles: [
      {
        role: "readWrite",
        db: dbName,
      },
    ],
  });
}
