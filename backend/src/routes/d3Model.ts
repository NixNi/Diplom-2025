import express from "express";
import { getFilePathModelWithName } from "../models/d3Model.model";

const d3ModelRouter = express.Router();

d3ModelRouter.get("/file/:modelName", getFilePathModelWithName) 

export default d3ModelRouter;
