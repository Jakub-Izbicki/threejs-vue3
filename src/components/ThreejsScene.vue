<template>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import {MapControls} from "three/examples/jsm/controls/OrbitControls";

const frustumSize = 10;

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('app')!.appendChild(renderer.domElement);

const controls = new MapControls(camera, renderer.domElement);
// controls.enableRotate = false;

camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

const ground = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.MeshPhongMaterial({
  color: 0x777777,
}));
ground.receiveShadow = true;
ground.rotation.y = Math.PI / 4;

const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0x325ea8}));
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.x = -2;
cube.position.y = 1;
cube.rotation.y = Math.PI * (1 / 4);

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0x325ea8}));
cube2.castShadow = true;
cube2.receiveShadow = true;
cube2.position.x = -1;
cube2.position.y = 1;
cube2.position.z = 1.5;
cube2.rotation.y = Math.PI / 4;

const axesHelper = new THREE.AxesHelper(2);
cube.add(axesHelper);

const ball = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial({color: 0x325ea8}));
ball.castShadow = true;
ball.receiveShadow = true;
ball.position.x = 2;
ball.position.y = 1;

scene.add(ground);
scene.add(cube);
scene.add(cube2);
scene.add(ball);

// lights

const dirLight1 = new THREE.PointLight(0xffffff);
dirLight1.position.set(5, 5, 5);
dirLight1.castShadow = true;
scene.add(dirLight1);

const lightBall = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshToonMaterial({color: 0xeeee00}));
dirLight1.add(lightBall);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

function animate(frame: number) {
  requestAnimationFrame(animate);

  dirLight1.position.x = Math.sin(frame / 1000) * 5;
  dirLight1.position.z = Math.cos(frame / 1000) * 5;

  renderer.render(scene, camera);
}

window.onresize = () => {
  const newAspect = window.innerWidth / window.innerHeight;
  camera.left = frustumSize * newAspect / -2;
  camera.right = frustumSize * newAspect / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

animate(window.performance.now());
</script>
