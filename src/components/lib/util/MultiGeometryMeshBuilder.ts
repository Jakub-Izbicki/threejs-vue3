import * as THREE from "three"
import {mergeBufferGeometries} from "three/examples/jsm/utils/BufferGeometryUtils";

export default class MultiGeometryMeshBuilder {

  private geometries: THREE.BufferGeometry[] = [];

  private material: THREE.Material;

  constructor(material: THREE.Material) {
    this.material = material;
  }

  public addGeometry(geometry: THREE.BufferGeometry): void {
    this.geometries.push(geometry);
  }

  public build(): THREE.Mesh {
    if (this.geometries.length === 0) {
      throw new Error('Cannot build multi geometry mesh if no geometries have been added');
    }

    const mergedGeometries = mergeBufferGeometries(
        [new THREE.BoxGeometry(0, 0, 0),
          ...this.geometries]);

    const mesh = new THREE.Mesh(mergedGeometries, this.material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }
}
