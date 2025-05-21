import { Joystick } from "react-joystick-component";
import { JoystickControlElement } from "../../types/models";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { useState, useEffect } from "react";
import { useActions } from "../../hooks/actions";
import { useGetCanControl } from "../../hooks/model";

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

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [joystickState]);

  return (
    <div
      className="joystick-grid"
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        gridTemplateColumns: "auto 1fr auto",
        gap: "10px",
        alignItems: "center",
        justifyItems: "center",
        width: "200px",
        margin: "2rem auto",
      }}
    >
      {/* Top Image */}
      <div style={{ gridColumn: "2", gridRow: "1" }}>
        {element.props.topImg && (
          <img
            src={element.props.topImg}
            alt="Top"
            style={{ width: 30, height: 30 }}
          />
        )}
      </div>

      {/* Left Image */}
      <div style={{ gridColumn: "1", gridRow: "2" }}>
        {element.props.leftImg && (
          <img
            src={element.props.leftImg}
            alt="Left"
            style={{ width: 30, height: 30 }}
          />
        )}
      </div>

      {/* Joystick */}
      <div style={{ gridColumn: "2", gridRow: "2" }}>
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

      {/* Right Image */}
      <div style={{ gridColumn: "3", gridRow: "2" }}>
        {element.props.rightImg && (
          <img
            src={element.props.rightImg}
            alt="Right"
            style={{ width: 30, height: 30 }}
          />
        )}
      </div>

      {/* Bottom Image */}
      <div style={{ gridColumn: "2", gridRow: "3" }}>
        {element.props.bottomImg && (
          <img
            src={element.props.bottomImg}
            alt="Bottom"
            style={{ width: 30, height: 30 }}
          />
        )}
      </div>
    </div>
  );
}
