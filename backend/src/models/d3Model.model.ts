import db from "src/services/pool";
import model from "src/types/model";

export async function getModelByName(modelName: string) {
  const query = db.query(`SELECT * FROM models WHERE name = '${modelName}'`);
  const result = query.get() as model | null;
  if (!result) throw Error(`Object ${modelName} not found in the database`);
  const modelData = result.data;
  return modelData;
}

export async function addModel(name: string, data: Buffer) {
  const query = db.query(`INSERT INTO models (name, data) VALUES (?, ?)`);
  query.run(name, data);
}

export async function updateModelByName(modelName: string, newData: Buffer) {
  const query = db.query(`UPDATE models SET data = ? WHERE name = ?`);
  query.run(newData, modelName);
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
