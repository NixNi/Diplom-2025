import { useActions } from "../../hooks/actions";
import { useAppSelector } from "../../hooks/redux";
import { useState, useEffect } from "react";
import PowerIcon from "../../icons/svg/power.svg?react";
import { SPowerButtonElement } from "../../types/models";
import "./css/SCircleButton.css";

export interface SPowerButton {
  element: SPowerButtonElement;
}

export default function SPowerButton({ element }: SPowerButton) {
  const actions = useActions();
  const model = useAppSelector((state) => state.model);
  const positions = model.positions;
  const step = 0.1;
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let intervalId: number;
    if (clicked && model.isEnabled && !model.isEmergencyStoped) {
      actions.setControlsEnabled(false);
      intervalId = setInterval(() => {
        let ended = true;
        element.props.defaultValues.forEach((it) => {
          let currentValue: any = positions;
          const path_spl = it.path.split("/");
          for (let i = 0; i < path_spl.length - 1; i++) {
            const key = path_spl[i];
            if (!currentValue[key]) {
              currentValue[key] = {};
            }
            currentValue = currentValue[key];
          }
          currentValue = currentValue[path_spl[path_spl.length - 1]] as number;

          if (currentValue !== undefined && currentValue !== it.value) {
            ended = false;
            if (currentValue > it.value) {
              actions.updateModelPositionLocal({
                command: "set",
                value: Math.max(currentValue - step, it.value),
                path: it.path,
              });
            }
            if (currentValue < it.value) {
              actions.updateModelPositionLocal({
                command: "set",
                value: Math.min(currentValue + step, it.value),
                path: it.path,
              });
            }
          }
        });
        if (ended) {
          actions.switchEanbled();
          actions.setControlsEnabled(true);
          setClicked(false);
        }
      }, 100);
    } else if (clicked) {
      actions.switchEanbled();
      setClicked(false);
    }

    // Очистка интервала при изменении состояния или размонтировании
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [clicked, positions]);

  return (
    <div
      className="circle-button secondary secondary-hover"
      onClick={() => {
        setClicked(true);
      }}
    >
      <PowerIcon className="circle-button_icon" />
    </div>
  );
}
