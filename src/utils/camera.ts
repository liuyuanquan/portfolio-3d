import * as THREE from "three";
import { AREA_BOUNDS } from "../config";

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

/**
 * 检查点是否在区域4内（工作经历区域）
 */
export function isInArea4(position: THREE.Vector3): boolean {
	const bounds = AREA_BOUNDS.area4;
	return position.x >= bounds.x[0] && position.x <= bounds.x[1] && position.z >= bounds.z[0] && position.z <= bounds.z[1];
}
