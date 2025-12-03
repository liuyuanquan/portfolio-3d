/**
 * 3D 文字对象创建函数
 */
import * as THREE from "three";
import { scene, manager } from "../resources/world";

const BASE_URL = import.meta.env.BASE_URL;

/**
 * 加载 Floyd 文字（"0xFloyd"）
 * @param {Object} options - 配置选项
 * @returns {Promise<THREE.Mesh>} 文字对象
 */
export function loadFloydText(options = {}) {
	const {
		text = "0xFloyd",
		color = 0xfffc00,
		size = 3,
		height = 0.5,
		position = { x: 0, y: 0.1, z: -20 },
	} = options;

	return new Promise((resolve) => {
		var text_loader = new THREE.FontLoader();

		text_loader.load(`${BASE_URL}json/Roboto_Regular.json`, function (font) {
			var xMid, textMesh;

			var textMaterials = [
				new THREE.MeshBasicMaterial({ color: color }), // front
				new THREE.MeshPhongMaterial({ color: color }), // side
			];

			var geometry = new THREE.TextGeometry(text, {
				font: font,
				size: size,
				height: height,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.1,
				bevelSize: 0.11,
				bevelOffset: 0,
				bevelSegments: 1,
			});

			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			xMid =
				-0.15 *
				(geometry.boundingBox.max.x - geometry.boundingBox.min.x);

			geometry.translate(xMid, 0, 0);

			var textGeo = new THREE.BufferGeometry().fromGeometry(geometry);

			textMesh = new THREE.Mesh(geometry, textMaterials);
			textMesh.position.z = position.z;
			textMesh.position.y = position.y;
			textMesh.position.x = position.x;
			textMesh.receiveShadow = true;
			textMesh.castShadow = true;
			scene.add(textMesh);

			resolve(textMesh);
		});
	});
}

/**
 * 加载工程师文字（"SOFTWARE ENGINEER"）
 * @param {Object} options - 配置选项
 * @returns {Promise<THREE.Mesh>} 文字对象
 */
export function loadEngineerText(options = {}) {
	const {
		text = "SOFTWARE ENGINEER",
		color = 0x00ff08,
		size = 1.5,
		height = 0.5,
		position = { x: 24, y: 0.1, z: -20 },
	} = options;

	return new Promise((resolve) => {
		var text_loader = new THREE.FontLoader();

		text_loader.load(`${BASE_URL}json/Roboto_Regular.json`, function (font) {
			var xMid, textMesh;

			var textMaterials = [
				new THREE.MeshBasicMaterial({ color: color }), // front
				new THREE.MeshPhongMaterial({ color: color }), // side
			];

			var geometry = new THREE.TextGeometry(text, {
				font: font,
				size: size,
				height: height,
				curveSegments: 20,
				bevelEnabled: true,
				bevelThickness: 0.25,
				bevelSize: 0.1,
			});

			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			xMid =
				-0.5 *
				(geometry.boundingBox.max.x - geometry.boundingBox.min.x);

			geometry.translate(xMid, 0, 0);

			var textGeo = new THREE.BufferGeometry().fromGeometry(geometry);

			textMesh = new THREE.Mesh(textGeo, textMaterials);
			textMesh.position.z = position.z;
			textMesh.position.y = position.y;
			textMesh.position.x = position.x;
			textMesh.receiveShadow = true;
			textMesh.castShadow = true;
			scene.add(textMesh);

			resolve(textMesh);
		});
	});
}

