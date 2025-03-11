import { Database } from "bun:sqlite";
import { readFileSync } from "fs";

// Функция для загрузки файла .glb в базу данных
function loadGlbFileToDb(dbPath, filePath, fileName) {
    // Открываем базу данных
    const db = new Database(dbPath);

    // Создаем таблицу, если она еще не существует
    db.run(`
        CREATE TABLE IF NOT EXISTS models (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            data BLOB NOT NULL
        );
    `);

    // Читаем файл .glb
    const fileData = readFileSync(filePath);
    console.log(fileData)
    // const data = fileData.buffer.slice(fileData.byteOffset, fileData.byteLength);
    // console.log(data)
    // Вставляем данные в таблицу
    const query = db.prepare(`
        INSERT INTO models (name, data) VALUES (?, ?);
    `);
    query.run(fileName, fileData);

    console.log(`Файл ${fileName} успешно загружен в базу данных.`);

    // Закрываем базу данных
    db.close();
}

// Пример использования функции
const dbPath = "./models.db";
const filePath = "./3DModels/tree.glb";
const fileName = "tree";

loadGlbFileToDb(dbPath, filePath, fileName);