import { useActions } from "../../hooks/actions";
import {
  useGetCanControl,
  useGetModelControls,
  useGetModelPositions,
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
  const name = element.props.element;
  const path = element.props.path;
  const part = useGetModelPositions(name) || { name };
  const control = useGetModelControls(name) || { name };
  const limits = control[path[0]]?.[path[1]] || [-10, 10];
  const [direction, setDirection] = useState<"increase" | "decrease" | null>(
    null
  );

  // Функция для обновления позиции
  function updateValue(newValue: number) {
    const updatedPart = { ...part };
    updatedPart[path[0]] = { ...updatedPart[path[0]] };
    //@ts-ignore
    updatedPart[path[0]][path[1]] = newValue;
    actions.updateModelPositionLocal(updatedPart);
  }

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
      const currentValue = part[path[0]]?.[path[1]] || 0;
      if (direction === "increase") {
        updateValue(Math.min(currentValue + step, limits[1]));
      } else if (direction === "decrease") {
        updateValue(Math.max(currentValue - step, limits[0]));
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [direction, enabled, part, limits, path, updateValue]);

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
