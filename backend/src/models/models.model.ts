import db from "src/services/SQLiteConnection";
import model from "src/types/model";

export async function getModelByName(modelName: string) {
  const query = db.query(`SELECT * FROM models WHERE name = '${modelName}'`);
  const result = query.get() as model | null;
  if (!result) throw Error(`Object ${modelName} not found in the database`);
  const modelData = result.data;
  return modelData;
}

export async function addModel(name: string, data: Buffer, settings: string) {
  const query = db.query(
    `INSERT INTO models (name, data, settings) VALUES (?, ?, ?)`
  );
  query.run(name, data, settings);
}

export async function updateModelByName(
  modelName: string,
  options: {
    newData?: Buffer;
    settings?: string;
  }
) {
  // Если не передано ни одного параметра для обновления - ничего не делаем
  if (!options.newData && !options.settings) {
    return;
  }

  const updateParts: string[] = [];
  const params: (Buffer | string)[] = [];

  if (options.newData) {
    updateParts.push("data = ?");
    params.push(options.newData);
  }

  if (options.settings) {
    updateParts.push("settings = ?");
    params.push(options.settings);
  }

  // Добавляем modelName в конец массива параметров для условия WHERE
  params.push(modelName);

  const query = db.query(
    `UPDATE models SET ${updateParts.join(", ")} WHERE name = ?`
  );
  query.run(...params);
}

export async function deleteModelByName(modelName: string) {
  const query = db.query(`DELETE FROM models WHERE name = ?`);
  query.run(modelName);
}

export async function getAllModelNames() {
  const query = db.query(`SELECT id, name FROM models`);
  const result = query.all() as { id: number; name: string }[];
  return result;
}
