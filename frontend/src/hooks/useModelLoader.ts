import { useAppSelector } from "./redux";
import { useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useAppDispatch } from "../store";
import { xyz, ModelPositions } from "../types/models";
import { updateModelDataAsync } from "../store/model/model.slice";
import { useActions } from "./actions";

export const useModelLoader = (scene: THREE.Scene) => {
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const actions = useActions();

  const model = useAppSelector((state) => state.model);
  const isLoading = model.isLoadingData || model.isLoadingControls;
  const isError = model.isErrorData || model.isErrorControls;
  const isOnline = model.mode === "online";
  const modelControls = model.modelControls;
  const positions = model.positions;

  useEffect(() => {
    async function modelLoad() {
      try {
        const result = await dispatch(updateModelDataAsync()).unwrap();
        setModelData(result);
      } catch (error) {
        console.error("Failed to load model data:", error);
      }
    }
    modelLoad();
  }, [model.name]);

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
        if (modelRef.current) {
          scene.remove(modelRef.current);
          modelRef.current = null;
        }
        modelRef.current = gltf.scene;
        scene.add(gltf.scene);
        setModelLoaded(true);

        const newPositions: ModelPositions = {};
        gltf.scene.traverse((child) => {
          if (child.type === "Mesh") {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          const controlEntry = modelControls?.models?.[child.name];
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

            newPositions[child.name] = {
              position: Object.keys(position).length ? position : undefined,
              rotation: Object.keys(rotation).length ? rotation : undefined,
            };
          }
        });
        if (!isOnline) actions.updatePositionsLocal(newPositions);
      },
      (error) => {
        setErrorMessage("Error parsing model: " + error.message);
      }
    );
    return () => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = null;
      }
    };
  }, [modelData, scene, modelControls]);

  useEffect(() => {
    if (modelLoaded && modelRef.current) {
      Object.keys(positions).forEach((it) => {
        const part = modelRef.current?.getObjectByName(it);
        if (part) {
          if (positions[it].position) {
            if (positions[it].position.x)
              part.position.x = positions[it].position.x;
            if (positions[it].position.y)
              part.position.y = positions[it].position.y;
            if (positions[it].position.z)
              part.position.z = positions[it].position.z;
          }
          if (positions[it].rotation) {
            if (positions[it].rotation.x)
              part.rotation.x = positions[it].rotation.x;
            if (positions[it].rotation.y)
              part.rotation.y = positions[it].rotation.y;
            if (positions[it].rotation.z)
              part.rotation.z = positions[it].rotation.z;
          }
        }
      });
    }
  }, [positions, modelLoaded]);

  return { modelRef, errorMessage, modelLoaded };
};
