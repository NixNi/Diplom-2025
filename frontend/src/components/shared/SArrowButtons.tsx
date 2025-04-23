import { useActions } from "../../hooks/actions";
import {
  useGetCanControl,
} from "../../hooks/model";
import SArrowButton from "./SArrowButton";
import { SArrowButtonsElement } from "../../types/models";
import { useState, useEffect } from "react";

export interface SArrowButtonsProps {
  element: SArrowButtonsElement;
}

export default function SArrowButtons({ element }: SArrowButtonsProps) {
  const actions = useActions();
  const enabled = useGetCanControl();
  const step = 0.1; // Шаг изменения позиции
  const path = element.props.path;
  const [direction, setDirection] = useState<"increase" | "decrease" | null>(
    null
  );

  // Обработчик для увеличения значения
  const handleIncrease = () => {
    if (enabled) {
      setDirection("increase");
    }
  };

  // Обработчик для уменьшения значения
  const handleDecrease = () => {
    if (enabled) {
      setDirection("decrease");
    }
  };

  // Остановка движения
  const stopMovement = () => {
    setDirection(null);
  };

  // Эффект для обработки интервала
  useEffect(() => {
    if (!direction || !enabled) return;

    const intervalId = setInterval(() => {
      if(direction === "increase") {
        actions.updateModelPositionLocal({
          command: "add",
          value: step,
          path: path,
        });
      } else if (direction === "decrease") {
        actions.updateModelPositionLocal({
          command: "add",
          value: -step,
          path: path,
        });;
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [direction, enabled, path]);

  return (
    <div className="m-2 flex">
      {element.props.type === "up/down" ? (
        <div className="flex flex-col gap-2">
          <SArrowButton
            up
            onMouseDown={handleIncrease}
            onMouseUp={stopMovement}
            onMouseLeave={stopMovement}
            className={enabled ? "" : "opacity-50"}
          />
          <SArrowButton
            down
            onMouseDown={handleDecrease}
            onMouseUp={stopMovement}
            onMouseLeave={stopMovement}
            className={enabled ? "" : "opacity-50"}
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <SArrowButton
            left
            onMouseDown={handleDecrease}
            onMouseUp={stopMovement}
            onMouseLeave={stopMovement}
            className={enabled ? "" : "opacity-50"}
          />
          <SArrowButton
            right
            onMouseDown={handleIncrease}
            onMouseUp={stopMovement}
            onMouseLeave={stopMovement}
            className={enabled ? "" : "opacity-50"}
          />
        </div>
      )}
    </div>
  );
}
