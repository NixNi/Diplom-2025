import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server | null = null;

export function setIO(httpServer: HttpServer, whitelist: string | string[]) {
  io = new Server(httpServer, {
    cors: {
      origin: whitelist,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  return io;
}

export default io;
