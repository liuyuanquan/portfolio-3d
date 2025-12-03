/**
 * 形状对象创建函数
 */
import * as THREE from "three";
import { scene } from "../resources/world";

/**
 * 创建三角形
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 三角形对象
 */
export function createTriangle(options = {}) {
	const { x, z, color = 0xffffff } = options;

	var geom = new THREE.Geometry();
	var v1 = new THREE.Vector3(4, 0, 0);
	var v2 = new THREE.Vector3(5, 0, 0);
	var v3 = new THREE.Vector3(4.5, 1, 0);

	geom.vertices.push(v1);
	geom.vertices.push(v2);
	geom.vertices.push(v3);

	geom.faces.push(new THREE.Face3(0, 1, 2));
	geom.computeFaceNormals();

	var mesh = new THREE.Mesh(
		geom,
		new THREE.MeshBasicMaterial({ color: color })
	);
	mesh.rotation.x = -Math.PI * 0.5;
	mesh.position.y = 0.01;
	mesh.position.x = x;
	mesh.position.z = z;
	scene.add(mesh);

	return mesh;
}

