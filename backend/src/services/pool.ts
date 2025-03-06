import pgPromise from "pg-promise";

const pgp = pgPromise();

const dbConfig = {
  user: "postgres",
  password: "1234",
  database: "postgres",
  host: "localhost",
  port: 8047, // You may need to adjust the port
};

const db = pgp(dbConfig);

export default db;
