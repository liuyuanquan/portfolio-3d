/**
 * 形状对象创建函数
 */
import * as THREE from "three";
import { scene } from "../resources/world";
import { OBJECTS_CONFIG } from "../config";

/**
 * 创建三角形
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 三角形对象
 */
export function createTriangle(options = {}) {
	const triangleConfig = OBJECTS_CONFIG.triangle;
	const { x, z, color = triangleConfig.color } = options;

	var geom = new THREE.Geometry();
	const vertices = triangleConfig.vertices;
	var v1 = new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z);
	var v2 = new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z);
	var v3 = new THREE.Vector3(vertices[2].x, vertices[2].y, vertices[2].z);

	geom.vertices.push(v1);
	geom.vertices.push(v2);
	geom.vertices.push(v3);

	geom.faces.push(new THREE.Face3(0, 1, 2));
	geom.computeFaceNormals();

	var mesh = new THREE.Mesh(
		geom,
		new THREE.MeshBasicMaterial({ color: color })
	);
	mesh.rotation.x = triangleConfig.rotationX;
	mesh.position.y = triangleConfig.positionY;
	mesh.position.x = x;
	mesh.position.z = z;
	scene.add(mesh);

	return mesh;
}

