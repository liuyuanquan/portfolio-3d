import * as THREE from "three";
import { renderer } from "../core/World";
import { AREA_BOUNDS } from "../config";

/**
 * 获取画布相对位置
 *
 * 将鼠标事件坐标转换为画布内的相对坐标（像素）
 *
 * @param event - 鼠标事件对象
 * @returns 画布内的相对坐标 {x, y}
 */
export function getCanvasRelativePosition(event: MouseEvent | TouchEvent): {
	x: number;
	y: number;
} {
	const rect = renderer.domElement.getBoundingClientRect();

	// 获取鼠标/触摸位置
	let clientX: number;
	let clientY: number;

	if ("touches" in event && event.touches.length > 0) {
		clientX = event.touches[0].clientX;
		clientY = event.touches[0].clientY;
	} else if ("clientX" in event) {
		clientX = event.clientX;
		clientY = event.clientY;
	} else {
		return { x: 0, y: 0 };
	}

	// 转换为画布坐标
	return {
		x: ((clientX - rect.left) * renderer.domElement.width) / rect.width,
		y: ((clientY - rect.top) * renderer.domElement.height) / rect.height,
	};
}

/**
 * 检查点是否在区域1内（项目展示区域）
 */
export function isInArea1(position: THREE.Vector3): boolean {
	return AREA_BOUNDS.area1.some(
		(bounds) => position.x >= bounds.x[0] && position.x <= bounds.x[1] && position.z >= bounds.z[0] && position.z <= bounds.z[1]
	);
}

/**
 * 检查点是否在区域2内（技能展示区域）
 */
export function isInArea2(position: THREE.Vector3): boolean {
	const bounds = AREA_BOUNDS.area2;
	return position.x > bounds.x[0] && position.x < bounds.x[1] && position.z > bounds.z[0] && position.z < bounds.z[1];
}

/**
 * 检查点是否在区域3内（后方区域）
 */
export function isInArea3(position: THREE.Vector3): boolean {
	return position.z > AREA_BOUNDS.area3.z[0];
}
