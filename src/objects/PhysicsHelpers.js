/**
 * 物理辅助函数
 */
import * as THREE from "three";
import { scene } from "../resources/world";
import { PhysicsEngine } from "../core/PhysicsEngine";

/**
 * 为 Three.js 对象添加刚体物理
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {THREE.Object3D} item - Three.js 对象
 * @param {Object} itemScale - 对象缩放 {x, y, z}
 */
export function addRigidPhysics(Ammo, physicsEngine, item, itemScale) {
	let pos = {
		x: item.position.x,
		y: item.position.y,
		z: item.position.z,
	};
	let scale = { x: itemScale.x, y: itemScale.y, z: itemScale.z };
	let quat = { x: 0, y: 0, z: 0, w: 1 };
	let mass = 0; // 质量为 0 表示静态物体

	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
	transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

	var localInertia = new Ammo.btVector3(0, 0, 0);
	var motionState = new Ammo.btDefaultMotionState(transform);
	let colShape = new Ammo.btBoxShape(
		new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
	);
	colShape.setMargin(0.05);
	colShape.calculateLocalInertia(mass, localInertia);
	let rbInfo = new Ammo.btRigidBodyConstructionInfo(
		mass,
		motionState,
		colShape,
		localInertia
	);
	let body = new Ammo.btRigidBody(rbInfo);
	body.setActivationState(physicsEngine.STATE.DISABLE_DEACTIVATION);
	body.setCollisionFlags(2); // 静态物体标志
	physicsEngine.addRigidBody(item, body);
}
