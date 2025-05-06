import express from "express";
import errorHandler from "src/hooks/errorHandler";
import { WsConnect } from "src/services/wsConnection";


const connectionRouter = express.Router();

// Получение всех имен моделей с их ID
connectionRouter.get("/", async (req, res) => {
  await errorHandler(res, async () => {
    console.log(req.params)
    res.json({
      status: "success",
      message: `Data set succesfully`,
    });
  });
});



// Добавление новой модели
connectionRouter.post("/", async (req, res) => {
  console.log(req.body)
  await errorHandler(res, async () => {
    WsConnect(req.body.ip, req.body.port)
    res.json({
      status: "success",
      message: `Model data added successfully`,
    });
  });
});

export default connectionRouter;
