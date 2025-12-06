import * as THREE from "three";
import { scene } from "../resources/world";
import { addRigidPhysics } from "./PhysicsHelpers";

/**
 * 平面配置常量
 */
export const PLANE_CONFIG = {
	position: { x: 0, y: -0.25, z: 0 },
	scale: { x: 175, y: 0.5, z: 175 },
	mass: 0,
	quaternion: { x: 0, y: 0, z: 0, w: 1 },
	friction: 10,
	rollingFriction: 10,
	grid: {
		cellSize: 10,
		positionY: 0.005,
	},
} as const;

/**
 * 创建网格平面
 *
 * 该函数用于创建一个带有网格辅助线的物理平面对象。平面由两部分组成：
 * 1. 视觉网格（GridHelper）：用于提供空间参考的网格线
 * 2. 物理平面（Mesh）：实际的碰撞表面，使用半透明材质以便看到下方的网格
 *
 * 视觉属性：
 * - 使用 BoxBufferGeometry 作为基础几何体，通过缩放（scale）来控制实际尺寸
 * - 材质设置为 MeshPhongMaterial，可以很好地响应光照
 * - 平面设置为半透明，可以看到下方的网格线
 * - 平面可以接收阴影，增强场景真实感
 *
 * 物理属性：
 * - 默认质量为 0，表示静态物体（不会因重力或碰撞而移动）
 * - 碰撞形状为盒子（Box），尺寸与视觉尺寸完全一致
 * - 摩擦系数为 10，影响物体在平面上滑动时的阻力
 * - 滚动摩擦系数为 10，影响球体等圆形物体在平面上滚动时的阻力
 * - 旋转四元数用于控制平面的初始朝向
 *
 * @returns THREE.Mesh - 创建的平面网格对象，已添加到场景中并配置了物理属性
 */
export function createGridPlane(): THREE.Mesh {
	const { position, scale, quaternion, mass, friction, rollingFriction } = PLANE_CONFIG;
	const { cellSize, positionY } = PLANE_CONFIG.grid;
	const gridSize = scale.x;
	const divisions = Math.round(gridSize / cellSize);

	// 创建视觉网格
	const grid = new THREE.GridHelper(gridSize, divisions, 0xffffff, 0xffffff);
	const gridMaterial = grid.material as THREE.Material;
	// 设置网格的透明度和位置
	gridMaterial.opacity = 0.5;
	gridMaterial.transparent = true;
	grid.position.y = positionY;
	scene.add(grid);

	// 创建物理平面
	const blockPlane = new THREE.Mesh(
		new THREE.BoxBufferGeometry(),
		new THREE.MeshPhongMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.25,
		})
	);

	// 设置位置、缩放和阴影属性
	blockPlane.position.set(position.x, position.y, position.z);
	blockPlane.scale.set(scale.x, scale.y, scale.z);
	blockPlane.receiveShadow = true;
	scene.add(blockPlane);

	// 物理配置
	addRigidPhysics(blockPlane, {
		scale,
		mass,
		quat: quaternion,
		friction,
		rollingFriction,
	});

	return blockPlane;
}
