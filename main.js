import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Geometry and Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xa9a9a9 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1, // Smaller near clipping plane
  1000
);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Enables smooth damping for better experience

/**
 * Animation
 */
// GSAP animation
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

// Cursor object for mouse movement
const cursor = {
  x: 0,
  y: 0,
};

// Mousemove event listener
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5; // Normalize cursor x
  cursor.y = -(event.clientY / sizes.height) + 0.5; // Normalize cursor y
});

/**
 * Animation loop
 */
const tick = () => {
  // Update controls for smooth interaction
  controls.update();

  // Update camera position based on cursor movement
  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3; // Adjust camera rotation radius
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  camera.position.y = cursor.y * 3; // Adjust camera height
  camera.lookAt(mesh.position); // Camera always looks at the mesh

  // Render the scene from the camera's perspective
  renderer.render(scene, camera);

  // Recursive animation frame call
  window.requestAnimationFrame(tick);
};

// Call the animation loop
tick();
