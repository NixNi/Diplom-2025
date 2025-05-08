import { Socket } from "socket.io";

export default function socketManager(socket: Socket) {
  console.log(`Client connected: ${socket.id}`);

  socket.on("getModel", (callback: (arg: string) => void) => {
    console.log(callback);
    callback("Xray 2");
  });
  interface CommandResponse {
    command: "set" | "add";
    path: string;
    value: number;
  }
  socket.on("command", (arg: CommandResponse) => {
    socket.emit("command", arg);
    socket.broadcast.emit("command", arg);
  });

  socket.on("state", (arg) => {
    socket.emit("state", arg);
    socket.broadcast.emit("state", arg);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
}
