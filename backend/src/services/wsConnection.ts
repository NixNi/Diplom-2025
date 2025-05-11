import { io as ioClient, Socket } from "socket.io-client";

export function WsConnect(ip: string, port: number) {
  return new Promise<Socket>((resolve, reject) => {
    const url = `http://${ip}:${port}`;
    const serverSocket = ioClient(url);

    serverSocket.on("connect", () => {
      console.log("Connected to Emulator");
      resolve(serverSocket);
    });

    serverSocket.on("connect_error", (err) => {
      serverSocket.disconnect();
      console.log(url);
      reject(new Error("Server Not Connected"));
    });

    serverSocket.on("disconnect", () => {
      console.log("Disconnected from Emulator");
    });
  });
}
