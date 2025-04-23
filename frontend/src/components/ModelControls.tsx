import { controlElement } from "../types/models";
import { useAppSelector } from "../hooks/redux";
import SControlJoystic from "./shared/SControlJoystick";
import SSetButton from "./shared/SSetButton";
import SArrowButtons from "./shared/SArrowButtons";
import SPowerButton from "./shared/SPowerButton";
import SEmergencyStopButton from "./shared/SEmergencyStopButton";
import "./css/ControlGrid.css";

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
        {/* <p>{el.name}</p> */}
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

  const positions: { [key: string]: controlElement[] } = {
    TopLeft: [],
    Top: [],
    TopRight: [],
    Left: [],
    Center: [],
    Right: [],
    BottomLeft: [],
    Bottom: [],
    BottomRight: [],
  };

  modelControls.controlElements?.forEach((el) => {
    const position =
      el.position && positions[el.position] ? el.position : "Center";
    positions[position].push(el);
  });

  return (
    <div className="control-grid">
      {Object.keys(positions).map((position) => (
        <div key={position} className={`flex`}>
          {positions[position].map((el) => chooseElement(el))}
        </div>
      ))}
    </div>
  );
};
