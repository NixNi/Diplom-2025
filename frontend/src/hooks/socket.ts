import { socket } from "../socket";
import { CommandResponse, HardwareState } from "../types/models";
import { useActions } from "./actions";
import { useAppSelector } from "./redux";
import { useEffect } from "react";

export const useSocket = () => {
  const connectState = useAppSelector((state) => state.connect);
  const actions = useActions();

  useEffect(() => {
    function onConnect() {
      console.log("Connected to Socket.IO server");
    }

    function onDisconnect() {
      console.log("Disconnected from Socket.IO server");
    }

    function onCommandEvent(data: CommandResponse) {
      data.isNeedOnlineCheck = false;
      actions.updateModelPositionLocal(data);
    }

    function onStateEvent(data: HardwareState) {
      actions.updateState(data);
    }

    function setModel(data: string) {
      console.log(data);
      actions.setModelName(data);
      actions.updateModelControlsAsync();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("clientCommand", onCommandEvent);
    socket.on("clientState", onStateEvent);
    socket.emit("getModel", connectState, setModel);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("clientCommand", onCommandEvent);
      socket.off("clientState", onStateEvent);
    };
  }, []);
};
