import { Socket } from "socket.io";
import type { Command, HardwareState } from "../types/command";
import { getAllParameters, setParameter } from "../models/parameters";
import { runCommand, setState } from "../services/CommandProcess";

export default function socketManager(socket: Socket) {
  console.log(`Client connected: ${socket.id}`);

  socket.on("getModel", (callback: (arg: string) => void) => {
    callback(process.env.model || "Xray");
  });

  socket.on("getCurrentParameters", async () => {
    const parameters = await getAllParameters();
    socket.emit("setParameters", parameters);
    socket.broadcast.emit("setParameters", parameters);
  });

  socket.on("command", (arg: Command) => {
    runCommand(socket, arg);
  });

  socket.on("state", (arg: HardwareState) => {
    setState(socket, arg);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
}
