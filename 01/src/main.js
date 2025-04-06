import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
const scene = new THREE.Scene();

const gui = new GUI();
const parameters = {
  count: 500,
};

const canvas = document.querySelector("#webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const textureLoader = new THREE.TextureLoader();
const color = textureLoader.load(".");

let particleGeometry = null;
let particleMaterial = null;
let particleSystem = null;


const generateParticles = () => {
  if (particleSystem !== null) {
    particleGeometry.dispose();
    particleMaterial.dispose();
    scene.remove(particleSystem);
  }
  
  const positions = new Float32Array(parameters.count * 3);
  
  for (let i = 0; i < parameters.count; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    
    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );
    
    particleMaterial = new THREE.PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: "white",
    });
    
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
};
generateParticles();

gui
  .add(parameters, "count")
  .min(100)
  .max(10000)
  .step(100)
  .onFinishChange(generateParticles);

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
});

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

animate();
