import { Database } from "bun:sqlite";
import path from "path";

const dbPath = path.resolve(__dirname, "../../db/models.db");
console.log(`Попытка подключения к базе данных по пути: ${dbPath}`);

const db = new Database(dbPath);

export default db;
