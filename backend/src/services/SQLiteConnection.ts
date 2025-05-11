// import { Database } from "bun:sqlite";
import initDB from "db/init-db";
import path from "path";

const dbPath = path.resolve(__dirname, "../../db/data.db");
console.log(`Попытка подключения к базе данных по пути: ${dbPath}`);

const db = initDB();

export default db;
