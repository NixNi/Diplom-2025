import { useRef } from "react";
import { useThreeSetup } from "../hooks/useThreeSetup";
import { useModelLoader } from "../hooks/useModelLoader";
import useModelData from "../hooks/useModelData";
import { ModelControlsInputs } from "./ModelControlsInputs";
import { ModelControlsComponent } from "./ModelControls";

interface ModelViewerProps {
  modelName: string;
  size?: { x: number; y: number };
  modelControlsEnable: boolean;
}

const ModelViewer = ({
  modelName,
  size,
  modelControlsEnable,
}: ModelViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { scene } = useThreeSetup(mountRef, size);
  const {
    modelData,
    modelControls,
    isLoading,
    isError,
    errorMessage: loaderError,
  } = useModelData(modelName, modelControlsEnable);
  const { errorMessage, modelLoaded, positions, setPositions } = useModelLoader(
    scene,
    modelData,
    isLoading,
    isError,
    modelControls
  );

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
      {modelLoaded && modelControlsEnable && modelControls?.models && (
        <div className="flex">
          <ModelControlsInputs
            modelControls={modelControls}
            positions={positions}
            setPositions={setPositions}
          />
          <ModelControlsComponent
            modelControls={modelControls}
            positions={positions}
            setPositions={setPositions}
          />
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
