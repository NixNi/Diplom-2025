import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader, TrackballControls } from 'three/examples/jsm/Addons.js';

const D3Viewer = ({ modelName }: { modelName: string }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return; // Check if mountRef.current is null

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.set(20, -20, 20);
        camera.lookAt(scene.position);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(600, 600);

        // // Append the renderer's DOM element to the mountRef
        mountRef.current.appendChild(renderer.domElement);


        // const cubegem = new THREE.BoxGeometry(2, 2, 2);
        // const mat = new THREE.MeshToonMaterial({color: 0xff333f})
        // const cube = new THREE.Mesh(cubegem, mat)
        // // scene.add(cube)
        
        const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
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
        fetch(`http://localhost:8046/api/models/file/${modelName}`)
            .then((response) => response.arrayBuffer())
            .then((data) => {
                loader.parse(data, '', (gltf) => {
                    scene.add(gltf.scene);
                }, (error) => {
                    console.error('Error parsing model:', error);
                });
            })
            .catch((error) => {
                console.error('Error loading model:', error);
            });

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update()
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [modelName]);

    return <div ref={mountRef}></div>;
};

export default D3Viewer;