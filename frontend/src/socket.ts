import { io } from "socket.io-client";
import { HardwareState } from "./types/models";
const URL = "http://localhost:8046";
const socket = io(URL);
socket.on("connect", onConnect);
socket.on("disconnect", onDisconnect);

export default socket;

export const sendCommand = async (command: {
  command: "set" | "add";
  path: string;
  value: number;
}) => {
  if (socket && socket.connected) {
    socket.emit("clientCommand", command);
  } else {
    console.error("Socket is not connected");
  }
};

export const sendState = async (state: HardwareState) => {
  if (socket && socket.connected) {
    socket.emit("clientState", state);
  } else {
    console.error("Socket is not connected");
  }
};

function onConnect() {
  console.log("Connected to Socket.IO server");
}

function onDisconnect() {
  console.log("Disconnected from Socket.IO server");
}
