import express from "express";
import {
  getModelByName,
  addModel,
  updateModelByName,
  deleteModelByName,
} from "../models/d3Model.model";
import errorHandler from "src/hooks/errorHandler";

const d3ModelRouter = express.Router();

d3ModelRouter.get("/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
  await errorHandler(res, async () => {
    const model = await getModelByName(modelName);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(model));
  });
});

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
