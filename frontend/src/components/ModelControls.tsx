import { controlElement, ModelControls, ModelPositions } from "../types/models";
import { useState } from "react";
import SControlJoystic from "./shared/SControlJoystick";
import SSetButton from "./shared/SSetButton";
interface ModelControlsProps {
  modelControls: ModelControls;
  positions: ModelPositions;
  setPositions: (positions: ModelPositions) => void;
}

export const ModelControlsComponent = ({
  modelControls,
  positions,
  setPositions,
}: ModelControlsProps) => {
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const controlsBundle = {
    positions,
    setPositions,
    modelControls,
    controlsEnabled,
    setControlsEnabled,
  };

  function chooseElement(el: controlElement) {
    if (!(["Joystick", "setButton"].includes(el.element)))
      return <div>Element Not Found</div>;
    return (
      <div key={el.name} className="p-2">
        <p>{el.name}</p>
        {el.element === "Joystick" && (
          <SControlJoystic {...controlsBundle} key={el.name} element={el} />
        )}
        {el.element === "setButton" && (
          <SSetButton {...controlsBundle} key={el.name} element={el} />
        )}
      </div>
    );
  }

  return (
    <div className="flex">
      {modelControls.controlElements &&
        modelControls.controlElements.map((it) => {
          return chooseElement(it);
        })}
    </div>
  );
};
