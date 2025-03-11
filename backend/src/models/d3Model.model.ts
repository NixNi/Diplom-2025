import db from "src/services/pool";
import model from "src/types/model";


export async function getModelByName(modelName: string) {
  const query = db.query(`SELECT * FROM models WHERE name = '${modelName}'`);
  const result = query.get() as (model | null);
  if (!result) throw Error(`Object ${modelName} not found in the database`)
  const modelData = result.data;
  return modelData;
}


