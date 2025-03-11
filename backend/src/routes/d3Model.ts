import express from "express";
import {
  getModelByName,
} from "../models/d3Model.model";
import errorHandler from "src/hooks/errorHandler";

const d3ModelRouter = express.Router();

d3ModelRouter.get("/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
    await errorHandler(res, async () => {
      const model = await getModelByName(modelName);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(Buffer.from(model));
    });
});

export default d3ModelRouter;
