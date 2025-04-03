import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/Addons.js";
import setupLCC from "../additions/setupLCC";

export const useThreeSetup = (
  mountRef: React.RefObject<HTMLDivElement | null>,
  size?: { x: number; y: number }
) => {
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<TrackballControls | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    mount.replaceChildren(renderer.domElement);
    const width = size?.x || 600;
    const height = size?.y || 600;
    renderer.setSize(width, height);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const controls = new TrackballControls(camera, renderer.domElement);
    controlsRef.current = controls;

    setupLCC(sceneRef.current, renderer, camera, controls);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(sceneRef.current, camera);
    };
    animate();

    return () => {
      sceneRef.current.clear();
      renderer.dispose();
      controls.dispose();
      if (mount) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  return {
    scene: sceneRef.current,
    renderer: rendererRef.current,
    camera: cameraRef.current,
    controls: controlsRef.current,
  };
};
