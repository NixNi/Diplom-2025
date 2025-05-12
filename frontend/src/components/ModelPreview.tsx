import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader, TrackballControls } from "three/examples/jsm/Addons.js";
// import setupLCC from "../additions/setupLCC";
import { useThreeSetup } from "../hooks/useThreeSetup";
import { useModelLoader } from "../hooks/useModelLoader";

interface ModelPreview {
  model: ArrayBuffer;
  setExternalError?: (text: string | null) => void;
  size?: {
    x: number;
    y: number;
  };
}
//TODO:fix model reloading error, canvas does not creates after file with error was loaded
const ModelPreview = ({ model, size, setExternalError }: ModelPreview) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { scene } = useThreeSetup(mountRef, size);
  const { errorMessage } = useModelLoader(scene, { model: model });
  useEffect(() => {
    if (setExternalError) setExternalError(errorMessage);
  }, [model, errorMessage]);

  return (
    <div>
      <div className="relative flex flex-wrap">
        <div
          className="relative flex"
          style={{ width: size?.x || 600, height: size?.y || 600 }}
        >
          <div
            ref={mountRef}
            style={{
              visibility: !errorMessage ? "visible" : "hidden",
              position: !errorMessage ? "initial" : "absolute",
            }}
          />
          {errorMessage && (
            <div
              style={{ width: size?.x || 600, height: size?.y || 600 }}
              className="flex filler absolute"
            >
              <div className="secondary m-auto p-10 font-bold text-5">
                {errorMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ModelPreview;
