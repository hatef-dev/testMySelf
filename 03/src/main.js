import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
const scene = new THREE.Scene();
const gui = new GUI();
const canvas = document.querySelector("#webgl");

const parameters = {
  count: 600,
  radius: 2,
  spin: 1,
  branches: 3,

};


let particlesGeometry = null;
let particlesMaterial = null;
let particles = null;

const generateParticles = () => {
  if (particles !== null) {
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    scene.remove(particles);
  }

  particlesGeometry = new THREE.BufferGeometry();
 
  let positions = new Float32Array(parameters.count * 3);
  for (let i = 0; i < parameters.count; i++) {
    const radius = Math.random() * parameters.radius;
    const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = radius * parameters.spin;
    
    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: "#ffffff",
  });
  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
}
gui.add(parameters, "count").min(100).max(10000).step(100).onChange(generateParticles);
gui.add(parameters, "radius").min(0).max(5).step(0.01).onChange(generateParticles);
gui.add(parameters, "spin").min(0).max(10).step(0.01).onChange(generateParticles);
gui.add(parameters, "branches").min(1).max(10).step(1).onChange(generateParticles);
generateParticles();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera)

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, camera);
});


const clock = new THREE.Clock();

const animate = () => {
  window.requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
animate()