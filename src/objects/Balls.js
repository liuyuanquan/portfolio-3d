/**
 * 球体对象创建函数
 */
import * as THREE from "three";
import { scene, manager } from "../resources/world";
import { PhysicsEngine } from "../core/PhysicsEngine";

const BASE_URL = import.meta.env.BASE_URL;

/**
 * 创建主球体（玩家控制的球）
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 球体对象
 */
export function createBall(Ammo, physicsEngine, options = {}) {
	const {
		pos = { x: 8.75, y: 0, z: 0 },
		radius = 2,
		quat = { x: 0, y: 0, z: 0, w: 1 },
		mass = 3,
		texturePath = `${BASE_URL}img/earth.jpg`,
	} = options;

	var marble_loader = new THREE.TextureLoader(manager);
	var marbleTexture = marble_loader.load(texturePath);
	marbleTexture.wrapS = marbleTexture.wrapT = THREE.RepeatWrapping;
	marbleTexture.repeat.set(1, 1);
	marbleTexture.anisotropy = 1;
	marbleTexture.encoding = THREE.sRGBEncoding;

	// Three.js Section
	let ball = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshLambertMaterial({ map: marbleTexture })
	);

	ball.geometry.computeBoundingSphere();
	ball.geometry.computeBoundingBox();

	ball.position.set(pos.x, pos.y, pos.z);

	ball.castShadow = true;
	ball.receiveShadow = true;

	scene.add(ball);

	// Ammo.js Section
	let transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
	transform.setRotation(
		new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
	);
	let motionState = new Ammo.btDefaultMotionState(transform);

	let colShape = new Ammo.btSphereShape(radius);
	colShape.setMargin(0.05);

	let localInertia = new Ammo.btVector3(0, 0, 0);
	colShape.calculateLocalInertia(mass, localInertia);

	let rbInfo = new Ammo.btRigidBodyConstructionInfo(
		mass,
		motionState,
		colShape,
		localInertia
	);
	let body = new Ammo.btRigidBody(rbInfo);
	body.setRollingFriction(10);

	// 禁用失活状态，保持动态交互
	body.setActivationState(physicsEngine.STATE.DISABLE_DEACTIVATION);

	physicsEngine.addRigidBody(ball, body);
	ball.userData.physicsBody = body;

	return ball;
}

/**
 * 创建沙滩球
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 沙滩球对象
 */
export function createBeachBall(Ammo, physicsEngine, options = {}) {
	const {
		pos = { x: 20, y: 30, z: 0 },
		radius = 2,
		quat = { x: 0, y: 0, z: 0, w: 1 },
		mass = 20,
		texturePath = `${BASE_URL}img/BeachBallColor.jpg`,
	} = options;

	var texture_loader = new THREE.TextureLoader(manager);
	var beachTexture = texture_loader.load(texturePath);
	beachTexture.wrapS = beachTexture.wrapT = THREE.RepeatWrapping;
	beachTexture.repeat.set(1, 1);
	beachTexture.anisotropy = 1;
	beachTexture.encoding = THREE.sRGBEncoding;

	// Three.js Section
	let ball = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshLambertMaterial({ map: beachTexture })
	);

	ball.position.set(pos.x, pos.y, pos.z);
	ball.castShadow = true;
	ball.receiveShadow = true;
	scene.add(ball);

	// Ammo.js Section
	let transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
	transform.setRotation(
		new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
	);
	let motionState = new Ammo.btDefaultMotionState(transform);

	let colShape = new Ammo.btSphereShape(radius);
	colShape.setMargin(0.05);

	let localInertia = new Ammo.btVector3(0, 0, 0);
	colShape.calculateLocalInertia(mass, localInertia);

	let rbInfo = new Ammo.btRigidBodyConstructionInfo(
		mass,
		motionState,
		colShape,
		localInertia
	);
	let body = new Ammo.btRigidBody(rbInfo);

	body.setRollingFriction(1);
	physicsEngine.addRigidBody(ball, body);

	return ball;
}

