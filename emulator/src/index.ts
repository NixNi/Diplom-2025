import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import socketManager from "./middleware/sockets";
import { setIO } from "./services/IO";

const app = express();
const port = process.env.PORT || 12537;
const whitelist = ["http://localhost:8046", "http://localhost:8045"];

// Создаем HTTP-сервер на основе Express
const httpServer = createServer(app);

// Настраиваем Socket.IO
const io =
  // setIO(httpServer, whitelist);
  new Server(httpServer, {
    cors: {
      origin: whitelist,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const middleware = [
  cors(corsOptions),
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  }),
  bodyParser.json({ limit: "50mb" }),
  cookieParser(),
];

middleware.forEach((it) => app.use(it));

app.get("/", (request, response) => {
  response.send("It is working api, you check manually");
});

// Обработка подключений Socket.IO
io.on("connection", socketManager);

// Запускаем HTTP-сервер вместо Express-сервера
httpServer.listen(port, () => console.log(`Running on port ${port}`));
