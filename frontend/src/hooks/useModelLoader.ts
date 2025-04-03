import { useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { modelControls } from "../hooks/useModelData"; // Предполагаемый тип

interface xyz {
  x?: number;
  y?: number;
  z?: number;
}

interface ModelPositions {
  models: Array<{
    name: string;
    position?: xyz;
    rotation?: xyz;
  }>;
}

export const useModelLoader = (
  scene: THREE.Scene,
  modelData: ArrayBuffer | null,
  isLoading: boolean,
  isError: boolean,
  modelControls?: modelControls | null 
) => {
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [positions, setPositions] = useState<ModelPositions>({ models: [] });

  useEffect(() => {
    setModelLoaded(false);
    if (!modelData || isLoading || isError) return;

    const loader = new GLTFLoader();
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = null;
    }

    loader.parse(
      modelData,
      "",
      (gltf) => {
        modelRef.current = gltf.scene;
        scene.add(gltf.scene);
        setModelLoaded(true);

        gltf.scene.traverse((child) => {
          if (child.type === "Mesh") {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          const controlEntry = modelControls?.models?.find(
            (m) => m.name === child.name
          );
          if (controlEntry) {
            const position: xyz = {};
            const rotation: xyz = {};

            if (controlEntry.position) {
              Object.keys(controlEntry.position).forEach((axis) => {
                if (["x", "y", "z"].includes(axis)) {
                  position[axis as keyof xyz] =
                    child.position[axis as "x" | "y" | "z"];
                }
              });
            }

            if (controlEntry.rotation) {
              Object.keys(controlEntry.rotation).forEach((axis) => {
                if (["x", "y", "z"].includes(axis)) {
                  rotation[axis as keyof xyz] =
                    child.rotation[axis as "x" | "y" | "z"];
                }
              });
            }

            setPositions((prev) => ({
              models: [
                ...prev.models.filter((m) => m.name !== child.name),
                {
                  name: child.name,
                  position: Object.keys(position).length ? position : undefined,
                  rotation: Object.keys(rotation).length ? rotation : undefined,
                },
              ],
            }));
          }
        });
      },
      (error) => {
        setErrorMessage("Error parsing model: " + error.message);
      }
    );
  }, [modelData, isLoading, isError, scene, modelControls]);

  useEffect(() => {
    if (modelLoaded && modelRef.current) {
      positions.models.forEach((it) => {
        const part = modelRef.current?.getObjectByName(it.name);
        if (part) {
          if (it.position) {
            if (it.position.x) part.position.x = it.position.x;
            if (it.position.y) part.position.y = it.position.y;
            if (it.position.z) part.position.z = it.position.z;
          }
          if (it.rotation) {
            if (it.rotation.x) part.rotation.x = it.rotation.x;
            if (it.rotation.y) part.rotation.y = it.rotation.y;
            if (it.rotation.z) part.rotation.z = it.rotation.z;
          }
        }
      });
    }
  }, [positions, modelLoaded]);

  return { modelRef, errorMessage, modelLoaded, positions, setPositions };
};
