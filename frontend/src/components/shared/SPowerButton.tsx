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
