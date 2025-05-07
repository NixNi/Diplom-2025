import { io } from "socket.io-client";
const URL = "http://localhost:8046";
export const socket = io(URL);

export const sendCommand = async (command: {
  command: "set" | "add";
  path: string;
  value: number;
}) => {
  if (socket && socket.connected) {
    socket.emit("command", command);
  } else {
    console.error("Socket is not connected");
  }
};
