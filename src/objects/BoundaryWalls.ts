import { scene } from "../core/World";
import { CONFIG as PLANE_CONFIG } from "./Planes";
import { createWall } from "./Shapes";

const CONFIG = {
	size: {
		x: 1, // 墙壁厚度（X 和 Z 方向）
		y: 4, // 墙壁高度（Y 方向）
		z: 1, // 墙壁厚度（X 和 Z 方向）
	},
} as const;

/**
 * 创建围绕平面的四堵边界墙
 */
export function createBoundaryWalls(): void {
	const { size: planeScale, position: planePosition, grid } = PLANE_CONFIG;
	const { x: thickness, y: height } = CONFIG.size;

	// 计算平面半宽和半深
	const planeHalfWidth = planeScale.x * 0.5;
	const planeHalfDepth = planeScale.z * 0.5;
	// 计算墙壁中心 Y 坐标
	const wallCenterY = height * 0.5 + grid.positionY;
	// 计算墙壁半厚度
	const halfThickness = thickness * 0.5;

	// 计算左右墙的尺寸
	const xWallSize = { x: thickness, y: height, z: planeScale.z };
	// 计算左右墙的 Z 坐标
	const xWallZ = planePosition.z;

	// 创建左墙
	const leftWall = createWall({
		position: {
			x: planePosition.x + planeHalfWidth - halfThickness,
			y: wallCenterY,
			z: xWallZ,
		},
		size: xWallSize,
	});
	scene.add(leftWall);

	// 创建右墙
	const rightWall = createWall({
		position: {
			x: planePosition.x - planeHalfWidth + halfThickness,
			y: wallCenterY,
			z: xWallZ,
		},
		size: xWallSize,
	});
	scene.add(rightWall);

	const zWallX = planePosition.x;
	// 前后墙的 X 长度需要减去左右墙的厚度，避免角落重叠
	const zWallSize = {
		x: planeScale.x - thickness * 2,
		y: height,
		z: thickness,
	};

	// 创建前墙
	const frontWall = createWall({
		position: {
			x: zWallX,
			y: wallCenterY,
			z: planePosition.z + planeHalfDepth - halfThickness,
		},
		size: zWallSize,
	});
	scene.add(frontWall);

	// 创建后墙
	const backWall = createWall({
		position: {
			x: zWallX,
			y: wallCenterY,
			z: planePosition.z - planeHalfDepth + halfThickness,
		},
		size: zWallSize,
	});
	scene.add(backWall);
}
