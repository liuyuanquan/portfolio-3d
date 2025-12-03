/**
 * 平面对象创建函数
 */
import * as THREE from "three";
import { scene, manager } from "../resources/world";
import { PhysicsEngine } from "../core/PhysicsEngine";
import { addRigidPhysics } from "./PhysicsHelpers";
import { OBJECTS_CONFIG, PHYSICS_CONFIG } from "../config";

/**
 * 创建网格平面
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 平面对象
 */
export function createGridPlane(Ammo, physicsEngine, options = {}) {
	const planeConfig = OBJECTS_CONFIG.plane;
	const {
		pos = planeConfig.position,
		scale = planeConfig.scale,
		quat = planeConfig.quaternion,
		mass = planeConfig.mass,
		size = planeConfig.size,
		divisions = planeConfig.divisions,
	} = options;

	// 创建网格覆盖层
	const gridConfig = planeConfig.grid;
	var grid = new THREE.GridHelper(size, divisions, gridConfig.color1, gridConfig.color2);
	grid.material.opacity = gridConfig.opacity;
	grid.material.transparent = true;
	grid.position.y = gridConfig.positionY;
	scene.add(grid);

	// 创建 Three.js 平面
	const materialConfig = planeConfig.material;
	let blockPlane = new THREE.Mesh(
		new THREE.BoxBufferGeometry(),
		new THREE.MeshPhongMaterial({
			color: materialConfig.color,
			transparent: materialConfig.transparent,
			opacity: materialConfig.opacity,
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
	colShape.setMargin(PHYSICS_CONFIG.collisionMargin);

	let localInertia = new Ammo.btVector3(0, 0, 0);
	colShape.calculateLocalInertia(mass, localInertia);

	let rigidBodyStruct = new Ammo.btRigidBodyConstructionInfo(
		mass,
		motionState,
		colShape,
		localInertia
	);
	let body = new Ammo.btRigidBody(rigidBodyStruct);
	body.setFriction(PHYSICS_CONFIG.friction.plane);
	body.setRollingFriction(PHYSICS_CONFIG.friction.rolling);

	// 添加到物理世界
	physicsEngine.addRigidBody(blockPlane, body);

	return blockPlane;
}

