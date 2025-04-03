import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  // PCFSoftShadowMap,
} from "three";
import { TrackballControls } from "three/examples/jsm/Addons.js";

export default function setupLCC(
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  controls: TrackballControls
) {
  camera.position.set(20, 20, -5);
  camera.lookAt(scene.position);
  renderer.setClearColor(0x3f3f3f, 1);
  renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = PCFSoftShadowMap;

  const ambientLight = new AmbientLight(0xffffff, 1.6);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 2.3);
  directionalLight.position.set(140, 140, -15);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024; // default
  directionalLight.shadow.mapSize.height = 1024; // default
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 1000;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.bias = -0.0002;
  scene.add(directionalLight);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.2;

  // return directionalLight.shadow.camera;
}
