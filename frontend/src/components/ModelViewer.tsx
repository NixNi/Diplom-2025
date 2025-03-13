import { useEffect, useState, useRef } from "react";
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
}

const ModelViewer = ({ modelName, size }: ModelViewer) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const modelRef = useRef<THREE.Object3D | null>(null);
  //TODO: ref for renderer and controls

  const { modelData, isLoading, isError } = useModelData(modelName);

  useEffect(() => {
    if (mountRef.current === null || isLoading || isError || !modelData) return;

    const scene = sceneRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // rendererRef.current = renderer;
    // mountRef.current.removeChild(mountRef.current.children[0])
    mountRef.current.replaceChildren(renderer.domElement);
    if (size) renderer.setSize(size.x, size.y);
    else renderer.setSize(600, 600);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const controls = new TrackballControls(camera, renderer.domElement);
    // controlsRef.current = controls;
    setupLCC(scene, renderer, camera, controls);

    const loader = new GLTFLoader();

    // Удаляем предыдущую модель, если она существует
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = null;
    }

    // Парсим ArrayBuffer как GLB файл
    if (!isLoading || !isError)
      loader.parse(
        modelData,
        "",
        (gltf) => {
          modelRef.current = gltf.scene;
          scene.add(gltf.scene);
          // setModelLoaded(true);
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
      renderer.dispose();
      controls.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelData, isLoading, isError, size]);

  // if (isLoading) return <div>Loading model...</div>;
  // if (isError) return <div>Error loading model</div>;

  return <div ref={mountRef} />;
};

export default ModelViewer;
