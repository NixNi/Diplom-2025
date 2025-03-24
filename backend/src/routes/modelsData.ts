import express from "express";
import { getFilePathModelWithName } from "../models/modelsData.model";

const modelData = express.Router();

modelData.get("/:modelName", getFilePathModelWithName);

export default modelData;
