import { Socket as SocketClient } from "socket.io-client";
import { Socket } from "socket.io";
import { WsConnect } from "src/services/wsConnection";

export default function socketManager(socket: Socket) {
  console.log(`Client connected: ${socket.id}`);
  let connection: SocketClient | null = null;

  socket.on(
    "getModel",
    async (connect: Connection, callback: (arg: string) => void) => {
      // console.log(connect);
      try {
        connection = await WsConnect(connect.ip, connect.port);
        connection.on("command", (arg) => {
          socket.emit("clientCommand", arg);
        });
        connection.emit("getModel", callback);
      } catch (e) {
        console.error(e);
        // TODO: Handle error propagation
      }
    }
  );

  socket.on("clientCommand", (arg: CommandResponse) => {
    if (connection) {
      connection.emit("command", arg);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    if (connection) {
      connection.disconnect();
      connection = null;
    }
  });
}

interface CommandResponse {
  command: "set" | "add";
  path: string;
  value: number;
}

interface Connection {
  ip: string;
  port: number;
  user: string | null;
  password: string | null;
}
