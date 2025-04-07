import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";

// Initialize GUI

const scene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gradientMap = new THREE.TextureLoader().load("textures/gradients/3.jpg");
gradientMap.magFilter = THREE.NearestFilter;
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 5;
scene.add(camera);

const particlesGeometry = new THREE.BufferGeometry();
const count = 10000;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 300;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
  positions[i * 3 + 2] = 3 - Math.random() * 6;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: "#ffeded",
  size: 0.03,
  sizeAttenuation: true,
});

const particlesSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesSystem);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#webgl"),
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const scrollContainer = document.querySelector(".main");
let targetScroll = 0;
let targetCameraX = 0;

scrollContainer.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  const scrollAmount = evt.deltaY;
  
  const currentScroll = scrollContainer.scrollLeft;
  targetScroll = currentScroll + scrollAmount;
  // Adjust the camera movement to match scroll position more precisely
  targetCameraX = (targetScroll / sizes.width) * 16;

  gsap.to(scrollContainer, {
    scrollLeft: targetScroll,
    duration: 0.5,
    ease: "power2.out",
  });

  gsap.to(camera.position, {
    x: targetCameraX,
    duration: 0.5,
    ease: "power2.out",
  });
});







let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let currentScroll = 0;

scrollContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX;
  scrollLeft = scrollContainer.scrollLeft;
});
scrollContainer.addEventListener('mouseleave', () => {
  isDragging = false;
});

scrollContainer.addEventListener('mouseup', () => {
  isDragging = false;
});

scrollContainer.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  
  const x = e.pageX;
  const walk = (startX - x);
  const targetScroll = scrollLeft + walk;
  
  // Animate both the scroll and camera position
  gsap.to(scrollContainer, {
    scrollLeft: targetScroll,
    duration: 0.5,
    ease: "power2.out"
  });

  gsap.to(camera.position, {
    x: targetScroll * 0.01, // Adjust this multiplier to control camera movement speed
    duration: 0.5,
    ease: "power2.out"
  });
  
  scrollX = targetScroll;
});



const animate = () => {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // Cone.rotation.y += 0.01;
  // torus.rotation.y += 0.01;
  // torusKnot.rotation.y += 0.01;
};

animate();
