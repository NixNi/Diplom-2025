import { Request, Response } from "express";
import db from "src/services/pool";
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
    `${modelName}.glb`
  );

  res.sendFile(modelPath, (err) => {
    if (err) {
      res.status(404).send(`Model not found ${modelPath}`);
    }
  });
}


export async function getModelByName(modelName: string) {
  const query = db.query(`SELECT data FROM models WHERE name = '${modelName}'`);
  const result:model = query.get() as model;
  const modelData = result.data;
  return modelData;
}


