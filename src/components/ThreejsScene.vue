<template>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import {MapControls} from "three/examples/jsm/controls/OrbitControls";
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import RenderPixelatedPass from "./lib/shader/RenderPixelatedPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import PixelatePass from "./lib/shader/PixelatePass";
import {createCubeTileAt, createCubeTileGeometry} from "./lib/util/Tiles";
import {Font, FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {onMounted, toRaw} from "vue";
import Stats from "three/examples/jsm/libs/stats.module";
import MultiGeometryMeshBuilder from "./lib/util/MultiGeometryMeshBuilder";

const all = async () => {


  let screenResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
  let renderResolution = screenResolution.clone().divideScalar(6);
  renderResolution.x |= 0;
  renderResolution.y |= 0;

  const frustumSize = 10;

  const scene = new THREE.Scene();
  const aspect = screenResolution.x / screenResolution.y;
  const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(screenResolution.x, screenResolution.y);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('app')!.appendChild(renderer.domElement);

  const controls = new MapControls(camera, renderer.domElement);
// controls.enablePan = false;
// controls.enableRotate = false;

  camera.position.set(10, 10, 10);
// camera.position.set(0, 10, 0);
  camera.lookAt(0, 0, 0);

  const ground = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.MeshPhongMaterial({
    color: 0x777777,
  }));
  ground.receiveShadow = true;
  ground.rotation.y = Math.PI / 4;

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({color: 0x325338}));
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.x = 0;
  cube.position.z = 0;
  cube.position.y = 1;

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshPhongMaterial({color: 0x325ea8}));
  ball.castShadow = true;
  ball.receiveShadow = true;
  ball.position.x = 2;
  ball.position.y = 1;

  scene.add(ground);
// scene.add(cube);
// scene.add(cube2);
// scene.add(ball);

  const loader = new FontLoader();

  function loadFont(url: string): Promise<Font> {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });
  }

  const font = await loadFont('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json');

  const size = 4;
  const coords = [...Array(size).keys()].flatMap(i => [...Array(size).keys()].map(j => ({x:i, z:j})));

  console.log(`cubes: ${coords.length}`);

  const builder = new MultiGeometryMeshBuilder(new THREE.MeshToonMaterial({color: 0x325ea8}));

  coords.forEach(c => {
    builder.addGeometry(createCubeTileGeometry(c.x, c.z));
  });

  scene.add(builder.build());

// lights

  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(10, 10, -5);
  dirLight1.castShadow = true;
  scene.add(dirLight1);

  const lightBall = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshToonMaterial({color: 0xeeee00}));
  dirLight1.add(lightBall);

  const ambientLight = new THREE.AmbientLight(0x333333, 2);
  scene.add(ambientLight);

// shaders
  const composer = new EffectComposer(renderer);

  let renderPixelatedPass = new RenderPixelatedPass(renderResolution, scene, camera);
  composer.addPass(renderPixelatedPass);

  let bloomPass = new UnrealBloomPass(screenResolution, .4, .1, .9);
// composer.addPass(bloomPass);

  let pixelatePass = new PixelatePass(renderResolution);
// composer.addPass(pixelatePass);

  window.addEventListener('resize', () => {
    const newAspect = window.innerWidth / window.innerHeight;
    camera.left = frustumSize * newAspect / -2;
    camera.right = frustumSize * newAspect / 2;
    camera.updateProjectionMatrix();

    screenResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    renderResolution = screenResolution.clone().divideScalar(6);
    renderResolution.x |= 0;
    renderResolution.y |= 0;

    renderPixelatedPass.shaderMaterial.uniforms.resolution.value = new THREE.Vector4(
        renderResolution.x,
        renderResolution.y,
        1 / renderResolution.x,
        1 / renderResolution.y,
    );
    renderPixelatedPass.updateTargets(renderResolution);

    // bloomPass.resolution = screenResolution;
    // pixelatePass.resolution = renderResolution;

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const pointer = {x: -1, y: -1};

  const raycaster = new THREE.Raycaster();

  document.addEventListener('pointermove', (event: PointerEvent) => {
    pointer.x = (event.clientX / screenResolution.x) * 2 - 1;
    pointer.y = -(event.clientY / screenResolution.y) * 2 + 1;
  });

  let intersections = 0;

  const stats = Stats();
  stats.showPanel(0);
  document.getElementById('app')!.appendChild(stats.dom);

  function animate(frame: number) {
    requestAnimationFrame(animate);

    stats.begin();

    // dirLight1.position.x = Math.sin(frame / 1000) * 5;
    // dirLight1.position.z = Math.cos(frame / 1000) * 5;

    raycaster.setFromCamera(pointer, camera);
    const intersectObjects = raycaster.intersectObjects(scene.children, false);
    if (intersectObjects.length !== intersections) {
      console.log(intersectObjects.length);
      intersections = intersectObjects.length;
    }

    // renderer.render(scene, camera);
    composer.render();

    stats.end();
  }

  animate(window.performance.now());
};

onMounted(async () => all());
</script>
