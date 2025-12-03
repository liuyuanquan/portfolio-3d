/**
 * 广告牌对象创建函数
 */
import * as THREE from "three";
import { scene, manager } from "../resources/world";
import { addRigidPhysics } from "./PhysicsHelpers";
import { woodTexture } from "../config/resources";
import { OBJECTS_CONFIG } from "../config";
import { loadTexture } from "../utils/textureLoader";

// 注意：cursorHoverObjects 需要从外部传入，避免循环依赖

/**
 * 创建广告牌
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {Object} 包含 pole 和 sign 的对象
 */
export function createBillboard(Ammo, physicsEngine, options = {}) {
	const billboardConfig = OBJECTS_CONFIG.billboard.horizontal;
	const {
		x,
		y,
		z,
		textureImage,
		urlLink,
		rotation = 0,
		poleScale = billboardConfig.poleScale,
		signScale = billboardConfig.signScale,
	} = options;

	const loader = new THREE.TextureLoader(manager);

	const billboardPole = new THREE.Mesh(
		new THREE.BoxBufferGeometry(poleScale.x, poleScale.y, poleScale.z),
		new THREE.MeshStandardMaterial({
			map: loadTexture(loader, woodTexture),
		})
	);

	const texture = loadTexture(loader, textureImage);
	texture.encoding = THREE.sRGBEncoding;
	var borderMaterial = new THREE.MeshBasicMaterial({
		color: 0x000000,
	});
	const loadedTexture = new THREE.MeshBasicMaterial({
		map: texture,
	});

	var materials = [
		borderMaterial, // Left side
		borderMaterial, // Right side
		borderMaterial, // Top side   ---> THIS IS THE FRONT
		borderMaterial, // Bottom side --> THIS IS THE BACK
		loadedTexture, // Front side
		borderMaterial, // Back side
	];

	const billboardSign = new THREE.Mesh(
		new THREE.BoxGeometry(signScale.x, signScale.y, signScale.z),
		materials
	);

	billboardPole.position.x = x;
	billboardPole.position.y = y;
	billboardPole.position.z = z;

	billboardSign.position.x = x;
	billboardSign.position.y = y + billboardConfig.signOffsetY;
	billboardSign.position.z = z;

	/* Rotate Billboard */
	billboardPole.rotation.y = rotation;
	billboardSign.rotation.y = rotation;

	billboardPole.castShadow = true;
	billboardPole.receiveShadow = true;

	billboardSign.castShadow = true;
	billboardSign.receiveShadow = true;

	billboardSign.userData = { URL: urlLink };

	scene.add(billboardPole);
	scene.add(billboardSign);
	addRigidPhysics(Ammo, physicsEngine, billboardPole, poleScale);

	// cursorHoverObjects 需要从外部传入
	// cursorHoverObjects.push(billboardSign);

	return { pole: billboardPole, sign: billboardSign };
}

/**
 * 创建垂直广告牌
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {Object} 包含 pole 和 sign 的对象
 */
export function createBillboardRotated(Ammo, physicsEngine, options = {}) {
	const billboardConfig = OBJECTS_CONFIG.billboard.vertical;
	const {
		x,
		y,
		z,
		textureImage,
		urlLink,
		rotation = 0,
		poleScale = billboardConfig.poleScale,
		signScale = billboardConfig.signScale,
	} = options;

	const loader = new THREE.TextureLoader(manager);
	const billboardPole = new THREE.Mesh(
		new THREE.BoxBufferGeometry(poleScale.x, poleScale.y, poleScale.z),
		new THREE.MeshStandardMaterial({
			map: loadTexture(loader, woodTexture),
		})
	);
	const texture = loadTexture(loader, textureImage);
	texture.encoding = THREE.sRGBEncoding;
	var borderMaterial = new THREE.MeshBasicMaterial({
		color: 0x000000,
	});
	const loadedTexture = new THREE.MeshBasicMaterial({
		map: texture,
	});

	var materials = [
		borderMaterial, // Left side
		borderMaterial, // Right side
		borderMaterial, // Top side   ---> THIS IS THE FRONT
		borderMaterial, // Bottom side --> THIS IS THE BACK
		loadedTexture, // Front side
		borderMaterial, // Back side
	];

	const billboardSign = new THREE.Mesh(
		new THREE.BoxGeometry(signScale.x, signScale.y, signScale.z),
		materials
	);

	billboardPole.position.x = x;
	billboardPole.position.y = y;
	billboardPole.position.z = z;

	billboardSign.position.x = x;
	billboardSign.position.y = y + billboardConfig.signOffsetY;
	billboardSign.position.z = z;

	/* Rotate Billboard */
	billboardPole.rotation.y = rotation;
	billboardSign.rotation.y = rotation;

	billboardPole.castShadow = true;
	billboardPole.receiveShadow = true;

	billboardSign.castShadow = true;
	billboardSign.receiveShadow = true;

	billboardSign.userData = { URL: urlLink };

	scene.add(billboardPole);
	scene.add(billboardSign);
	addRigidPhysics(Ammo, physicsEngine, billboardPole, poleScale);
	addRigidPhysics(Ammo, physicsEngine, billboardSign, signScale);

	// cursorHoverObjects 需要从外部传入
	// cursorHoverObjects.push(billboardSign);

	return { pole: billboardPole, sign: billboardSign };
}
