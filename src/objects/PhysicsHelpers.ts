import * as THREE from "three";
import { PhysicsEngine } from "../core/PhysicsEngine";
import { PHYSICS_CONFIG } from "../config";

/**
 * 为 Three.js 对象添加刚体物理
 * @param item - Three.js 对象
 * @param options - 配置选项
 * @returns void
 */
export function addRigidPhysics(item: THREE.Object3D, options: AddRigidPhysicsOptions): void {
	const physicsEngine = PhysicsEngine.getInstance();
	const Ammo = physicsEngine.getAmmo();
	const {
		scale,
		radius,
		mass = PHYSICS_CONFIG.defaultMass.static,
		quat = { x: 0, y: 0, z: 0, w: 1 },
		rollingFriction,
		friction,
		margin = PHYSICS_CONFIG.collisionMargin,
	} = options;
	const pos = {
		x: item.position.x,
		y: item.position.y,
		z: item.position.z,
	};

	// ==================== Ammo.js 物理 ====================
	// 创建变换对象和运动状态
	const transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
	transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
	const motionState = new Ammo.btDefaultMotionState(transform);

	// 创建碰撞形状
	let colShape: any;
	if (radius !== undefined) {
		// 球体形状
		colShape = new Ammo.btSphereShape(radius);
	} else if (scale) {
		// 盒子形状
		colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
	} else {
		throw new Error("addRigidPhysics: 必须提供 scale 或 radius");
	}
	colShape.setMargin(margin);

	// 计算局部惯性
	const localInertia = new Ammo.btVector3(0, 0, 0);
	colShape.calculateLocalInertia(mass, localInertia);

	// 创建刚体
	const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
	const body = new Ammo.btRigidBody(rbInfo);

	if (mass > 0) {
		// 动态物体：禁用失活状态
		body.setActivationState(physicsEngine.STATE.DISABLE_DEACTIVATION);
	} else {
		// 静态物体：设置静态标志和禁用失活状态
		body.setActivationState(physicsEngine.STATE.DISABLE_DEACTIVATION);
		body.setCollisionFlags(PHYSICS_CONFIG.collisionFlags.static);
	}

	// 设置摩擦系数（如果提供）
	if (friction !== undefined) {
		body.setFriction(friction);
	}

	// 设置滚动摩擦系数（如果提供）
	if (rollingFriction !== undefined) {
		body.setRollingFriction(rollingFriction);
	}

	// 添加到物理世界
	item.userData.physicsBody = body;
	physicsEngine.addRigidBody(item, body);
}
