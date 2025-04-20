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
      actions.setControlsEnabled(false);
      intervalId = setInterval(() => {
        let ended = true;
        element.props.values.forEach((it) => {
          const elementPosition = positions.models.find(
            (itv) => itv.name === it.element
          );
          if (elementPosition) {
            const currentValue = elementPosition?.[it.path[0]]?.[it.path[1]];
            if (currentValue !== undefined && currentValue !== it.value) {
              ended = false;
              const elem = { ...elementPosition };
              elem[it.path[0]] = { ...elem[it.path[0]] };
              if (currentValue > it.value) {
                //@ts-ignore
                elem[it.path[0]][it.path[1]] = Math.max(
                  currentValue - step,
                  it.value
                );
              }
              if (currentValue < it.value) {
                //@ts-ignore
                elem[it.path[0]][it.path[1]] = Math.min(
                  currentValue + step,
                  it.value
                );
              }
              actions.updateModelPositionLocal(elem);
            }
          }
        });
        if (ended) {
          actions.setControlsEnabled(true);
          setClicked(false);
        }
      }, 100);
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
