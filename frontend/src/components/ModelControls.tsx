import { ModelControls, ModelPositions } from "../types/models";
import SControlJoystic from "./shared/SControlJoystick";
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
  return (
    <div className="flex">
      {modelControls.controlElements &&
        modelControls.controlElements.map((it) => {
          if (it.element === "Joystick") return (
            <div key={it.name} className="p-2">
              <p>{it.name}</p>
              <SControlJoystic
                key={it.name}
                positions={positions}
                setPositions={setPositions}
                modelControls={modelControls}
                element={it}
              />
            </div>
          );
          return <div>Element Not Found</div>;
        })}
      {/* <Joystick
        start={(e) => console.log(e)}
        throttle={500}
        move={(e) => console.log(e)}
        stop={(e) => console.log(e)}
      /> */}
    </div>
  );
};
