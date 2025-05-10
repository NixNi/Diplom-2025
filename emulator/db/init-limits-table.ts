import { Database } from "bun:sqlite";
import { readFile } from "fs/promises";

// Чтение JSON файла
async function readJsonFile() {
  try {
    const data = await readFile("limits.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Ошибка при чтении limits.json:", error);
    throw error;
  }
}

// Инициализация и заполнение базы данных
export default async function initLimitsTable() {
  // Создаем или открываем базу данных SQLite
  const db = new Database("parameters.db", { create: true });

  // Создаем таблицу limits, если она еще не существует
  db.run(`
    CREATE TABLE IF NOT EXISTS limits (
      Parameter TEXT PRIMARY KEY,
      Min REAL,
      Max REAL
    )
  `);

  try {
    // Читаем данные из JSON
    const jsonData = await readJsonFile() as Record<string, {max: number, min:number}>;

    // Подготовка SQL-запроса для вставки данных
    const insert = db.prepare(`
      INSERT OR REPLACE INTO limits (Parameter, Min, Max)
      VALUES (?, ?, ?)
    `);

    // Записываем каждую пару ключ-значение в таблицу
    for (const [parameter, limits] of Object.entries(jsonData)) {
      // Проверяем, что значение содержит min и max и они являются числами
      const minValue = Number(limits.min);
      const maxValue = Number(limits.max);
      if (isNaN(minValue) || isNaN(maxValue)) {
        console.warn(
          `Пропущено: ${parameter} содержит нечисловые min/max (${limits.min}, ${limits.max})`
        );
        continue;
      }
      insert.run(parameter, minValue, maxValue);
      console.log(
        `Записано: ${parameter} = { min: ${minValue}, max: ${maxValue} }`
      );
    }

    console.log("Данные лимитов успешно записаны в базу данных.");
  } catch (error) {
    console.error("Ошибка при записи в базу данных:", error);
  } finally {
    // Закрываем соединение с базой данных
    db.close();
  }
}
