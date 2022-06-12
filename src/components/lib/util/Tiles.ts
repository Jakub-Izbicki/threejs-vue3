import * as THREE from "three"
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Font} from "three/examples/jsm/loaders/FontLoader";
import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils";
import {BoxGeometry} from "three";

export function createCubeTileGeometry(tileX: number, tileZ: number): THREE.BoxGeometry {
  const cube = new THREE.BoxGeometry();

  cube.translate(tileX, 1, tileZ);

  return cube;
}

export function createCubeTileAt(tileX: number, tileZ: number, scene: THREE.Scene, camera: THREE.OrthographicCamera,
                                 renderer: THREE.WebGLRenderer, font: Font): THREE.Mesh {
  const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshToonMaterial({color: 0x325ea8}));

  cube.position.x = tileX;
  cube.position.y = 1;
  cube.position.z = tileZ;

  cube.scale.x = 0.9;
  cube.scale.y = 0.9;
  cube.scale.z = 0.9;

  cube.castShadow = true;
  cube.receiveShadow = true;

  scene.add(cube);

  // mergeBufferGeometries([new BoxGeometry(0, 0, 0), cube.geometry])

  // const textGeometry = new TextGeometry(`${tileX}:${tileZ}`, {font: font, size: 0.4, height:0.001});
  // textGeometry.computeBoundingBox();
  //
  // const positionText = new THREE.Mesh(textGeometry, new THREE.MeshPhongMaterial({color: 0xffffff}));
  // cube.add(positionText);
  // positionText.position.x = -0.3;
  // positionText.position.y = 0.6;
  // positionText.rotation.x = Math.PI / 2 * -1

  return cube;
}
