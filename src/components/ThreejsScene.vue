<template>
</template>

<script setup lang="ts">
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app')!.appendChild(renderer.domElement);

camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const material = new THREE.LineBasicMaterial({color: 0x0000ff});

const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry, material);

scene.add(line);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
</script>
