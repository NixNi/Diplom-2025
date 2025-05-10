import { SetButtonControlElement } from "../../types/models";
import { useActions } from "../../hooks/actions";
import { useAppSelector } from "../../hooks/redux";
import "./css/SSetButton.css";

import { useState, useEffect } from "react";
import { useGetCanControl } from "../../hooks/model";

export interface SSetButton {
  element: SetButtonControlElement;
}

export default function SSetButton({ element }: SSetButton) {
  const actions = useActions();
  const model = useAppSelector((state) => state.model);
  const enabled = useGetCanControl();
  const positions = model.positions;
  const step = 0.1;
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let intervalId: number;
    if (clicked) {
      if (model.mode === "online") {
        actions.updateSetModelPositionOnline(element.props.values);
        setClicked(false);
      } else {
        actions.setControlsEnabled(false);
        intervalId = setInterval(() => {
          let ended = true;
          element.props.values.forEach((it) => {
            let currentValue: any = positions;
            const path_spl = it.path.split("/");
            for (let i = 0; i < path_spl.length - 1; i++) {
              const key = path_spl[i];
              if (!currentValue[key]) {
                currentValue[key] = {};
              }
              currentValue = currentValue[key];
            }
            currentValue = currentValue[
              path_spl[path_spl.length - 1]
            ] as number;
            if (!model.isEmergencyStoped) {
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
            } else {
              clearInterval(intervalId);
              setClicked(false);
            }
          });
          if (ended) {
            actions.setControlsEnabled(true);
            setClicked(false);
          }
        }, 100);
      }
    }

    // Очистка интервала при изменении состояния или размонтировании
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [clicked, positions]);

  return (
    <div className="m-2">
      <div
        className="setButton"
        onClick={() => {
          if (enabled) setClicked(true);
        }}
      >
        {element.name}
      </div>
    </div>
  );
}
