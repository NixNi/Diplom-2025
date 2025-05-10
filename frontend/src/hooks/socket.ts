import socket from "../socket";
import { CommandResponse, HardwareState } from "../types/models";
import { useActions } from "./actions";
import { useAppSelector } from "./redux";
import { useEffect } from "react";

export const useSocket = () => {
  const connectState = useAppSelector((state) => state.connect);
  const actions = useActions();

  useEffect(() => {
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

    function setParameters(data: { Parameter: string; Value: number }[]) {
      // console.log(data);
      actions.updateParametersFromHardware(data);
    }

    function onConnection() {
      socket.emit("getModel", setModel);
      socket.emit("getCurrentParameters");
    }

    socket.on("clientCommand", onCommandEvent);
    socket.on("clientState", onStateEvent);
    socket.on("clientSetParameters", setParameters);
    socket.emit("connectHardware", connectState, onConnection);

    return () => {
      socket.off("clientCommand", onCommandEvent);
      socket.off("clientState", onStateEvent);
      socket.off("clientSetParameters", setParameters);
    };
  }, []);
};
