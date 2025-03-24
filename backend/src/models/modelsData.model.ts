import { Request, Response } from "express";

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
