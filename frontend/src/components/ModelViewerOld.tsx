import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, TrackballControls } from "three/examples/jsm/Addons.js";
import setupLCC from "../additions/setupLCC";
import useModelData from "../hooks/useModelData";
interface ModelViewer {
  modelName: string;
  size?: {
    x: number;
    y: number;
  };
  modelControlsEnable: boolean;
}
interface xyz {
  x?: number;
  y?: number;
  z?: number;
}
interface modelPositions {
  models: Array<{
    name: string;
    position?: xyz;
    rotation?: xyz;
  }>;
}

const ModelViewer = ({ modelName, size, modelControlsEnable }: ModelViewer) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [positions, setPositions] = useState<modelPositions>({ models: [] });
  const [modelLoaded, setModelLoaded] = useState(false);
  //TODO: ref for renderer and controls

  const {
    modelData,
    modelControls,
    isLoading,
    isError,
    errorMessage: loaderError,
  } = useModelData(modelName, modelControlsEnable);

  useEffect(() => {
    if (mountRef.current === null || isLoading || isError || !modelData) return;
    const mount = mountRef.current;
    const scene = sceneRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    mount.replaceChildren(renderer.domElement);
    if (size) renderer.setSize(size.x, size.y);
    else renderer.setSize(600, 600);

    const camera = new THREE.PerspectiveCamera(
      75,
      (size?.x || 600) / (size?.y || 600),
      0.1,
      1000
    );
    const controls = new TrackballControls(camera, renderer.domElement);
    setupLCC(scene, renderer, camera, controls);

    const loader = new GLTFLoader();

    // Удаляем предыдущую модель, если она существует
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = null;
    }
    setModelLoaded(false);
    // Парсим ArrayBuffer как GLB файл
    if (!isLoading || !isError)
      loader.parse(
        modelData,
        "",
        (gltf) => {
          modelRef.current = gltf.scene;
          scene.add(gltf.scene);
          setModelLoaded(true);
          gltf.scene.traverse(function (child) {
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

              // Get position values from model for controlled axes
              if (controlEntry.position) {
                Object.keys(controlEntry.position).forEach((axis) => {
                  if (["x", "y", "z"].includes(axis)) {
                    position[axis as keyof xyz] =
                      child.position[axis as "x" | "y" | "z"];
                  }
                });
              }

              // Get rotation values from model for controlled axes
              if (controlEntry.rotation) {
                Object.keys(controlEntry.rotation).forEach((axis) => {
                  if (["x", "y", "z"].includes(axis)) {
                    rotation[axis as keyof xyz] =
                      child.rotation[axis as "x" | "y" | "z"];
                  }
                });
              }

              // Update state with initial values
              setPositions((prev) => ({
                models: [
                  ...prev.models.filter((m) => m.name !== child.name),
                  {
                    name: child.name,
                    position: Object.keys(position).length
                      ? position
                      : undefined,
                    rotation: Object.keys(rotation).length
                      ? rotation
                      : undefined,
                  },
                ],
              }));
            }
          });
        },
        (error) => {
          // console.error("Error parsing model:", error);
          setErrorMessage("Error parsing model: " + error.message);
        }
      );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      // Очищаем сцену и рендерер
      scene.clear();
      renderer.dispose();
      controls.dispose();
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [modelData, isLoading, isError, size, modelControls?.models]);

  useEffect(() => {
    if (modelLoaded && modelRef.current) {
      positions?.models.forEach((it) => {
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

  return (
    <div className="relative flex">
      <div ref={mountRef} />
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
      {modelControlsEnable && modelControls?.models && (
        <div>
          {modelControls.models.map((it) => {
            const part = positions.models.find(
              (fit) => fit.name === it.name
            ) || { name: it.name };
            const filteredModels = positions.models.filter(
              (fit) => fit.name !== it.name
            );
            return (
              <div
                key={it.name}
                className="border-1 border-white border-solid p-2"
              >
                <p>{it.name}</p>
                <div className="flex gap-3">
                  {it.position && (
                    <div>
                      <p>Position</p>
                      {(
                        Object.keys(it.position) as Array<
                          keyof typeof it.position
                        >
                      ).map((axis) => {
                        return (
                          <div
                            key={`pos-${axis}`}
                            className="flex flex-justify-between"
                          >
                            <span>{axis}</span>
                            <input
                              type="number"
                              value={Number(part.position?.[axis] || 0)}
                              min={Number(it.position?.[axis]?.[0]) || 1000}
                              max={Number(it.position?.[axis]?.[1]) || 1000}
                              step={0.1}
                              onChange={(e) => {
                                part.position = part?.position || {};
                                part.position[axis] = Number(e.target.value);
                                setPositions({
                                  models: [...filteredModels, part],
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {it.rotation && (
                    <div>
                      <p>Rotation</p>
                      {(
                        Object.keys(it.rotation) as Array<
                          keyof typeof it.rotation
                        >
                      ).map((axis) => (
                        <div
                          key={`rot-${axis}`}
                          className="flex flex-justify-between"
                        >
                          <span>{axis}</span>
                          <input
                            type="number"
                            value={Number(part.rotation?.[axis] || 0)}
                            min={Number(it.rotation?.[axis]?.[0]) || 1000}
                            max={Number(it.rotation?.[axis]?.[1]) || 1000}
                            step={0.1}
                            onChange={(e) => {
                              part.rotation = part?.rotation || {};
                              part.rotation[axis] = Number(e.target.value);
                              setPositions({
                                models: [...filteredModels, part],
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ModelViewer;
