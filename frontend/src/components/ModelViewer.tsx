import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, TrackballControls } from "three/examples/jsm/Addons.js";
import setupLCC from "./additions/setupLCC";
import useModelData from "../hooks/models";
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
  }, [modelData, isLoading, isError, size]);

  useEffect(() => {
    if (modelLoaded && modelRef.current) {
      positions?.models.forEach((it) => {
        const part = modelRef.current?.getObjectByName(it.name);
        if (part) {
          if (it.position && it.position.x) {
            part.position.x = it.position.x;
          }
        }
      });
      // const tree = modelRef.current.getObjectByName("Cube");
      // if (tree) {
      //   tree.position.x = position;
      // }
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
            return (
              <div key={it.name}>
                <p>{it.name}</p>
                {it.position && (
                  <div>
                    <p>Position</p>
                    {(
                      Object.keys(it.position) as Array<
                        keyof typeof it.position
                      >
                    ).map((euler) => (
                      <div key={euler}>
                        <span>{euler}</span>
                        <input
                          type="number"
                          min={Number(it.position?.[euler]?.[0]) || 1000}
                          max={Number(it.position?.[euler]?.[1]) || 1000}
                          onChange={(e) => {
                            const part = positions.models.find(
                              (fit) => fit.name === it.name
                            ) || { name: it.name };

                            part.position = part?.position || {};
                            part.position[euler] = Number(e.target.value);
                            console.log([
                              ...positions.models.filter(
                                (fit) => fit.name !== it.name
                              ),
                              part,
                            ]);
                            setPositions({
                              models: [
                                ...positions.models.filter(
                                  (fit) => fit.name !== it.name
                                ),
                                part,
                              ],
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ModelViewer;
