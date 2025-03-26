import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader, TrackballControls } from "three/examples/jsm/Addons.js";

const Example = ({ modelName }: { modelName: string }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [position, setPosition] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (mountRef.current === null) return;

    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(20, -20, 20);
    camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(600, 600);
    renderer.setClearColor(0x3f3f3f, 1);

    mountRef.current.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x808080);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.2;

    const loader = new GLTFLoader();

    // Fetch the model from the server
    fetch(`http://localhost:8046/api/models/${modelName}`)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        // console.log(data)
        // Remove the previous model if it exists
        if (modelRef.current) {
          scene.remove(modelRef.current);
          modelRef.current = null;
        }

        // Parse the ArrayBuffer as a GLB file
        loader.parse(
          data,
          "", // Base path (empty since we're loading a binary file)
          (gltf) => {
            modelRef.current = gltf.scene; // Store the reference to the loaded model
            scene.add(gltf.scene);
            setModelLoaded(true);
          },
          (error) => {
            console.error("Error parsing model:", error);
          }
        );
      })
      .catch((error) => {
        console.error("Error loading model:", error);
      });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      // Cleanup the scene and renderer
      scene.clear(); 
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelName]);

  useEffect(() => {
    if (modelLoaded && modelRef.current) {
      const tree = modelRef.current.getObjectByName("Cube");
      if (tree) {
        tree.position.x = position;
      }
    }
  }, [position, modelLoaded]);

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

export default Example;