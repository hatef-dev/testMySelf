import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
const scene = new THREE.Scene();

const canvas = document.querySelector("#webGl");
const gui = new GUI({
  position: "fixed",
  top: 0,
  right: 0,
  zIndex: 9999,
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 6);
scene.add(camera);

/** texture */
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

/** lights */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

const parameters = {
  count: 500,
  torusCount: 50,
};

/** particles and torus */
let particlesGeometry = null;
let particlesMaterial = null;
let particlesSystem = null;
const material = new THREE.MeshToonMaterial({
  color: "#ffeeff",
  gradientMap: gradientTexture,
});
parameters.colorTorus = "#ffeeff";
gui.addColor(parameters, "colorTorus").onChange(() => {
  material.color.set(parameters.colorTorus);
});

const torusGeometry = new THREE.TorusGeometry(0.1, 0.05, 16, 60);

/** particles */
const generateParticles = () => {
  if (particlesSystem !== null) {
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    scene.remove(particlesSystem);
  }
  particlesGeometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  for (let i = 0; i < parameters.count * 3; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
    positions[i * 3 + 2] = 5 - Math.random() * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particlesMaterial = new THREE.PointsMaterial({
    color: parameters.colorParticles,
    size: 0.03,
    sizeAttenuation: true,
    depthWrite: false,
    // vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  particlesSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesSystem);
};
parameters.colorParticles = "#ffffff";
gui.addColor(parameters, "colorParticles").onChange(() => {
  particlesMaterial.color.set(parameters.colorParticles);
});

generateParticles();
/**GUI particles */
gui
  .add(parameters, "count")
  .min(100)
  .max(1000)
  .step(100)
  .onFinishChange(() => {
    generateParticles();
  });

/** torus */
let torusArray = [];
const generateTorus = () => {
  if (torusArray.length > 0) {
    torusArray.forEach((t) => {
      t.geometry.dispose();
      t.material.dispose();
      scene.remove(t);
    });
  }
  for (let i = 0; i < parameters.torusCount; i++) {
    const torus = new THREE.Mesh(torusGeometry, material);
    torus.position.x = (Math.random() - 0.5) * 40;
    torus.position.y = ((Math.random() - 0.5) > 0 ? 0.6 : -0.6);
    torus.position.z = 5 - Math.random() * 10;
    torus.rotation.x = (Math.random() - 0.5) * 3;
    torus.rotation.y = (Math.random() - 0.5) * 3;
    scene.add(torus);

    torusArray.push(torus);
  }
};


/**GUI torus */
gui
  .add(parameters, "torusCount")
  .min(10)
  .max(100)
  .step(10)
  .onFinishChange(() => {
    generateTorus();
  });

generateTorus();

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;



window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});




const clock = new THREE.Clock();
let currentTime = 0;
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - currentTime;
  currentTime = elapsedTime;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  torusArray.forEach((t) => {
    // Smoother rotation with fixed speeds
    t.rotation.x += deltaTime * 0.5;
    t.rotation.y += deltaTime * 0.3;
    t.rotation.z += deltaTime * 0.2;

    //Gentle floating movement
    // t.position.y = Math.sin(elapsedTime)  ;
    // s
  });

  //   controls.update();
};

animate();

const scrollContainer = document.querySelector(".section");
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