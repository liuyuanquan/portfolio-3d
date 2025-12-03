/**
 * 墙壁对象创建函数
 */
import * as THREE from "three";
import { scene, manager } from "../resources/world";
import { PhysicsEngine } from "../core/PhysicsEngine";
import { addRigidPhysics } from "./PhysicsHelpers";
import { stoneTexture } from "../resources/textures";
import { OBJECTS_CONFIG, PHYSICS_CONFIG } from "../config";
import { loadTexture } from "../utils/textureLoader";

/**
 * 创建 X 轴方向的墙壁
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 墙壁对象
 */
export function createWallX(Ammo, physicsEngine, options = {}) {
	const wallConfig = OBJECTS_CONFIG.wall.x;
	const {
		x,
		y,
		z,
		wallScale = wallConfig.scale,
	} = options;

	const wall = new THREE.Mesh(
		new THREE.BoxBufferGeometry(wallScale.x, wallScale.y, wallScale.z),
		new THREE.MeshStandardMaterial({
			color: wallConfig.material.color,
			opacity: wallConfig.material.opacity,
			transparent: wallConfig.material.transparent,
		})
	);

	wall.position.x = x;
	wall.position.y = y;
	wall.position.z = z;

	wall.receiveShadow = true;

	scene.add(wall);

	addRigidPhysics(Ammo, physicsEngine, wall, wallScale);

	return wall;
}

/**
 * 创建 Z 轴方向的墙壁
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 墙壁对象
 */
export function createWallZ(Ammo, physicsEngine, options = {}) {
	const wallConfig = OBJECTS_CONFIG.wall.z;
	const {
		x,
		y,
		z,
		wallScale = wallConfig.scale,
	} = options;

	const wall = new THREE.Mesh(
		new THREE.BoxBufferGeometry(wallScale.x, wallScale.y, wallScale.z),
		new THREE.MeshStandardMaterial({
			color: wallConfig.material.color,
			opacity: wallConfig.material.opacity,
			transparent: wallConfig.material.transparent,
		})
	);

	wall.position.x = x;
	wall.position.y = y;
	wall.position.z = z;

	wall.receiveShadow = true;

	scene.add(wall);

	addRigidPhysics(Ammo, physicsEngine, wall, wallScale);

	return wall;
}

/**
 * 创建单个砖块
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {THREE.Mesh} 砖块对象
 */
export function createBrick(Ammo, physicsEngine, options = {}) {
	const {
		sx,
		sy,
		sz,
		mass,
		pos,
		quat,
		material,
	} = options;

	var threeObject = new THREE.Mesh(
		new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1),
		material
	);
	var shape = new Ammo.btBoxShape(
		new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5)
	);
	shape.setMargin(PHYSICS_CONFIG.collisionMargin);

	createBrickBody(Ammo, physicsEngine, threeObject, shape, mass, pos, quat);

	return threeObject;
}

/**
 * 为砖块添加物理体
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {THREE.Object3D} threeObject - Three.js 对象
 * @param {Object} physicsShape - Ammo.js 物理形状
 * @param {number} mass - 质量
 * @param {THREE.Vector3} pos - 位置
 * @param {THREE.Quaternion} quat - 旋转
 */
function createBrickBody(
	Ammo,
	physicsEngine,
	threeObject,
	physicsShape,
	mass,
	pos,
	quat
) {
	threeObject.position.copy(pos);
	threeObject.quaternion.copy(quat);

	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
	transform.setRotation(
		new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
	);
	var motionState = new Ammo.btDefaultMotionState(transform);

	var localInertia = new Ammo.btVector3(0, 0, 0);
	physicsShape.calculateLocalInertia(mass, localInertia);

	var rbInfo = new Ammo.btRigidBodyConstructionInfo(
		mass,
		motionState,
		physicsShape,
		localInertia
	);
	var body = new Ammo.btRigidBody(rbInfo);

	threeObject.userData.physicsBody = body;

	scene.add(threeObject);

	if (mass > 0) {
		// 禁用失活状态
		body.setActivationState(physicsEngine.STATE.DISABLE_DEACTIVATION);
	}

	physicsEngine.addRigidBody(threeObject, body);
}

/**
 * 创建砖墙
 * @param {Object} Ammo - Ammo.js 实例
 * @param {PhysicsEngine} physicsEngine - 物理引擎实例
 * @param {Object} options - 配置选项
 * @returns {Array} 砖块对象数组
 */
export function wallOfBricks(Ammo, physicsEngine, options = {}) {
	const {
		brickMass = 0.1,
		brickLength = 3,
		brickDepth = 3,
		brickHeight = 1.5,
		numberOfBricksAcross = 6,
		numberOfRowsHigh = 6,
		startPos = { x: 70, y: 0, z: -60 },
	} = options;

	const loader = new THREE.TextureLoader(manager);
	var pos = new THREE.Vector3();
	var quat = new THREE.Quaternion();

	pos.set(startPos.x, brickHeight * 0.5, startPos.z);
	quat.set(0, 0, 0, 1);

	const bricks = [];

	for (var j = 0; j < numberOfRowsHigh; j++) {
		var oddRow = j % 2 == 1;

		pos.x = startPos.x - (numberOfBricksAcross * brickLength) / 2;

		if (oddRow) {
			pos.x += 0.25 * brickLength;
		}

		var currentRow = oddRow
			? numberOfBricksAcross + 1
			: numberOfBricksAcross;
		for (let i = 0; i < currentRow; i++) {
			var brickLengthCurrent = brickLength;
			var brickMassCurrent = brickMass;
			if (oddRow && (i == 0 || i == currentRow - 1)) {
				// first or last brick
				brickLengthCurrent *= 0.5;
				brickMassCurrent *= 0.5;
			}
			var brick = createBrick(Ammo, physicsEngine, {
				sx: brickLengthCurrent,
				sy: brickHeight,
				sz: brickDepth,
				mass: brickMassCurrent,
				pos: pos.clone(),
				quat: quat.clone(),
				material: new THREE.MeshStandardMaterial({
					map: loadTexture(loader, stoneTexture),
				}),
			});
			brick.castShadow = true;
			brick.receiveShadow = true;
			bricks.push(brick);

			if (oddRow && (i == 0 || i == currentRow - 2)) {
				// first or last brick
				pos.x += brickLength * 0.25;
			} else {
				pos.x += brickLength;
			}
			pos.z += 0.0001;
		}
		pos.y += brickHeight;
	}

	return bricks;
}

