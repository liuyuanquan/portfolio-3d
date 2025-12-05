import * as THREE from "three";
import { scene } from "../resources/world";
import { OBJECTS_CONFIG, PHYSICS_CONFIG } from "../config";
import { addRigidPhysics } from "./PhysicsHelpers";

/**
 * 创建网格平面
 * @param options - 配置选项（可选）
 * @returns 平面网格对象
 */
export function createGridPlane(options: CreateGridPlaneOptions = {}): THREE.Mesh {
	const planeConfig = OBJECTS_CONFIG.plane;
	const { pos = planeConfig.position, scale = planeConfig.scale, quat = planeConfig.quaternion, mass = planeConfig.mass } = options;

	// ==================== 视觉网格 ====================
	const gridConfig = planeConfig.grid;
	const gridSize = scale.x;
	const divisions = Math.round(gridSize / gridConfig.cellSize);
	const grid = new THREE.GridHelper(gridSize, divisions, 0xffffff, 0xffffff);
	const gridMaterial = grid.material as THREE.Material;
	gridMaterial.opacity = 0.5;
	gridMaterial.transparent = true;
	grid.position.y = gridConfig.positionY;
	scene.add(grid);

	// ==================== Three.js 平面 ====================
	const blockPlane = new THREE.Mesh(
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

	// ==================== Ammo.js 物理 ====================
	addRigidPhysics(blockPlane, {
		scale,
		mass,
		quat,
		friction: PHYSICS_CONFIG.friction.plane,
		rollingFriction: PHYSICS_CONFIG.friction.rolling,
	});

	return blockPlane;
}
