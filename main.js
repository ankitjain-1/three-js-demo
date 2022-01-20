import * as THREE from "three";

import "./style.css";
import background from "./textures/black-and-white-room.jpg";


const scene = new THREE.Scene();

// loading the texture that is used as room backgroud.
const textureLoader = new THREE.TextureLoader();
textureLoader.load(background, function (texture) {
  texture.encoding = THREE.sRGBEncoding;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

// creating the perspective camera.
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// renderer that is used to render the scene, it is using canvas HTML element with 'bg' id.
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// creating texture like chrome
let cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
  format: THREE.RGBFormat,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter,
  encoding: THREE.sRGBEncoding, // temporary -- to prevent the material's shader from recompiling every frame
});

// creating material using chrome texture
let material = new THREE.MeshBasicMaterial({
  envMap: cubeRenderTarget1.texture,
  combine: THREE.MultiplyOperation,
  reflectivity: 1,
});

// creating torus element
const torusRad = 20;
const torusTubeSize = 8;
const torusGeometry = new THREE.TorusGeometry(
  torusRad,
  torusTubeSize,
  32,
  1000
);
const torus = new THREE.Mesh(torusGeometry, material);
scene.add(torus);

const cubeCamera1 = new THREE.CubeCamera(1, 1000, cubeRenderTarget1);

// creating cube element
const cubeSide = ((torusRad - torusTubeSize) * 2) / Math.sqrt(3);
let cubeGeometry = new THREE.BoxGeometry(cubeSide, cubeSide, cubeSide);
let cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);

torus.rotation.y = 1.5;


function animate() {
  requestAnimationFrame(animate);
  cameraRotation();
  cubeRotation();
  // torusRotation();
  
  camera.lookAt(scene.position);
  cubeCamera1.update(renderer, scene);
  material.envMap = cubeRenderTarget1.texture;
  
  renderer.render(scene, camera);
}
animate();

function torusRotation() {
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
}

function cubeRotation() {
  // rotating on it's position
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  
  // moving aroung torus
  const time = Date.now();
  cube.position.x = Math.cos(time * 0.001) * 20;
  cube.position.z = Math.sin(time * 0.001) * 20 + torusRad;
}

// let phi = 0,
//   theta = 0;
// let lon = 0,
//   lat = 0;
function cameraRotation() {
  // lon += 0.15;
  
  // phi = THREE.MathUtils.degToRad(90 - lat);
  // theta = THREE.MathUtils.degToRad(lon);
  // lat = Math.max(-85, Math.min(85, lat));
  
  // camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
  // camera.position.y = 100 * Math.cos(phi);
  // camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
  const time = Date.now();
  camera.position.x = Math.cos(time * 0.0004) * 150;
  camera.position.z = Math.sin(time * 0.0002) * 150;
}

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// let onPointerDownPointerX,
//   onPointerDownPointerY,
//   onPointerDownLon,
//   onPointerDownLat;

// function onPointerDown(event) {
//   event.preventDefault();

//   onPointerDownPointerX = event.clientX;
//   onPointerDownPointerY = event.clientY;

//   onPointerDownLon = lon;
//   onPointerDownLat = lat;

//   document.addEventListener("pointermove", onPointerMove);
//   document.addEventListener("pointerup", onPointerUp);
// }

// document.addEventListener("pointerdown", onPointerDown);

// function onPointerMove(event) {
//   lon = (event.clientX - onPointerDownPointerX) * 0.1 + onPointerDownLon;
//   lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
// }

// function onPointerUp() {
//   document.removeEventListener("pointermove", onPointerMove);
//   document.removeEventListener("pointerup", onPointerUp);
// }
