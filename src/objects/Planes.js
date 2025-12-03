/**
 * 平面对象创建函数
 */
import * as THREE from "three";
import { scene, manager } from "../resources/world";
import { PhysicsEngine } from "../core/PhysicsEngine";
import { addRigidPhysics } from "./PhysicsHelpers";

/**
 * 创建网格平面
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 平面对象
 */
export function createGridPlane(Ammo, physicsEngine, options = {}) {
	const {
		pos = { x: 0, y: -0.25, z: 0 },
		scale = { x: 175, y: 0.5, z: 175 },
		quat = { x: 0, y: 0, z: 0, w: 1 },
		mass = 0, // 质量为 0 表示静态物体
		size = 175,
		divisions = 20,
	} = options;

	// 创建网格覆盖层
	var grid = new THREE.GridHelper(size, divisions, 0xffffff, 0xffffff);
	grid.material.opacity = 0.5;
	grid.material.transparent = true;
	grid.position.y = 0.005;
	scene.add(grid);

	// 创建 Three.js 平面
	let blockPlane = new THREE.Mesh(
		new THREE.BoxBufferGeometry(),
		new THREE.MeshPhongMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.25,
		})
	);
	blockPlane.position.set(pos.x, pos.y, pos.z);
	blockPlane.scale.set(scale.x, scale.y, scale.z);
	blockPlane.receiveShadow = true;
	scene.add(blockPlane);

	// Ammo.js 物理
	let transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
	transform.setRotation(
		new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
	);
	let motionState = new Ammo.btDefaultMotionState(transform);

	// 设置碰撞盒
	let colShape = new Ammo.btBoxShape(
		new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
	);
	colShape.setMargin(0.05);

	let localInertia = new Ammo.btVector3(0, 0, 0);
	colShape.calculateLocalInertia(mass, localInertia);

	let rigidBodyStruct = new Ammo.btRigidBodyConstructionInfo(
		mass,
		motionState,
		colShape,
		localInertia
	);
	let body = new Ammo.btRigidBody(rigidBodyStruct);
	body.setFriction(10);
	body.setRollingFriction(10);

	// 添加到物理世界
	physicsEngine.addRigidBody(blockPlane, body);

	return blockPlane;
}

