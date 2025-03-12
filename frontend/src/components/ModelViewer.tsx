import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader, TrackballControls } from "three/examples/jsm/Addons.js";
import addLCC from "./additions/AddLCC";
import useModelData from "../hooks/models";

interface ModelViewer {
  modelName: string;
  size?: {
    x: number;
    y: number;
  };
}

const ModelViewer = ({ modelName, size }: ModelViewer) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [position, setPosition] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);

  const { modelData, isLoading, isError } = useModelData(modelName);

  useEffect(() => {
    if (mountRef.current === null || isLoading || isError || !modelData) return;

    const scene = sceneRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    mountRef.current.replaceChildren(renderer.domElement);
    if (size) renderer.setSize(size.x, size.y);
    else renderer.setSize(600, 600);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const controls = new TrackballControls(camera, renderer.domElement);
    addLCC(scene, renderer, camera, controls);

    const loader = new GLTFLoader();

    // Удаляем предыдущую модель, если она существует
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = null;
    }

    // Парсим ArrayBuffer как GLB файл
    loader.parse(
      modelData,
      "", // Base path (пустой, так как мы загружаем бинарный файл)
      (gltf) => {
        modelRef.current = gltf.scene; // Сохраняем ссылку на загруженную модель
        scene.add(gltf.scene);
        setModelLoaded(true);
      },
      (error) => {
        console.error("Error parsing model:", error);
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
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelData, isLoading, isError, size]);

  useEffect(() => {
    if (modelLoaded && modelRef.current) {
      const tree = modelRef.current.getObjectByName("Cube");
      if (tree) {
        tree.position.x = position;
      }
    }
  }, [position, modelLoaded]);

  if (isLoading) return <div>Loading model...</div>;
  if (isError) return <div>Error loading model</div>;

  return (
    <div className="flex flex-1">
      <div ref={mountRef} />
      <div>
        <input
          type="number"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ModelViewer;
