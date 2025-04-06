import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();

const canvas = document.querySelector('#webgl');

const sizes = { 
    width: window.innerWidth,
    height: window.innerHeight
}


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const textureLoader = new THREE.TextureLoader();
const color = textureLoader.load('.');

const particleGeometry = new THREE.BufferGeometry();
const count = 500;

const positions = new Float32Array(count * 3);

for(let i = 0; i < count; i++) {
    positions[i] = (Math.random() - 0.5) * 3;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.03,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 'white',
    // map: color,
});

const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);



const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const clock = new THREE.Clock();

const animate = () => {
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
    const elapsedTime = clock.getElapsedTime();
    controls.update();
}

animate();



