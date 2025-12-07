/**
 * 相机控制模块
 */
import * as THREE from "three";
import { World } from "./World";
import { isInArea1, isInArea2, isInArea3, isInArea4 } from "../utils";
import { CAMERA_CONFIG } from "../config";

/**
 * 相机控制类
 * 负责创建和管理相机，以及相机相关的交互逻辑
 */
export class CameraControl {
	/** World 实例 */
	private world: World;
	/** 相机对象 */
	public readonly camera: THREE.PerspectiveCamera;
	/** 点击位置 */
	public pickPosition: { x: number; y: number } = { x: 0, y: 0 };

	constructor(world: World) {
		this.world = world;
		this.camera = this.createCamera();
	}

	/**
	 * 创建相机
	 * @returns 透视相机对象
	 */
	private createCamera(): THREE.PerspectiveCamera {
		const camera = new THREE.PerspectiveCamera(CAMERA_CONFIG.fov, window.innerWidth / window.innerHeight, CAMERA_CONFIG.near, CAMERA_CONFIG.far);
		camera.position.set(CAMERA_CONFIG.initialPosition.x, CAMERA_CONFIG.initialPosition.y, CAMERA_CONFIG.initialPosition.z);
		return camera;
	}

	/**
	 * 相机跟随球体位置
	 */
	public rotateCamera(ballPosition: THREE.Object3D | { position: THREE.Vector3 }): void {
		const camPos = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
		let targetPos: THREE.Vector3;
		const pos = ballPosition.position;

		if (isInArea1(pos)) {
			targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area1.offsetY, pos.z + CAMERA_CONFIG.area1.offsetZ);
		} else if (isInArea2(pos)) {
			targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area2.offsetY, pos.z + CAMERA_CONFIG.area2.offsetZ);
		} else if (isInArea3(pos)) {
			targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area3.offsetY, pos.z + CAMERA_CONFIG.area3.offsetZ);
		} else if (isInArea4(pos)) {
			targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.area4.offsetY, pos.z + CAMERA_CONFIG.area4.offsetZ);
		} else {
			targetPos = new THREE.Vector3(pos.x, pos.y + CAMERA_CONFIG.default.offsetY, pos.z + CAMERA_CONFIG.default.offsetZ);
		}

		camPos.lerp(targetPos, CAMERA_CONFIG.lerpSpeed);
		this.camera.position.copy(camPos);
		this.camera.lookAt(pos);
	}

	/**
	 * 处理点击交互
	 */
	public launchClickPosition(event: MouseEvent | TouchEvent): void {
		const pos = this.getCanvasRelativePosition(event);

		this.pickPosition.x = (pos.x / this.world.renderer.domElement.width) * 2 - 1;
		this.pickPosition.y = (pos.y / this.world.renderer.domElement.height) * -2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(new THREE.Vector2(this.pickPosition.x, this.pickPosition.y), this.camera);
		const intersectedObjects = raycaster.intersectObjects(this.world.cursorHoverObjects);

		if (intersectedObjects.length > 0) {
			const pickedObject = intersectedObjects[0].object;
			if (pickedObject.userData.URL) {
				window.open(pickedObject.userData.URL, "_blank");
			}
		}
	}

	/**
	 * 获取画布相对位置
	 * 将鼠标事件坐标转换为画布内的相对坐标（像素）
	 * @param event 鼠标事件对象
	 * @returns 画布内的相对坐标 {x, y}
	 */
	private getCanvasRelativePosition(event: MouseEvent | TouchEvent): {
		x: number;
		y: number;
	} {
		const rect = this.world.renderer.domElement.getBoundingClientRect();

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
			x: ((clientX - rect.left) * this.world.renderer.domElement.width) / rect.width,
			y: ((clientY - rect.top) * this.world.renderer.domElement.height) / rect.height,
		};
	}

	/**
	 * 处理鼠标悬停效果
	 */
	public launchHover(event: MouseEvent): void {
		event.preventDefault();

		const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, this.camera);
		const intersects = raycaster.intersectObjects(this.world.cursorHoverObjects);

		document.body.style.cursor = intersects.length > 0 ? "pointer" : "default";
	}
}
