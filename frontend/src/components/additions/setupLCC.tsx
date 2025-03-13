import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
} from "three";
import { TrackballControls } from "three/examples/jsm/Addons.js";

export default function setupLCC(
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  controls: TrackballControls
) {
  camera.position.set(20, -20, 20);
  camera.lookAt(scene.position);
  renderer.setClearColor(0x3f3f3f, 1);

  const ambientLight = new AmbientLight(0x808080);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.2;
}
