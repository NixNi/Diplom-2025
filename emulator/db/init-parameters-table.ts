import { Database } from "bun:sqlite";
import { readFile } from "fs/promises";

async function readJsonFile() {
  try {
    const data = await readFile("init.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Ошибка при чтении init.json:", error);
    throw error;
  }
}

export default async function initParametersTable() {
  const db = new Database("parameters.db", { create: true });

  db.run(`
    CREATE TABLE IF NOT EXISTS parameters (
      Parameter TEXT PRIMARY KEY,
      Value REAL
    )
  `);

  try {
    const jsonData = await readJsonFile();

    const insert = db.prepare(`
      INSERT OR REPLACE INTO parameters (Parameter, Value)
      VALUES (?, ?)
    `);

    for (const [parameter, value] of Object.entries(jsonData)) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        console.warn(`Пропущено: ${parameter} не является числом (${value})`);
        continue;
      }
      insert.run(parameter, numValue);
      console.log(`Записано: ${parameter} = ${numValue}`);
    }

    console.log("Данные успешно записаны в базу данных.");
  } catch (error) {
    console.error("Ошибка при записи в базу данных:", error);
  } finally {
    db.close();
  }
}
