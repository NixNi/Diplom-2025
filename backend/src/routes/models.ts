import express from "express";
import multer from "multer";
import {
  getModelByName,
  addModel,
  updateModelByName,
  deleteModelByName,
  getAllModelNames,
} from "../models/models.model";
import errorHandler from "src/hooks/errorHandler";

const modelsRouter = express.Router();
const upload = multer();

// Получение всех имен моделей с их ID
modelsRouter.get("/", async (req, res) => {
  await errorHandler(res, async () => {
    const models = await getAllModelNames();
    res.json({ status: "success", data: models });
  });
});

// Получение модели по имени
modelsRouter.get("/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
  await errorHandler(res, async () => {
    const model = await getModelByName(modelName);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(model));
  });
});

// Добавление новой модели
modelsRouter.post("/", upload.single("data"), async (req, res) => {
  const { name, settings } = req.body;

  await errorHandler(res, async () => {
    if (!req.file?.buffer) throw new Error("Model is missing");
    const data = req.file.buffer; // Получаем бинарные данные из файла
    await addModel(name, data, settings);
    res.json({
      status: "success",
      message: `Model ${name} added successfully`,
    });
  });
});

modelsRouter.put("/:modelName", upload.single("data"), async (req, res) => {
  const { name, settings } = req.body;

  await errorHandler(res, async () => {
    // if (!req.file?.buffer) throw new Error("Model is missing");
    const data = req.file?.buffer; // Получаем бинарные данные из файла
    await updateModelByName(name, { newData: data, settings });
    res.json({
      status: "success",
      message: `Model ${name} updated successfully`,
    });
  });
});

// Удаление модели по имени
modelsRouter.delete("/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
  await errorHandler(res, async () => {
    await deleteModelByName(modelName);
    res.json({
      status: "success",
      message: `Model ${modelName} deleted successfully`,
    });
  });
});

export default modelsRouter;
