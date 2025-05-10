import { Socket as SocketClient } from "socket.io-client";
import { Socket } from "socket.io";
import { WsConnect } from "src/services/wsConnection";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

export default function socketManager(socket: Socket) {
  console.log(`Client connected: ${socket.id}`);
  let connection: SocketClient | null = null;
  socket.on(
    "connectHardware",
    async (connect: Connection, callback: () => void) => {
      await mutex.waitForUnlock();
      const release = await mutex.acquire();
      try {
        if (connection) {
          connection.disconnect();
          connection = null;
        }
        connection = await WsConnect(connect.ip, connect.port);
        connection.on("command", (arg) => {
          socket.emit("clientCommand", arg);
        });
        connection.on("state", (arg) => {
          socket.emit("clientState", arg);
        });
        connection.on("setParameters", (arg) => {
          console.log("df");
          socket.emit("clientSetParameters", arg);
        });
        callback();
      } catch (e) {
        console.error(e);
        // TODO: Handle error propagation
      } finally {
        release();
      }
    }
  );

  socket.on("getCurrentParameters", (callback: () => void) => {
    // console.log("abc");
    if (connection) {
      connection.emit("getCurrentParameters", callback);
    }
  });

  socket.on("getModel", (callback: () => void) => {
    // console.log(connection);
    if (connection) {
      connection.emit("getModel", callback);
    }
  });

  socket.on("clientCommand", (arg: CommandResponse) => {
    if (connection) {
      connection.emit("command", arg);
    }
  });

  socket.on("clientState", (arg) => {
    if (connection) {
      connection.emit("state", arg);
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
