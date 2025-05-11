import express from "express";
import errorHandler from "src/hooks/errorHandler";

const connectionRouter = express.Router();

// Добавление новой модели
connectionRouter.post("/", async (req, res) => {
  // console.log(req.body);
  await errorHandler(res, async () => {
    // WsConnect(req.body.ip, req.body.port)
    res.json({
      status: "success",
      message: `Model data added successfully`,
    });
  });
});

// Добавление новой модели
connectionRouter.post("/ping", async (req, res) => {
  // console.log(req.body);
  try {
    const url = `http://${req.body.ip}:${req.body.port}`;
    const response = await fetch(`${url}/ping`);
    if (response.status == 200)
      res.json({
        status: "success",
        message: `pong`,
      });
  } catch (e: any) {
    res.status(502);
    res.json({
      status: "Bad Gateway",
      message: e?.message,
    });
  }
});

export default connectionRouter;
