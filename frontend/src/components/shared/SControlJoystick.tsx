import { Joystick } from "react-joystick-component";
import {
  JoystickControlElement,
  ModelPositions,
  ModelControls,
} from "../../types/models";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { useState, useEffect } from "react";

export interface SControlJoystic {
  element: JoystickControlElement;
  modelControls: ModelControls;
  positions: ModelPositions;
  controlsEnabled: boolean;
  setControlsEnabled: (e: boolean) => void;
  setPositions: (positions: ModelPositions) => void;
}

export default function SControlJoystic({
  element,
  positions,
  setPositions,
  modelControls,
  controlsEnabled,
}: SControlJoystic) {
  const [joystickState, setJoystickState] =
    useState<IJoystickUpdateEvent | null>(null);
  const step = 0.1;
  const xname = element.props.x;
  const yname = element.props.y;

  const xpart = positions.models.find((fit) => fit.name === xname) || {
    name: xname,
  };
  const xpartControl = modelControls.models.find(
    (fit) => fit.name === xname
  ) || {
    name: xname,
  };
  const xfilteredModels = positions.models.filter((fit) => fit.name !== xname);
  const xpartLimits = xpartControl[element.props.xpath[0]]?.[
    element.props.xpath[1]
  ] || [-10, 10];
  const ypart = positions.models.find((fit) => fit.name === yname) || {
    name: yname,
  };
  const ypartControl = modelControls.models.find(
    (fit) => fit.name === yname
  ) || {
    name: yname,
  };
  const yfilteredModels = positions.models.filter((fit) => fit.name !== yname);
  const ypartLimits = ypartControl[element.props.ypath[0]]?.[
    element.props.ypath[1]
  ] || [-10, 10];

  function setX(n: number) {
    xpart[element.props.xpath[0]] = xpart[element.props.xpath[0]] || {};
    //@ts-ignore
    xpart[element.props.xpath[0]][element.props.xpath[1]] = n;
    setPositions({ models: [...xfilteredModels, xpart] });
  }

  function setY(n: number) {
    ypart[element.props.ypath[0]] = ypart[element.props.ypath[0]] || {};
    //@ts-ignore
    ypart[element.props.ypath[0]][element.props.ypath[1]] = n;
    setPositions({ models: [...yfilteredModels, ypart] });
  }

  useEffect(() => {
    let intervalId: number;

    if (joystickState?.type === "move") {
      intervalId = setInterval(() => {
        const y = ypart[element.props.ypath[0]]?.[element.props.ypath[1]] || 0;
        const x = xpart[element.props.xpath[0]]?.[element.props.xpath[1]] || 0;

        switch (joystickState.direction) {
          case "FORWARD":
            setY(Math.min(y + step, ypartLimits[1]));
            break;
          case "BACKWARD":
            setY(Math.max(y - step, ypartLimits[0]));
            break;
          case "LEFT":
            setX(Math.min(x + step, xpartLimits[1]));
            break;
          case "RIGHT":
            setX(Math.max(x - step, xpartLimits[0]));
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
        stickColor="#5863f8"
        baseColor="#2a2f77"
        move={(e) => setJoystickState(e)}
        start={(e) => setJoystickState(e)}
        stop={() => setJoystickState(null)}
        disabled={!controlsEnabled}
      />
    </div>
  );
}
