import { Joystick } from "react-joystick-component";
import { JoystickControlElement } from "../../types/models";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { useState, useEffect } from "react";
import { useActions } from "../../hooks/actions";
import { useGetCanControl } from "../../hooks/model";
// import { sendModelCommandAsync } from "../../store/model/model.slice";
export interface SControlJoystic {
  element: JoystickControlElement;
}

export default function SControlJoystic({ element }: SControlJoystic) {
  const actions = useActions();
  const enabled = useGetCanControl();
  const [joystickState, setJoystickState] =
    useState<IJoystickUpdateEvent | null>(null);
  const step = 0.1;

  useEffect(() => {
    let intervalId: number;
    if (joystickState?.type === "move") {
      intervalId = setInterval(() => {
        switch (joystickState.direction) {
          case "FORWARD":
            actions.updateModelPositionLocal({
              command: "add",
              value: step,
              path: element.props.ypath,
            });
            actions.sendModelCommandAsync({
              command: "add",
              value: step,
              path: element.props.ypath,
            });
            break;
          case "BACKWARD":
            actions.updateModelPositionLocal({
              command: "add",
              value: -step,
              path: element.props.ypath,
            });
            break;
          case "LEFT":
            actions.updateModelPositionLocal({
              command: "add",
              value: step,
              path: element.props.xpath,
            });
            break;
          case "RIGHT":
            actions.updateModelPositionLocal({
              command: "add",
              value: -step,
              path: element.props.xpath,
            });
            break;
        }
      }, 100);
    }

    // Очистка интервала при изменении состояния или размонтировании
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [joystickState]);

  return (
    <div className="m-2">
      <Joystick
        throttle={100}
        stickColor="var(--secondary)"
        baseColor="var(--secondary-dark)"
        move={(e) => setJoystickState(e)}
        start={(e) => setJoystickState(e)}
        stop={() => setJoystickState(null)}
        disabled={!enabled}
      />
    </div>
  );
}
