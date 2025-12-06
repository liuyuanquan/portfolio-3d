import * as THREE from "three";
import { scene } from "../resources/world";
import { loadTexture } from "../utils/textureLoader";
import { addRigidPhysics } from "./PhysicsHelpers";

/**
 * 球体配置常量
 */
const BALL_CONFIG = {
	/** 主球体配置 */
	ball: {
		position: { x: 8.75, y: 0, z: 0 },
		radius: 2,
		mass: 3,
		quaternion: { x: 0, y: 0, z: 0, w: 1 },
		texture: `${(import.meta.env as any).BASE_URL}img/earth.jpg`,
		rollingFriction: 10,
	},
	/** 沙滩球配置 */
	beachBall: {
		position: { x: 20, y: 30, z: 0 },
		radius: 3,
		mass: 3,
		quaternion: { x: 0, y: 0, z: 0, w: 1 },
		texture: `${(import.meta.env as any).BASE_URL}img/BeachBallColor.jpg`,
		rollingFriction: 1,
	},
} as const;

/**
 * 创建主球体（玩家控制的球）
 *
 * 该函数用于创建玩家控制的球体对象，这是游戏中的主要交互对象。
 * 球体使用 SphereGeometry 创建，具有完整的物理属性，可以在场景中滚动和碰撞。
 *
 * 视觉属性：
 * - 使用地球纹理（earth.jpg）作为表面材质
 * - 材质设置为 MeshLambertMaterial，可以很好地响应光照
 * - 纹理使用重复包裹模式，确保纹理完整覆盖球面
 * - 球体可以投射和接收阴影，增强场景真实感
 *
 * 物理属性：
 * - 质量为 20，属于动态物体，会受到重力和碰撞影响
 * - 碰撞形状为球体（Sphere），半径与视觉半径完全一致
 * - 滚动摩擦系数为 10，影响球体滚动时的阻力
 * - 旋转四元数用于控制球体的初始朝向
 * - 碰撞边距为 0.05，用于防止物体之间发生穿透
 *
 * @returns THREE.Mesh - 创建的球体网格对象，已添加到场景中并配置了物理属性
 */
export function createBall(): THREE.Mesh {
	const { position, radius, quaternion, mass, texture, rollingFriction } = BALL_CONFIG.ball;

	// ==================== Three.js 球体创建 ====================
	const marbleTexture = loadTexture(texture, {
		// wrapS 和 wrapT: 纹理包裹模式，RepeatWrapping 表示纹理在 S 和 T 方向上重复
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		// anisotropy: 各向异性过滤级别
		// 设置为 1 表示使用基本的过滤，不进行各向异性优化
		// 更高的值可以提高纹理在倾斜角度下的清晰度，但会增加性能开销
		anisotropy: 1,
		// repeat: 纹理重复次数
		// {x: 1, y: 1} 表示在 X 和 Y 方向上各重复 1 次
		// 这意味着纹理会完整地显示一次，不会重复
		repeat: { x: 1, y: 1 },
	});

	// 创建球体几何体和材质
	const geometry = new THREE.SphereGeometry(radius, 32, 32);
	const material = new THREE.MeshLambertMaterial({ map: marbleTexture });
	const ball = new THREE.Mesh(geometry, material);

	// 设置位置和阴影属性
	ball.position.set(position.x, position.y, position.z);
	ball.castShadow = true;
	ball.receiveShadow = true;
	scene.add(ball);

	// ==================== Ammo.js 物理配置 ====================
	addRigidPhysics(ball, {
		radius,
		mass,
		quat: quaternion,
		rollingFriction,
		margin: 0.05,
	});

	return ball;
}

/**
 * 创建沙滩球
 *
 * 该函数用于创建沙滩球对象，这是一个装饰性的动态物体。
 * 沙滩球与主球体类似，但具有不同的物理属性（质量更大）和纹理（沙滩球纹理）。
 *
 * 视觉属性：
 * - 使用沙滩球纹理（BeachBallColor.jpg）作为表面材质
 * - 材质设置为 MeshLambertMaterial，可以很好地响应光照
 * - 纹理使用重复包裹模式，确保纹理完整覆盖球面
 * - 球体可以投射和接收阴影，增强场景真实感
 *
 * 物理属性：
 * - 质量为 20，比主球体重得多，惯性更大
 * - 碰撞形状为球体（Sphere），半径与视觉半径完全一致
 * - 滚动摩擦系数为 1，比主球体小，滚动时阻力更小
 * - 旋转四元数用于控制沙滩球的初始朝向
 * - 使用默认碰撞边距（由物理引擎自动处理）
 *
 * @returns THREE.Mesh - 创建的沙滩球网格对象，已添加到场景中并配置了物理属性
 */
export function createBeachBall(): THREE.Mesh {
	const { position, radius, quaternion, mass, texture, rollingFriction } = BALL_CONFIG.beachBall;

	// ==================== Three.js 球体创建 ====================
	const beachTexture = loadTexture(texture, {
		// wrapS 和 wrapT: 纹理包裹模式，RepeatWrapping 表示纹理在 S 和 T 方向上重复
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		// anisotropy: 各向异性过滤级别
		// 设置为 1 表示使用基本的过滤，不进行各向异性优化
		// 更高的值可以提高纹理在倾斜角度下的清晰度，但会增加性能开销
		anisotropy: 1,
		// repeat: 纹理重复次数
		// {x: 1, y: 1} 表示在 X 和 Y 方向上各重复 1 次
		// 这意味着纹理会完整地显示一次，不会重复
		repeat: { x: 1, y: 1 },
	});

	// 创建球体几何体和材质
	const geometry = new THREE.SphereGeometry(radius, 32, 32);
	const material = new THREE.MeshLambertMaterial({ map: beachTexture });
	const ball = new THREE.Mesh(geometry, material);

	// 设置位置和阴影属性
	ball.position.set(position.x, position.y, position.z);
	ball.castShadow = true;
	ball.receiveShadow = true;
	scene.add(ball);

	// ==================== Ammo.js 物理配置 ====================
	addRigidPhysics(ball, {
		radius,
		mass,
		quat: quaternion,
		rollingFriction,
	});

	return ball;
}
