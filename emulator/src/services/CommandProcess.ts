import type { Command, HardwareState } from "./../types/command";
import {
  changeParameter,
  getParameter,
  setParameter,
} from "../models/parameters";
import type { Socket } from "socket.io";
// import io from "./IO";
const step = Number(process.env.step) || 0.1;
const timeout = Number(process.env.timeout) || 100;

export async function runCommand(socket: Socket, commandObject: Command) {
  const { path, value, command } = commandObject;
  if (command === "add") {
    if (Math.abs(value) <= step) {
      const result = await changeParameter(path, value);
      if (result) {
        socket.emit("command", result);
        socket.broadcast.emit("command", result);
      }
    } else {
      let valueI = value + ((await getParameter(path)) || 0);
      const intervalID = setInterval(async () => {
        const currentValue = (await getParameter(path)) || 0;
        if (currentValue !== valueI) {
          if (currentValue > valueI) {
            const result = await setParameter(
              path,
              Math.max(currentValue - step, valueI)
            );
            if (result) {
              socket.emit("command", result);
              socket.broadcast.emit("command", result);
            } else clearInterval(intervalID);
          }
          if (currentValue < valueI) {
            const result = await setParameter(
              path,
              Math.min(currentValue + step, valueI)
            );
            if (result) {
              socket.emit("command", result);
              socket.broadcast.emit("command", result);
            } else clearInterval(intervalID);
          }
        } else {
          clearInterval(intervalID);
        }
      }, timeout);
    }
  }
  if (command === "set") {
    const currentValue = (await getParameter(path)) || 0;
    if (Math.abs(currentValue - value) <= step) {
      const result = await setParameter(path, value);
      if (result) {
        socket.emit("command", result);
        socket.broadcast.emit("command", result);
      }
    } else {
      const intervalID = setInterval(async () => {
        const currentValue = (await getParameter(path)) || 0;
        if (currentValue !== value) {
          if (currentValue > value) {
            const result = await setParameter(
              path,
              Math.max(currentValue - step, value)
            );
            if (result) {
              socket.emit("command", result);
              socket.broadcast.emit("command", result);
            } else clearInterval(intervalID);
          }
          if (currentValue < value) {
            const result = await setParameter(
              path,
              Math.min(currentValue + step, value)
            );
            if (result) {
              socket.emit("command", result);
              socket.broadcast.emit("command", result);
            } else clearInterval(intervalID);
          }
        } else {
          clearInterval(intervalID);
        }
      }, timeout);
    }
  }
}

export async function setState(socket: Socket, commandObject: HardwareState) {
  if (!(commandObject.isControlsEnabled === undefined)) {
    await setParameter(
      "isControlsEnabled",
      Number(commandObject.isControlsEnabled)
    );
  }
  if (!(commandObject.isEmergencyStoped === undefined)) {
    await setParameter(
      "isEmergencyStoped",
      Number(commandObject.isEmergencyStoped)
    );
  }
  if (!(commandObject.isEnabled === undefined)) {
    await setParameter("isEnabled", Number(commandObject.isEnabled));
  }
  socket.emit("state", commandObject);
  socket.broadcast.emit("state", commandObject);
}
