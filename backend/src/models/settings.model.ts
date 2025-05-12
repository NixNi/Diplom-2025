import { Request, Response } from "express";
import db from "src/services/SQLiteConnection";
import model from "src/types/model";

const path = require("path");

export async function getFilePathModelWithName(req: Request, res: Response) {
  const modelName = req.params.modelName;
  const modelPath = path.join(
    __dirname,
    "..",
    "..",
    "db",
    "3DModels",
    `${modelName}.json`
  );

  res.sendFile(modelPath, (err) => {
    if (err) {
      res.status(404).send(`Model not found ${modelPath}`);
    }
  });
}

export async function getSettingsByName(modelName: string) {
  const query = db.query(`SELECT * FROM models WHERE name = '${modelName}'`);
  const result = query.get() as model | null;
  if (!result) throw Error(`Object ${modelName} not found in the database`);
  const modelData = result.settings;
  return JSON.parse(modelData);
}
