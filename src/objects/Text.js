/**
 * 3D 文字对象创建函数
 */
import * as THREE from "three";
import { scene, manager } from "../resources/world";
import { OBJECTS_CONFIG } from "../config";

const BASE_URL = import.meta.env.BASE_URL;

/**
 * 加载 Floyd 文字（"0xFloyd"）
 * @param {Object} options - 配置选项
 * @returns {Promise<THREE.Mesh>} 文字对象
 */
export function loadFloydText(options = {}) {
	const floydConfig = OBJECTS_CONFIG.text.floyd;
	const {
		text = floydConfig.text,
		color = floydConfig.color,
		size = floydConfig.size,
		height = floydConfig.height,
		position = floydConfig.position,
	} = options;

	return new Promise((resolve) => {
		var text_loader = new THREE.FontLoader();

		text_loader.load(`${BASE_URL}json/Roboto_Regular.json`, function (font) {
			var xMid, textMesh;

			var textMaterials = [
				new THREE.MeshBasicMaterial({ color: color }), // front
				new THREE.MeshPhongMaterial({ color: color }), // side
			];

			const geometryConfig = floydConfig.geometry;
			var geometry = new THREE.TextGeometry(text, {
				font: font,
				size: size,
				height: height,
				curveSegments: geometryConfig.curveSegments,
				bevelEnabled: geometryConfig.bevelEnabled,
				bevelThickness: geometryConfig.bevelThickness,
				bevelSize: geometryConfig.bevelSize,
				bevelOffset: geometryConfig.bevelOffset,
				bevelSegments: geometryConfig.bevelSegments,
			});

			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			xMid =
				floydConfig.translateX *
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
	const engineerConfig = OBJECTS_CONFIG.text.engineer;
	const {
		text = engineerConfig.text,
		color = engineerConfig.color,
		size = engineerConfig.size,
		height = engineerConfig.height,
		position = engineerConfig.position,
	} = options;

	return new Promise((resolve) => {
		var text_loader = new THREE.FontLoader();

		const fontPath = OBJECTS_CONFIG.text.font;
		text_loader.load(`${BASE_URL}${fontPath}`, function (font) {
			var xMid, textMesh;

			var textMaterials = [
				new THREE.MeshBasicMaterial({ color: color }), // front
				new THREE.MeshPhongMaterial({ color: color }), // side
			];

			const geometryConfig = engineerConfig.geometry;
			var geometry = new THREE.TextGeometry(text, {
				font: font,
				size: size,
				height: height,
				curveSegments: geometryConfig.curveSegments,
				bevelEnabled: geometryConfig.bevelEnabled,
				bevelThickness: geometryConfig.bevelThickness,
				bevelSize: geometryConfig.bevelSize,
			});

			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			xMid =
				engineerConfig.translateX *
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

