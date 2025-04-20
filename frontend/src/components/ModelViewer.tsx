import { useRef } from "react";
import { useThreeSetup } from "../hooks/useThreeSetup";
import { useModelLoader } from "../hooks/useModelLoader";
import { ModelControlsInputs } from "./ModelControlsInputs";
import { ModelControlsComponent } from "./ModelControls";
import { useAppSelector } from "../hooks/redux";
import STabViewer from "./shared/STabViewer";
import STab from "./shared/STab";

interface ModelViewerProps {
  size?: { x: number; y: number };
  modelControlsEnable: boolean;
  children?: React.ReactNode;
}

const ModelViewer = ({
  size,
  modelControlsEnable,
  children,
}: ModelViewerProps) => {
  const model = useAppSelector((state) => state.model);

  const mountRef = useRef<HTMLDivElement>(null);
  const { scene } = useThreeSetup(mountRef, size);
  const { errorMessage, modelLoaded } = useModelLoader(scene);
  const loaderError = model.errorMessage;

  return (
    <div className="relative flex flex-wrap">
      <div
        className="relative flex"
        style={{ width: size?.x || 600, height: size?.y || 600 }}
      >
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
            className="flex filler absolute"
          >
            <div className="secondary m-auto p-10 font-bold text-5">
              {loaderError || errorMessage}
            </div>
          </div>
        )}
        {children}
      </div>
      {modelLoaded && modelControlsEnable && model.modelControls?.models && (
        <STabViewer>
          <STab title="Интерфейс" default>
            <ModelControlsComponent />
          </STab>
          <STab title="Ручной ввод">
            <ModelControlsInputs />
          </STab>
        </STabViewer>
      )}
    </div>
  );
};

export default ModelViewer;
