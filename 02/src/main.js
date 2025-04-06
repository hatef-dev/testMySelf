import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
const scene = new THREE.Scene();

const gui = new GUI();
const parameters = {
  color: "#000000",
};

const environmentLoader = new RGBELoader();
environmentLoader.load("./texture/hdr/brown_photostudio_02_2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
});
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const fontLoader = new FontLoader();
fontLoader.load("./helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  textGeometry.center();
  const material = new THREE.MeshBasicMaterial({ color: parameters.color });
  gui.addColor(parameters, "color").onChange(() => {
    material.color.set(parameters.color);
  });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
});

const canvas = document.querySelector("#webgl");

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});

const clock = new THREE.Clock();

const animate = () => {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

animate();