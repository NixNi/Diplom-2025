import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, TrackballControls } from "three/examples/jsm/Addons.js";
import setupLCC from "../additions/setupLCC";

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
  const sceneRef = useRef(new THREE.Scene());
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //TODO: ref for renderer and controls

  useEffect(() => {
    setErrorMessage(null);
    if (setExternalError) setExternalError(null);
    // Сбрасываем состояние ошибки перед каждой загрузкой модели

    if (mountRef.current === null) return;
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

    // Парсим ArrayBuffer как GLB файл
    try {
      loader.parse(
        model,
        "",
        (gltf) => {
          modelRef.current = gltf.scene;
          scene.add(gltf.scene);
        },
        (error) => {
          // console.error("Error parsing model:", error);
          setErrorMessage("Error parsing model: " + error.message);
          if (setExternalError)
            setExternalError("Error parsing model: " + error.message);
        }
      );
    } catch (e) {
      setErrorMessage("Error while trying to parse file");
      if (setExternalError)
        setExternalError("Error while trying to parse file");
    }

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
  }, [model, size]);

  return (
    <div>
      <p>{errorMessage}</p>
      {!errorMessage && <div ref={mountRef} />}
      {errorMessage && (
        <div
          style={{ width: size?.x || 600, height: size?.y || 600 }}
          className="flex filler"
        >
          <div className="secondary m-auto p-10 font-bold text-5">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};
export default ModelPreview;
