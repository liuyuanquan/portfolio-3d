/**
 * 相机工具函数模块
 * 提供相机控制、光线投射和交互相关的工具函数
 *
 * 功能：
 * - 相机跟随球体位置
 * - 鼠标点击位置检测
 * - 鼠标悬停效果
 * - 光线投射交互
 */
import * as THREE from "three";
import { camera, renderer, scene } from "./world";
import { CAMERA_CONFIG, AREA_BOUNDS } from "../config/camera";

/**
 * 拾取位置（归一化坐标，范围 -1 到 1）
 * 用于光线投射计算
 */
export const pickPosition: { x: number; y: number } = { x: 0, y: 0 };

/**
 * 可交互对象数组（用于鼠标悬停检测）
 * 存储所有可点击的 3D 对象的引用
 */
export const cursorHoverObjects: THREE.Object3D[] = [];

/**
 * 检查点是否在区域内
 */
function isInArea1(position: THREE.Vector3): boolean {
	return AREA_BOUNDS.area1.some(
		(bounds) => position.x >= bounds.x[0] && position.x <= bounds.x[1] && position.z >= bounds.z[0] && position.z <= bounds.z[1]
	);
}

function isInArea2(position: THREE.Vector3): boolean {
	const bounds = AREA_BOUNDS.area2;
	return position.x > bounds.x[0] && position.x < bounds.x[1] && position.z > bounds.z[0] && position.z < bounds.z[1];
}

function isInArea3(position: THREE.Vector3): boolean {
	return position.z > AREA_BOUNDS.area3.z[0];
}

/**
 * 旋转相机跟随球体位置
 *
 * 根据球体在不同区域的位置，调整相机的位置和角度：
 * - 区域 1：项目展示区域，相机高度较高
 * - 区域 2：技能展示区域，相机高度较高
 * - 区域 3：后方区域，相机高度较低
 * - 默认：其他区域，使用默认相机位置
 *
 * 使用线性插值（lerp）实现平滑的相机移动效果
 *
 * @param ballPosition - 球体的位置对象（THREE.Object3D 或包含 position 的对象）
 */
export function rotateCamera(ballPosition: THREE.Object3D | { position: THREE.Vector3 }): void {
	// 当前相机位置
	const camPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

	// 目标相机位置
	let targetPos: THREE.Vector3;

	const pos = ballPosition.position;

	// 区域 1：项目展示区域
	if (isInArea1(pos)) {
		targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area1.offsetY, pos.z + CAMERA_CONFIG.area1.offsetZ);
	}
	// 区域 2：技能展示区域
	else if (isInArea2(pos)) {
		targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area2.offsetY, pos.z + CAMERA_CONFIG.area2.offsetZ);
	}
	// 区域 3：后方区域
	else if (isInArea3(pos)) {
		targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area3.offsetY, pos.z + CAMERA_CONFIG.area3.offsetZ);
	}
	// 默认位置：其他区域
	else {
		targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.default.offsetY, pos.z + CAMERA_CONFIG.default.offsetZ);
	}

	// 使用线性插值平滑移动相机
	camPos.lerp(targetPos, CAMERA_CONFIG.lerpSpeed);
	camera.position.copy(camPos);

	// 相机始终看向球体位置
	camera.lookAt(pos);
}

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
 * 处理点击位置
 *
 * 使用光线投射检测点击的对象，如果对象有 URL 属性，则在新窗口打开链接
 *
 * @param event - 鼠标或触摸事件对象
 */
export function launchClickPosition(event: MouseEvent | TouchEvent): void {
	const pos = getCanvasRelativePosition(event);

	// 转换为归一化设备坐标（NDC，范围 -1 到 1）
	pickPosition.x = (pos.x / renderer.domElement.width) * 2 - 1;
	pickPosition.y = (pos.y / renderer.domElement.height) * -2 + 1; // Y 轴翻转

	// 创建光线投射器
	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(new THREE.Vector2(pickPosition.x, pickPosition.y), camera);

	// 检测与可交互对象的交点（与 launchHover 保持一致）
	const intersectedObjects = raycaster.intersectObjects(cursorHoverObjects);

	if (intersectedObjects.length > 0) {
		// 选择最近的交点对象
		const pickedObject = intersectedObjects[0].object;

		// 如果对象有 URL 属性，在新窗口打开链接
		if (pickedObject.userData.URL) {
			window.open(pickedObject.userData.URL, "_blank");
		}
	}
}

/**
 * 处理鼠标悬停效果
 *
 * 使用光线投射检测鼠标是否悬停在可交互对象上，
 * 如果是，则将鼠标样式改为 pointer，否则改为 default
 *
 * @param event - 鼠标事件对象
 */
export function launchHover(event: MouseEvent): void {
	event.preventDefault();

	// 将鼠标坐标转换为归一化设备坐标（NDC）
	const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

	// 创建光线投射器
	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	// 检测与可交互对象的交点
	const intersects = raycaster.intersectObjects(cursorHoverObjects);

	// 更新鼠标样式
	document.body.style.cursor = intersects.length > 0 ? "pointer" : "default";
}
