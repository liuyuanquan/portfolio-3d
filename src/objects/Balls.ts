import * as THREE from "three";
import { scene } from "../core/World";
import { loadTexture } from "../utils/textureLoader";
import { PhysicsEngine } from "../core/PhysicsEngine";

const CONFIG = {
	ball: {
		position: { x: 0, y: 0, z: 0 },
		radius: 2,
		mass: 3,
		quaternion: { x: 0, y: 0, z: 0, w: 1 },
		texture: `${(import.meta.env as any).BASE_URL}img/earth.jpg`,
		friction: 10,
	},
	beachBall: {
		position: { x: 20, y: 30, z: 0 },
		radius: 3,
		mass: 3,
		quaternion: { x: 0, y: 0, z: 0, w: 1 },
		texture: `${(import.meta.env as any).BASE_URL}img/BeachBallColor.jpg`,
		friction: 1,
	},
} as const;

/**
 * 创建主球体（玩家控制的球）
 */
export function createBall(): THREE.Mesh {
	const { position, radius, quaternion, mass, texture, friction } = CONFIG.ball;

	const marbleTexture = loadTexture(texture, {
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		// 各向异性过滤级别，值越大纹理在倾斜角度下越清晰，但性能开销越大
		anisotropy: 1,
		repeat: { x: 1, y: 1 },
	});

	const geometry = new THREE.SphereGeometry(radius, 32, 32);
	const material = new THREE.MeshLambertMaterial({ map: marbleTexture });
	const ball = new THREE.Mesh(geometry, material);

	ball.position.set(position.x, position.y, position.z);
	ball.castShadow = true;
	ball.receiveShadow = true;
	scene.add(ball);

	PhysicsEngine.getInstance().addRigidPhysics(ball, {
		radius,
		mass,
		quat: quaternion,
		rollingFriction: friction,
		margin: 0.05,
	});

	return ball;
}

/**
 * 创建沙滩球
 */
export function createBeachBall(): THREE.Mesh {
	const { position, radius, quaternion, mass, texture, friction } = CONFIG.beachBall;

	const beachTexture = loadTexture(texture, {
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		// 各向异性过滤级别，值越大纹理在倾斜角度下越清晰，但性能开销越大
		anisotropy: 1,
		repeat: { x: 1, y: 1 },
	});

	const geometry = new THREE.SphereGeometry(radius, 32, 32);
	const material = new THREE.MeshLambertMaterial({ map: beachTexture });
	const ball = new THREE.Mesh(geometry, material);

	ball.position.set(position.x, position.y, position.z);
	ball.castShadow = true;
	ball.receiveShadow = true;
	scene.add(ball);

	PhysicsEngine.getInstance().addRigidPhysics(ball, {
		radius,
		mass,
		quat: quaternion,
		rollingFriction: friction,
	});

	return ball;
}
