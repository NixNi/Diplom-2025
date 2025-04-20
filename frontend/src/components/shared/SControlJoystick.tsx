import { Joystick } from "react-joystick-component";
import { JoystickControlElement } from "../../types/models";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { useState, useEffect } from "react";
import { useActions } from "../../hooks/actions";
import { useAppSelector } from "../../hooks/redux";
import { useGetCanControl, useGetModelControls, useGetModelPositions } from "../../hooks/model";
export interface SControlJoystic {
  element: JoystickControlElement;
}

export default function SControlJoystic({
  element
}: SControlJoystic) {
  const actions = useActions();
  const model = useAppSelector((state) => state.model);
  const pos = model.positions;
  const enabled = useGetCanControl();
  const [joystickState, setJoystickState] =
    useState<IJoystickUpdateEvent | null>(null);
  const step = 0.1;
  const xname = element.props.x;
  const yname = element.props.y;
  const xpart = useGetModelPositions(xname) || { name: xname };
  const ypart = useGetModelPositions(yname) || { name: yname };
  const xControl = useGetModelControls(xname) || { name: xname };
  const yControl = useGetModelControls(yname) || { name: yname };
  const xLimits = xControl[element.props.xpath[0]]?.[
    element.props.xpath[1]
  ] || [-10, 10];
  const yLimits = yControl[element.props.ypath[0]]?.[
    element.props.ypath[1]
  ] || [-10, 10];

  function setX(n: number) {
    const xpartd = { ...xpart };
    xpartd[element.props.xpath[0]] = { ...xpartd[element.props.xpath[0]] };
    //@ts-ignore
    xpartd[element.props.xpath[0]][element.props.xpath[1]] = n;
    actions.updateModelPositionLocal(xpartd);
  }

  function setY(n: number) {
    const ypartd = { ...ypart };
    ypartd[element.props.ypath[0]] = { ...ypartd[element.props.ypath[0]] };
    //@ts-ignore
    ypartd[element.props.ypath[0]][element.props.ypath[1]] = n;
    actions.updateModelPositionLocal(ypartd);
  }

  useEffect(() => {
    let intervalId: number;
    if (joystickState?.type === "move") {
      intervalId = setInterval(() => {
        const y = ypart[element.props.ypath[0]]?.[element.props.ypath[1]] || 0;
        const x = xpart[element.props.xpath[0]]?.[element.props.xpath[1]] || 0;

        switch (joystickState.direction) {
          case "FORWARD":
            setY(Math.min(y + step, yLimits[1]));
            break;
          case "BACKWARD":
            setY(Math.max(y - step, yLimits[0]));
            break;
          case "LEFT":
            setX(Math.min(x + step, xLimits[1]));
            break;
          case "RIGHT":
            setX(Math.max(x - step, xLimits[0]));
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
  }, [joystickState, pos]);

  return (
    <div className="m-2">
      <Joystick
        throttle={100}
        stickColor="#5863f8"
        baseColor="#2a2f77"
        move={(e) => setJoystickState(e)}
        start={(e) => setJoystickState(e)}
        stop={() => setJoystickState(null)}
        disabled={!enabled}
      />
    </div>
  );
}
