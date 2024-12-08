import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Text Geometry
  const textGeometry = new TextGeometry("Metalness Color", {
    font: font,
    size: 1,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  // Apply material to the text
  const material = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Silver color
    metalness: 2, // Enhance metallic appearance
    roughness: 0.5, // Adjust roughness for a polished look
  });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
});

/**
 * 3D Particles with Donut and Triangle Shapes
 */
const particleCount = 500;
const particles = []; // Initialize an array to store particles

// Geometry for donut shapes (particles)
const torusGeometry = new THREE.TorusGeometry(0.2, 0.05, 16, 32); // Torus (donut) geometry

// Geometry for triangle shapes (particles)
const triangleGeometry = new THREE.TetrahedronGeometry(0.3); // Tetrahedron as triangle-like particle

// Create a material for the donut particles with metallic silver appearance
const torusMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xc0c0c0, // Silver color in hexadecimal
  metalness: 1,
  roughness: 0.2,
  clearcoat: 0.9,
  clearcoatRoughness: 0.1,
  transparent: true,
  opacity: 0.9,
});

// Create a material for the triangle particles with pearl-like appearance
const triangleMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xf0f0f0, // Light pearl color (very light gray with a hint of warmth)
  metalness: 1, // Low metalness to give it a pearl-like, non-metallic look
  roughness: 0.6, // Some roughness to simulate pearl texture
  clearcoat: 1, // High clearcoat for shine
  clearcoatRoughness: 0.2, // Slight roughness to enhance the pearl effect
  transparent: true,
  opacity: 0.9, // Slight transparency for aesthetic appeal
});

for (let i = 0; i < particleCount; i++) {
  // Randomize positions within a volume
  const x = (Math.random() - 0.5) * 30;
  const y = (Math.random() - 0.5) * 20;
  const z = (Math.random() - 0.5) * 20;

  // Randomly choose between torus (donut) and triangle
  const isTorus = Math.random() > 0.5; // 50% chance to choose torus

  let shape;
  if (isTorus) {
    shape = new THREE.Mesh(torusGeometry, torusMaterial);
  } else {
    shape = new THREE.Mesh(triangleGeometry, triangleMaterial);
  }

  shape.position.set(x, y, z);

  // Randomize rotation for variation
  shape.rotation.x = Math.random() * Math.PI;
  shape.rotation.y = Math.random() * Math.PI;

  // Store the particle
  particles.push(shape);

  // Add each particle to the scene
  scene.add(shape);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 5);
scene.add(directionalLight);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x808080); // Set the background to gray

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate the particles (rotate them)
  particles.forEach((shape) => {
    shape.rotation.x = elapsedTime * 0.1; // Rotate each shape
    shape.rotation.y = elapsedTime * 0.1;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
