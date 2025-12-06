/**
 * 相机控制模块
 */
import * as THREE from "three";
import { camera, renderer } from "./World";
import { getCanvasRelativePosition, isInArea1, isInArea2, isInArea3 } from "../utils/camera";

const CAMERA_CONFIG = {
	area1: {
		offsetY: 50,
		offsetZ: 40,
	},
	area2: {
		offsetY: 50,
		offsetZ: 40,
	},
	area3: {
		offsetY: 10,
		offsetZ: 40,
	},
	default: {
		offsetY: 30,
		offsetZ: 60,
	},
	lerpSpeed: 0.033,
} as const;

export const pickPosition: { x: number; y: number } = { x: 0, y: 0 };
export const cursorHoverObjects: THREE.Object3D[] = [];

/**
 * 相机跟随球体位置
 */
export function rotateCamera(ballPosition: THREE.Object3D | { position: THREE.Vector3 }): void {
	const camPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
	let targetPos: THREE.Vector3;
	const pos = ballPosition.position;

	if (isInArea1(pos)) {
		targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area1.offsetY, pos.z + CAMERA_CONFIG.area1.offsetZ);
	} else if (isInArea2(pos)) {
		targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area2.offsetY, pos.z + CAMERA_CONFIG.area2.offsetZ);
	} else if (isInArea3(pos)) {
		targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area3.offsetY, pos.z + CAMERA_CONFIG.area3.offsetZ);
	} else {
		targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.default.offsetY, pos.z + CAMERA_CONFIG.default.offsetZ);
	}

	camPos.lerp(targetPos, CAMERA_CONFIG.lerpSpeed);
	camera.position.copy(camPos);
	camera.lookAt(pos);
}

/**
 * 处理点击交互
 */
export function launchClickPosition(event: MouseEvent | TouchEvent): void {
	const pos = getCanvasRelativePosition(event);

	pickPosition.x = (pos.x / renderer.domElement.width) * 2 - 1;
	pickPosition.y = (pos.y / renderer.domElement.height) * -2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(new THREE.Vector2(pickPosition.x, pickPosition.y), camera);
	const intersectedObjects = raycaster.intersectObjects(cursorHoverObjects);

	if (intersectedObjects.length > 0) {
		const pickedObject = intersectedObjects[0].object;
		if (pickedObject.userData.URL) {
			window.open(pickedObject.userData.URL, "_blank");
		}
	}
}

/**
 * 处理鼠标悬停效果
 */
export function launchHover(event: MouseEvent): void {
	event.preventDefault();

	const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(cursorHoverObjects);

	document.body.style.cursor = intersects.length > 0 ? "pointer" : "default";
}
