/**
 * 盒子对象创建函数
 */
import * as THREE from "three";
import { scene } from "../resources/world";
import { addRigidPhysics } from "./PhysicsHelpers";
import { OBJECTS_CONFIG } from "../config";
import { loadTexture } from "../utils/textureLoader";

// 注意：cursorHoverObjects 需要从外部传入，避免循环依赖

/**
 * 创建链接盒子
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 盒子对象
 */
export function createBox(Ammo, physicsEngine, options = {}) {
	const { x, y, z, scaleX, scaleY, scaleZ, boxTexture, URLLink, color = 0x000000, transparent = true } = options;

	const boxScale = { x: scaleX, y: scaleY, z: scaleZ };
	let quat = { x: 0, y: 0, z: 0, w: 1 };
	const boxConfig = OBJECTS_CONFIG.box;
	let mass = 0; // 质量为 0 表示静态物体

	// 加载链接 logo
	const texture = loadTexture(boxTexture);
	const loadedTexture = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: transparent,
		color: 0xffffff,
	});

	var borderMaterial = new THREE.MeshBasicMaterial({
		color: color !== undefined ? color : boxConfig.defaultColor,
	});
	borderMaterial.color.convertSRGBToLinear();

	var materials = [
		borderMaterial, // Left side
		borderMaterial, // Right side
		borderMaterial, // Top side   ---> THIS IS THE FRONT
		borderMaterial, // Bottom side --> THIS IS THE BACK
		loadedTexture, // Front side
		borderMaterial, // Back side
	];

	const linkBox = new THREE.Mesh(new THREE.BoxBufferGeometry(boxScale.x, boxScale.y, boxScale.z), materials);
	linkBox.position.set(x, y, z);
	linkBox.renderOrder = 1;
	linkBox.castShadow = true;
	linkBox.receiveShadow = true;
	linkBox.userData = { URL: URLLink, email: URLLink };
	scene.add(linkBox);

	addRigidPhysics(linkBox, { scale: boxScale });

	// cursorHoverObjects 需要从外部传入
	// cursorHoverObjects.push(linkBox);

	return linkBox;
}

/**
 * 创建 Floyd 文字盒子（"Software Engineer" 背景）
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 盒子对象
 */
export function floydWords(Ammo, physicsEngine, options = {}) {
	const { x, y, z, scale = { x: 37, y: 3, z: 2 }, color = 0xff6600 } = options;

	const linkBox = new THREE.Mesh(
		new THREE.BoxBufferGeometry(scale.x, scale.y, scale.z),
		new THREE.MeshPhongMaterial({
			color: color,
		})
	);

	linkBox.position.set(x, y, z);
	linkBox.castShadow = true;
	linkBox.receiveShadow = true;

	addRigidPhysics(linkBox, { scale });

	return linkBox;
}
