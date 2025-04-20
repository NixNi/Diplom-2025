import { controlElement } from "../types/models";
import { useAppSelector } from "../hooks/redux";
import SControlJoystic from "./shared/SControlJoystick";
import SSetButton from "./shared/SSetButton";
import SArrowButtons from "./shared/SArrowButtons";
import SPowerButton from "./shared/SPowerButton";
import SEmergencyStopButton from "./shared/SEmergencyStopButton";

export const ModelControlsComponent = () => {
  const modelControls = useAppSelector((state) => state.model.modelControls);

  function chooseElement(el: controlElement) {
    if (
      ![
        "Joystick",
        "setButton",
        "ArrowButtons",
        "PowerButton",
        "EmergencyStop",
      ].includes(el.element)
    )
      return <div>Element Not Found</div>;
    return (
      <div key={el.name} className="p-2">
        <p>{el.name}</p>
        {(el.element === "Joystick" && (
          <SControlJoystic key={el.name} element={el} />
        )) ||
          (el.element === "setButton" && (
            <SSetButton key={el.name} element={el} />
          )) ||
          (el.element === "ArrowButtons" && (
            <SArrowButtons key={el.name} element={el} />
          )) ||
          (el.element === "PowerButton" && (
            <SPowerButton key={el.name} element={el} />
          )) ||
          (el.element === "EmergencyStop" && (
            <SEmergencyStopButton key={el.name} />
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap">
      {modelControls.controlElements &&
        modelControls.controlElements.map((it) => {
          return chooseElement(it);
        })}
    </div>
  );
};
