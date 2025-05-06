import express from "express";
import { io as ioClient } from "socket.io-client";

let serverSocket: any = null;

export function WsConnect(ip: string, port: number) {
  if (serverSocket) serverSocket.disconnect();

  const url = `http://${ip}:${port}`;
  serverSocket = ioClient(url);

  serverSocket.on("connect", () => {
    console.log("Connected to Socket.IO server");

    // Send ping every 5 seconds
    setInterval(() => {
      serverSocket.emit("ping", (response: {type: string, timestamp:number}) => {
        console.log("Pong received:", response);
        console.log(`Latency: ${Date.now() - response.timestamp}ms`);
      });
    }, 5000);
  });

  serverSocket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });
}

export default function useServerSocket() {
  if (serverSocket)
    return serverSocket;
  else throw Error("Server Not Connected")
}
