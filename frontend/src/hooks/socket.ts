import { io, Socket } from "socket.io-client";
import { useAppSelector } from "./redux";
import { useEffect, useRef } from "react";

interface CommandResponse {
  command: "set" | "add";
  path: string;
  value: number;
}

export const useSocket = (onCommand: (data: CommandResponse) => void) => {
  const socketRef = useRef<Socket | null>(null);
  const connectState = useAppSelector((state) => state.connect);

  useEffect(() => {
    if (
      connectState.ip &&
      connectState.port &&
      !socketRef.current
    ) {
      const socket = io(`http://localhost:8046`, {
        // auth: {
        //   user: connectState.user,
        //   password: connectState.password,
        // },
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      socket.on("command", (data: CommandResponse) => {
        onCommand(data);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [connectState.ip, connectState.port, connectState.user, connectState.password, onCommand]);

  return socketRef.current;
};

export const sendCommand = async (
  socket: Socket | null,
  command: { command: "set" | "add"; path: string; value: number }
) => {
  if (socket && socket.connected) {
    socket.emit("command", command);
  } else {
    console.error("Socket is not connected");
  }
};