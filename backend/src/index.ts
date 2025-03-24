import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import d3ModelRouter from "./routes/d3Model";
import modelData from "./routes/modelsData";

const server = express();
const port = process.env.PORT || 8046;
const whitelist = ["http://localhost:8046", "http://localhost:8045"];
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

middleware.forEach((it) => server.use(it));

server.get("/", (request, response) => {
  response.send("It is working api, you check manually");
});

server.use("/api/models", d3ModelRouter);
server.use("/api/json", modelData)

server.listen(port, () => console.log(`Running on port ${port}`));
