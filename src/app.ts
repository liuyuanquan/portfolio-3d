/**
 * 主应用入口文件
 */
import * as THREE from "three";
import { WEBGL } from "three/examples/jsm/WebGL.js";

import { initInput, moveDirection, initJoystick } from "./core/InputManager";
import { isTouchscreenDevice } from "./utils/device";

import { scene, camera, renderer, manager, createWorld } from "./core/World";
import { createGlowingParticles, createBackgroundParticles, moveParticles } from "./resources/Particles";
import { createGalaxy, updateGalaxy } from "./resources/Galaxy";
import { lensFlareObject } from "./objects/LensFlare";

import { launchClickPosition, rotateCamera, launchHover } from "./core/CameraControl";

import { PhysicsEngine } from "./core/PhysicsEngine";

import { GameLoop } from "./core/GameLoop";

import {
	createBall as createBallObj,
	createBeachBall,
	createBoxes,
	createProjectsSection,
	createBillboards,
	createBoundaryWalls,
	createGridPlane,
	createBrickWalls,
	createSkillsSection,
} from "./objects";
import { createLensFlare } from "./objects/LensFlare";

import { GAMEPLAY_CONFIG } from "./config";

/**
 * 主函数
 * 初始化应用并启动游戏循环
 */
async function main(): Promise<void> {
	// 检查 WebGL 可用性
	if (!WEBGL.isWebGLAvailable()) {
		alert("Your browser does not support WebGL. Please update your browser to the latest version.");
		location.href = "https://github.com/liuyuanquan/portfolio-3d";
		return;
	}

	// 如果是触摸设备，创建虚拟摇杆
	if (isTouchscreenDevice()) {
		const joystickWrapper = document.getElementById("joystick-wrapper");
		if (joystickWrapper) {
			initJoystick(joystickWrapper);
		}
	}

	// 等待 Ammo.js 加载完成
	const AmmoLib = await Ammo();

	const physicsEngine = PhysicsEngine.getInstance(AmmoLib);

	let ballObject: THREE.Mesh | null = null;
	let gameLoop: GameLoop | null = null;
	let clock: THREE.Clock;
	manager.onLoad = function () {
		document.querySelectorAll(".preload").forEach((element) => {
			const el = element as HTMLElement;
			el.style.visibility = "hidden";
			el.style.display = "none";
		});
		document.querySelectorAll(".fadeOutDiv").forEach((element) => {
			element.classList.add("fade-out");
		});

		document.addEventListener("click", launchClickPosition);
		document.addEventListener("mousemove", launchHover);
	};

	function moveBall(): void {
		if (!ballObject) return;

		const movementConfig = GAMEPLAY_CONFIG.ballMovement;
		const moveX = moveDirection.right - moveDirection.left;
		const moveZ = moveDirection.back - moveDirection.forward;
		const moveY = ballObject.position.y < movementConfig.groundThreshold ? 0 : movementConfig.airMovementY;

		if (moveX === 0 && moveY === 0 && moveZ === 0) return;

		const resultantImpulse = new AmmoLib.btVector3(moveX, moveY, moveZ);
		resultantImpulse.op_mul(movementConfig.scalingFactor);

		const physicsBody = ballObject.userData.physicsBody;
		if (physicsBody) {
			physicsBody.setLinearVelocity(resultantImpulse);
		}
	}

	function onUpdate(deltaTime: number): void {
		moveBall();
		physicsEngine.update(deltaTime);

		if (ballObject) {
			rotateCamera(ballObject);
		}

		moveParticles(clock, lensFlareObject);
		updateGalaxy();
	}

	function start(): void {
		// 创建 Three.js 世界场景
		createWorld();
		// 创建 Ammo.js 物理世界
		physicsEngine.createWorld();
		// 创建地面
		createGridPlane();
		// 创建玩家球体
		ballObject = createBallObj();
		// 创建边界墙
		createBoundaryWalls();
		// 创建砖墙
		createBrickWalls();
		// 创建广告牌
		createBillboards();
		// 创建项目展示区域
		createProjectsSection();
		// 创建所有链接盒子
		createBoxes();
		// 创建技能展示区域
		createSkillsSection();
		// 创建镜头光晕
		createLensFlare();
		// 创建背景粒子
		createBackgroundParticles();
		// 创建发光粒子
		createGlowingParticles();
		// 创建星系
		createGalaxy();
		// 创建沙滩球
		createBeachBall();

		// 初始化输入事件
		initInput();

		gameLoop = new GameLoop({
			onUpdate,
			onRender: () => renderer.render(scene, camera),
		});
		clock = gameLoop.getClock();
		gameLoop.start();
	}

	start();
}

// 启动主函数
main().catch((error) => {
	console.error("Failed to initialize application:", error);
	alert("Failed to initialize application. Please refresh the page.");
});
