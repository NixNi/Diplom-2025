import { useRef } from "react";
import { useThreeSetup } from "../hooks/useThreeSetup";
import { useModelLoader } from "../hooks/useModelLoader";
// import useModelData from "../hooks/useModelData";
import { ModelControlsInputs } from "./ModelControlsInputs";
import { ModelControlsComponent } from "./ModelControls";
import { useAppSelector } from "../hooks/redux";
// import { modelData } from "../store/model/model.slice";
// import { useActions } from "../hooks/actions";

interface ModelViewerProps {
  // modelName: string;
  size?: { x: number; y: number };
  modelControlsEnable: boolean;
  modelData: ArrayBuffer | null;
}

const ModelViewer = ({
  modelData,
  size,
  modelControlsEnable,
}: ModelViewerProps) => {
  const model = useAppSelector(state => state.model);
  
  const mountRef = useRef<HTMLDivElement>(null);
  const { scene } = useThreeSetup(mountRef, size);
  const { errorMessage, modelLoaded, positions, setPositions } = useModelLoader(
    scene,
    modelData,
    model.isLoadingData || model.isLoadingControls,
    model.isErrorData || model.isErrorControls,
    model.modelControls
  );
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
          <ModelControlsInputs
            modelControls={model.modelControls}
            positions={positions}
            setPositions={setPositions}
          />
          <ModelControlsComponent
            modelControls={model.modelControls}
            positions={positions}
            setPositions={setPositions}
          />
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
