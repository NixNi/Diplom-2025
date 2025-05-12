import express from "express";
import { getSettingsByName } from "../models/settings.model";
import errorHandler from "src/hooks/errorHandler";

const settingsRouter = express.Router();

// settingsRouter.get("/:modelName", getFilePathModelWithName);
settingsRouter.get("/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
  await errorHandler(res, async () => {
    const result = await getSettingsByName(modelName);
    res.json(result);
  });
});
export default settingsRouter;
