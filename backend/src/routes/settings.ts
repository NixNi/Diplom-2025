import express from "express";
import { getFilePathModelWithName } from "../models/settings.model";

const settingsRouter = express.Router();

settingsRouter.get("/:modelName", getFilePathModelWithName);

export default settingsRouter;
