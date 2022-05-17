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
  flatShading: true
}));
ground.receiveShadow = true;
const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0x325ea8, flatShading: true}));
cube.castShadow = true;

cube.position.y = 1;
cube.rotation.y = Math.PI * (1/4);

const axesHelper = new THREE.AxesHelper(2);
cube.add(axesHelper);

scene.add(ground);
scene.add(cube);

// lights

const dirLight1 = new THREE.DirectionalLight(0xffffff);
dirLight1.position.set(1, 1, 1);
dirLight1.castShadow = true;
scene.add(dirLight1);

const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

function animate(frame: number) {
  requestAnimationFrame(animate);

  // cube.rotation.x = frame / 1000;
  // cube.rotation.y = frame / 1000;

  renderer.render(scene, camera);
}

animate(window.performance.now());
</script>
