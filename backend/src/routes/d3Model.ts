import express from "express";
import {
  getFilePathModelWithName,
  getModelByName,
} from "../models/d3Model.model";
import errorHandler from "src/hooks/errorHandler";

const d3ModelRouter = express.Router();

d3ModelRouter.get("/file/:modelName", getFilePathModelWithName);

d3ModelRouter.get("/db/:modelName", async (req, res) => {
  const modelName = req.params.modelName;
  //   await errorHandler(res, async () => {
  //     const model = await getModelByName(modelName);
  //     res.setHeader("Content-Type", "model/gltf-binary");
  //     res.send(model);
  //   });

  try {
    const model = await getModelByName(modelName);
    res.set("Content-Type", "model/gltf-binary");
    res.type(".glb");
    res.send(model);
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: err });
  }
});

export default d3ModelRouter;
