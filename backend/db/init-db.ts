import { Database } from "bun:sqlite";
import path from "path";

export default function initDB() {
  const dbPath = path.join(__dirname, "data.db");
  const db = new Database(dbPath, { create: true });

  db.run(`
    CREATE TABLE IF NOT EXISTS models (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            data BLOB NOT NULL
        );
  `);

  db.run(`CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            data TEXT NOT NULL
        );`);

  db.run(`CREATE TABLE IF NOT EXISTS connections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          ip TEXT NOT NULL,
          port TEXT NOT NULL,
          UNIQUE(ip, port)
      );`);

  return db;
}
