/**
 * 球体对象创建函数
 */
import * as THREE from "three";
import { scene } from "../resources/world";
import { OBJECTS_CONFIG, PHYSICS_CONFIG } from "../config";
import { loadTexture } from "../utils/textureLoader";
import { addRigidPhysics } from "./PhysicsHelpers";

/**
 * 创建主球体（玩家控制的球）
 * @returns 球体网格对象
 */
export function createBall(): THREE.Mesh {
	const ballConfig = OBJECTS_CONFIG.ball;
	const pos = ballConfig.position;
	const radius = ballConfig.radius;
	const quat = ballConfig.quaternion;
	const mass = ballConfig.mass;
	const texturePath = ballConfig.texture;

	// ==================== Three.js 球体 ====================
	const marbleTexture = loadTexture(texturePath, {
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		anisotropy: 1,
		repeat: { x: 1, y: 1 },
	});

	const geometry = new THREE.SphereGeometry(radius, 32, 32);
	const material = new THREE.MeshLambertMaterial({ map: marbleTexture });
	const ball = new THREE.Mesh(geometry, material);

	ball.position.set(pos.x, pos.y, pos.z);
	ball.castShadow = true;
	ball.receiveShadow = true;
	scene.add(ball);

	// ==================== Ammo.js 物理 ====================
	addRigidPhysics(ball, {
		radius,
		mass,
		quat,
		rollingFriction: PHYSICS_CONFIG.friction.ball,
		margin: 0.05,
	});

	return ball;
}

/**
 * 创建沙滩球
 * @returns 沙滩球网格对象
 */
export function createBeachBall(): THREE.Mesh {
	const beachBallConfig = OBJECTS_CONFIG.beachBall;
	const pos = beachBallConfig.position;
	const radius = beachBallConfig.radius;
	const quat = beachBallConfig.quaternion;
	const mass = beachBallConfig.mass;
	const texturePath = beachBallConfig.texture;

	// ==================== Three.js 球体 ====================
	const beachTexture = loadTexture(texturePath, {
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		anisotropy: 1,
		repeat: { x: 1, y: 1 },
	});

	const geometry = new THREE.SphereGeometry(radius, 32, 32);
	const material = new THREE.MeshLambertMaterial({ map: beachTexture });
	const ball = new THREE.Mesh(geometry, material);

	ball.position.set(pos.x, pos.y, pos.z);
	ball.castShadow = true;
	ball.receiveShadow = true;
	scene.add(ball);

	// ==================== Ammo.js 物理 ====================
	addRigidPhysics(ball, {
		radius,
		mass,
		quat,
		rollingFriction: PHYSICS_CONFIG.friction.beachBall,
	});

	return ball;
}
