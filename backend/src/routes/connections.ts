import express from "express";
import errorHandler from "src/hooks/errorHandler";
import {
  addConnection,
  getConnectionsPaginated,
  updateConnectionById,
  deleteConnectionById,
} from "./../models/connections.model";

const connectionsRouter = express.Router();

// Добавление новой связи
connectionsRouter.post("/", async (req, res) => {
  const { name, ip, port } = req.body;
  if (!name || !ip || !port) {
    res.status(400).json({
      status: "error",
      message: "Name, IP, and port are required",
    });
  } else
    await errorHandler(res, async () => {
      await addConnection(name, ip, port);
      res.json({
        status: "success",
        message: "Connection record added successfully",
      });
    });
});

// Получение связей постранично
connectionsRouter.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;
  if (page < 1 || perPage < 1) {
    res.status(400).json({
      status: "error",
      message: "Page and perPage must be positive integers",
    });
  } else
    await errorHandler(res, async () => {
      const connections = await getConnectionsPaginated(page, perPage);
      res.json({
        status: "success",
        data: connections,
      });
    });
});

// Обновление связи по ID
connectionsRouter.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, ip, port } = req.body;
  if (isNaN(id) || !name || !ip || !port) {
    res.status(400).json({
      status: "error",
      message: "Valid ID, name, IP, and port are required",
    });
  } else
    await errorHandler(res, async () => {
      await updateConnectionById(id, name, ip, port);
      res.json({
        status: "success",
        message: `Connection with ID ${id} updated successfully`,
      });
    });
});

// Проверка связи через ping
connectionsRouter.post("/ping", async (req, res) => {
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

connectionsRouter.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({
      status: "error",
      message: "Valid ID is required",
    });
  } else
    await errorHandler(res, async () => {
      await deleteConnectionById(id);
      res.json({
        status: "success",
        message: `Connection with ID ${id} deleted successfully`,
      });
    });
});

export default connectionsRouter;
