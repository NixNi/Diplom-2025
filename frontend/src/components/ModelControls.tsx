import { Joystick } from "react-joystick-component";
// import { modelControls } from "../hooks/useModelData"; // Предполагаемый тип

// interface xyz {
//   x?: number;
//   y?: number;
//   z?: number;
// }

// interface ModelPositions {
//   models: Array<{
//     name: string;
//     position?: xyz;
//     rotation?: xyz;
//   }>;
// }

// interface ModelControlsProps {
//   modelControls: modelControls;
//   positions: ModelPositions;
//   setPositions: (positions: ModelPositions) => void;
// }

export const ModelControls = (
//     {
//   modelControls,
//   positions,
//   setPositions,
// }: ModelControlsProps
) => {
  return (
    <div className="flex">
      <Joystick
        start={(e) => console.log(e)}
        throttle={500}
        move={(e) => console.log(e)}
        stop={(e) => console.log(e)}
      />
    </div>
  );
};
