import * as THREE from "three";
import { scene } from "../core/World";
import { PhysicsEngine } from "../core/PhysicsEngine";
import { createFloatingLabel } from "./Shapes";
import { loadFont } from "../utils/fontLoader";
import { isTouchscreenDevice } from "../utils/device";

const CONFIG_BASE = {
	position: { x: 0, y: -0.25, z: 0 },
	size: { y: 0.5 }, // Y 方向尺寸（高度/厚度）
	mass: 0,
	quaternion: { x: 0, y: 0, z: 0, w: 1 },
	friction: 10, // 滑动摩擦：影响物体在表面上滑动时的阻力
	rollingFriction: 10, // 滚动摩擦：影响球体等圆形物体在表面上滚动时的阻力
	grid: {
		cellSize: 5, // 每个网格格子的大小
		cellCount: { x: 35, z: 35 }, // X 和 Z 方向的格子数量
		positionY: 0.005,
	},
} as const;

// 根据格子数量和格子大小计算实际尺寸
export const CONFIG = {
	...CONFIG_BASE,
	size: {
		x: CONFIG_BASE.grid.cellCount.x * CONFIG_BASE.grid.cellSize,
		y: CONFIG_BASE.size.y,
		z: CONFIG_BASE.grid.cellCount.z * CONFIG_BASE.grid.cellSize,
	},
} as const;

/**
 * 创建网格平面
 * 包含视觉网格（GridHelper）和物理平面（Mesh）
 */
export function createGridPlane(): THREE.Mesh {
	const { position, size, quaternion, mass, friction, rollingFriction } = CONFIG;
	const { cellCount, positionY } = CONFIG.grid;

	const grid = new THREE.GridHelper(size.x, cellCount.x, 0xffffff, 0xffffff);
	const gridMaterial = grid.material as THREE.Material;
	gridMaterial.opacity = 0.5;
	gridMaterial.transparent = true;
	grid.position.y = positionY;
	scene.add(grid);

	const blockPlane = new THREE.Mesh(
		new THREE.BoxBufferGeometry(),
		new THREE.MeshPhongMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.25,
		})
	);

	blockPlane.position.set(position.x, position.y, position.z);
	blockPlane.scale.set(size.x, size.y, size.z);
	blockPlane.receiveShadow = true;
	scene.add(blockPlane);

	PhysicsEngine.getInstance().addRigidPhysics(blockPlane, {
		scale: size,
		mass,
		quat: quaternion,
		friction,
		rollingFriction,
	});

	// 创建操作提示文本
	const instructionsText = isTouchscreenDevice()
		? "Use the joystick at the bottom\nof the screen to move the ball."
		: "Use the arrow keys on your\nkeyboard to move the ball.";

	loadFont({
		onLoad: (font) => {
			const label = createFloatingLabel({
				font,
				position: { x: 0, y: 0.01, z: 10 },
				text: instructionsText,
				size: 1.5,
				rotateX: true,
			});
			scene.add(label);
		},
	});

	return blockPlane;
}
