import express from "express";
import {
  getModelByName,
  addModel,
  updateModelByName,
  deleteModelByName,
  getAllModelNames,
} from "../models/d3Model.model";
import errorHandler from "src/hooks/errorHandler";

const d3ModelRouter = express.Router();

// Получение всех имен моделей с их ID
d3ModelRouter.get("/", async (req, res) => {
  await errorHandler(res, async () => {
    const models = await getAllModelNames();
    res.json({ status: "success", data: models });
  });
});

// Получение модели по имени
d3ModelRouter.get("/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
  await errorHandler(res, async () => {
    const model = await getModelByName(modelName);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(model));
  });
});

// Добавление новой модели
d3ModelRouter.post("/", async (req, res) => {
  const { name, data } = req.body;
  await errorHandler(res, async () => {
    await addModel(name, data);
    res.json({
      status: "success",
      message: `Model ${name} added successfully`,
    });
  });
});

// Обновление модели по имени
d3ModelRouter.put("/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
  const { data } = req.body;
  await errorHandler(res, async () => {
    await updateModelByName(modelName, data);
    res.json({
      status: "success",
      message: `Model ${modelName} updated successfully`,
    });
  });
});

// Удаление модели по имени
d3ModelRouter.delete("/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
  await errorHandler(res, async () => {
    await deleteModelByName(modelName);
    res.json({
      status: "success",
      message: `Model ${modelName} deleted successfully`,
    });
  });
});

export default d3ModelRouter;
