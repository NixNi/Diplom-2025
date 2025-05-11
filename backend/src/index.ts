import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import modelsRouter from "./routes/models";
import settingsRouter from "./routes/settings";
import connectionsRouter from "./routes/connections";
import socketManager from "./middleware/sockets";

const app = express();
const server = createServer(app);
const whitelist = ["http://localhost:8046", "http://localhost:8045"];
const io = new Server(server, {
  cors: {
    origin: whitelist,
  },
});
const port = process.env.PORT || 8046;

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
      // callback(new Error("Not allowed by CORS"));
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

app.use("/api/models", modelsRouter);
app.use("/api/json", settingsRouter);
app.use("/api/connect", connectionsRouter);

io.on("connection", socketManager);

server.listen(port, () => console.log(`Running on port ${port}`));
