import { useActions } from "../../hooks/actions";
import { useGetCanControl } from "../../hooks/model";
import SArrowButton from "./SArrowButton";
import { SArrowButtonsElement } from "../../types/models";
import { useState, useEffect } from "react";

export interface SArrowButtonsProps {
  element: SArrowButtonsElement;
}

export default function SArrowButtons({ element }: SArrowButtonsProps) {
  const actions = useActions();
  const enabled = useGetCanControl();
  const step = 0.1;
  const path = element.props.path;
  const [direction, setDirection] = useState<"increase" | "decrease" | null>(
    null
  );

  const handleIncrease = () => {
    if (enabled) setDirection("increase");
  };

  const handleDecrease = () => {
    if (enabled) setDirection("decrease");
  };

  const stopMovement = () => {
    setDirection(null);
  };

  useEffect(() => {
    if (!direction || !enabled) return;

    const intervalId = setInterval(() => {
      actions.updateModelPositionLocal({
        command: "add",
        value: direction === "increase" ? step : -step,
        path: path,
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [direction, enabled, path]);

  const isVertical = element.props.type === "up/down";

  return (
    <div className="m-2">
      {isVertical ? (
        // Вертикальная ось: кнопки в колонке, изображение справа
        <div className="flex flex-row items-center gap-2">
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

          {/* Картинки для оси Y (справа от кнопок) */}
          <div className="flex flex-col gap-2">
            {element.props.topImg && (
              <img
                src={element.props.topImg}
                alt="Top"
                style={{ width: 30, height: 30 }}
              />
            )}
            {element.props.bottomImg && (
              <img
                src={element.props.bottomImg}
                alt="Bottom"
                style={{ width: 30, height: 30 }}
              />
            )}
          </div>
        </div>
      ) : (
        // Горизонтальная ось: изображение сверху, кнопки в строке
        <div className="flex flex-col items-center gap-2">
          {element.props.leftImg && (
            <img
              src={element.props.leftImg}
              alt="Left"
              style={{ width: 30, height: 30 }}
            />
          )}
          <div className="flex flex-row gap-2">
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
          {element.props.rightImg && (
            <img
              src={element.props.rightImg}
              alt="Right"
              style={{ width: 30, height: 30 }}
            />
          )}
        </div>
      )}
    </div>
  );
}
