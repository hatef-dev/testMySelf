import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10) ;


const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);  
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

// Lock Y and Z positions
// controls.target.y = 0; // Lock Y to 0 (or whatever value you want)


// Optional: Restrict vertical rotation if needed
controls.minPolarAngle = Math.PI/4;
controls.maxPolarAngle = Math.PI /2 ; // 45 degrees from top


// Optional: If you want to restrict the orbit to only horizontal rotation
controls.enableRotate = true;
// controls.minAzimuthAngle = -Math.PI; // Full rotation on X axis
// controls.maxAzimuthAngle = Math.PI;

controls.getAzimuthalAngle()

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();