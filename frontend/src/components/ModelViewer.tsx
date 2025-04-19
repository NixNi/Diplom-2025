import { useRef } from "react";
import { useThreeSetup } from "../hooks/useThreeSetup";
import { useModelLoader } from "../hooks/useModelLoader";
import { ModelControlsInputs } from "./ModelControlsInputs";
import { ModelControlsComponent } from "./ModelControls";
import { useAppSelector } from "../hooks/redux";
// import { useActions } from "../hooks/actions";

interface ModelViewerProps {
  size?: { x: number; y: number };
  modelControlsEnable: boolean;
}

const ModelViewer = ({ size, modelControlsEnable }: ModelViewerProps) => {
  const model = useAppSelector((state) => state.model);

  const mountRef = useRef<HTMLDivElement>(null);
  const { scene } = useThreeSetup(mountRef, size);
  const { errorMessage, modelLoaded } = useModelLoader(scene);
  const loaderError = model.errorMessage;

  // Внутри ModelViewer
  return (
    <div className="relative flex">
      <div
        ref={mountRef}
        style={{
          visibility: modelLoaded ? "visible" : "hidden",
          position: modelLoaded ? "initial" : "absolute",
        }}
      />
      {(errorMessage || loaderError) && (
        <div
          style={{ width: size?.x || 600, height: size?.y || 600 }}
          className="flex filler"
        >
          <div className="secondary m-auto p-10 font-bold text-5">
            {loaderError || errorMessage}
          </div>
        </div>
      )}
      {modelLoaded && modelControlsEnable && model.modelControls?.models && (
        <div className="flex">
          <ModelControlsInputs/>
          <ModelControlsComponent/>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
