import {
  SetButtonControlElement,
  ModelPositions,
  ModelControls,
} from "../../types/models";
import "./css/SSetButton.css";

import { useState, useEffect } from "react";

export interface SSetButton {
  element: SetButtonControlElement;
  modelControls: ModelControls;
  positions: ModelPositions;
  setPositions: (positions: ModelPositions) => void;
}

export default function SSetButton({
  element,
  positions,
  setPositions,
  modelControls,
}: SSetButton) {
  const step = 0.1;
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let intervalId: number;
    if (clicked) {
      intervalId = setInterval(() => {
        let ended = true;
        element.props.values.forEach((it) => {
          const elementPosition = positions.models.find(
            (itv) => itv.name === it.element
          );
          if (elementPosition) {
            const filteredModels = positions.models.filter(
              (itv) => itv.name !== it.element
            );
            const currentValue = elementPosition?.[it.path[0]]?.[it.path[1]];
            if (currentValue !== undefined && currentValue !== it.value) {
              ended = false;

              if (currentValue > it.value) 
                elementPosition[it.path[0]][it.path[1]] = (currentValue - step)
                setPositions({ models: [...filteredModels, elementPosition] });
            }
          }
        });
        if (ended) setClicked(false);
      }, 100);
    }

    // Очистка интервала при изменении состояния или размонтировании
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [clicked]);

  return (
    <div className="m-2">
      <div
        className="setButton"
        onClick={() => {
          setClicked(true);
        }}
      >
        {element.name}
      </div>
    </div>
  );
}
