/**
 * 主应用入口文件
 * 负责初始化 Three.js 场景、Ammo.js 物理引擎和游戏循环
 *
 * 工作流程：
 * 1. 检查 WebGL 可用性
 * 2. 初始化 Ammo.js 物理引擎
 * 3. 创建 Three.js 场景和对象
 * 4. 设置事件处理器
 * 5. 启动游戏循环
 */
import * as THREE from "three";
import { WEBGL } from "three/examples/jsm/WebGL.js";
import { billboardTextures, boxTexture, inputText, URL } from "./config/resources";

import { setupEventHandlers, moveDirection, createJoystick } from "./resources/eventHandlers";
import { isTouchscreenDevice } from "./utils/device";

import {
	clock,
	scene,
	camera,
	renderer,
	stats,
	manager,
	createWorld,
	createLensFlare,
	glowingParticles,
	addParticles,
	moveParticles,
	generateGalaxy,
	galaxyMaterial,
	galaxyClock,
} from "./resources/world";

import { simpleText, floatingLabel, allSkillsSection, createTextOnPlane } from "./resources/surfaces";

import { launchClickPosition, rotateCamera, launchHover, cursorHoverObjects } from "./resources/cameraUtils";

import { PhysicsEngine } from "./core/PhysicsEngine";

import { GameLoop } from "./core/GameLoop";

import {
	createBall as createBallObj,
	createBeachBall,
	createBox,
	floydWords,
	createBillboard,
	createBillboardRotated,
	createBoundaryWalls,
	createGridPlane,
	createTriangle,
	loadFloydText,
	loadEngineerText,
	wallOfBricks,
} from "./objects";

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

	// 等待 Ammo.js 加载完成
	const AmmoLib = await Ammo();

	// ==================== 核心实例创建 ====================
	// 初始化物理引擎单例
	const physicsEngine = PhysicsEngine.getInstance(AmmoLib);

	// ==================== 变量定义 ====================
	/**
	 * 玩家控制的球体对象
	 * 包含 Three.js 网格对象和 Ammo.js 物理刚体
	 * 初始值为 null，在 start() 函数中通过 createBallObj() 创建
	 */
	let ballObject: THREE.Mesh | null = null;

	// 游戏循环实例
	let gameLoop: GameLoop | null = null;

	// ==================== 资源加载管理器 ====================
	manager.onLoad = function () {
		// 资源加载完成，隐藏预加载界面并添加淡出动画
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

	// ==================== 游戏逻辑函数 ====================
	/**
	 * 移动球体
	 *
	 * 根据用户输入（键盘或摇杆）计算移动方向，并应用到球体的物理刚体上。
	 *
	 * 工作原理：
	 * 1. 从 moveDirection 获取用户输入的方向（上下左右）
	 * 2. 根据球体是否在地面上决定 Y 轴移动（地面：Y=0，空中：Y=负值）
	 * 3. 计算合成移动向量（X, Y, Z）
	 * 4. 应用缩放因子，转换为物理冲量
	 * 5. 直接设置物理刚体的线性速度
	 *
	 * 注意：
	 * - 使用 setLinearVelocity 而不是施加力，提供更直接的控制
	 * - 地面移动（Y=0）和空中移动（Y<0）有不同的物理行为
	 */
	function moveBall(): void {
		if (!ballObject) return;

		const movementConfig = GAMEPLAY_CONFIG.ballMovement;

		// 计算水平移动方向（左右、前后）
		const moveX = moveDirection.right - moveDirection.left;
		const moveZ = moveDirection.back - moveDirection.forward;
		// 根据球体是否在地面上决定垂直移动（地面：Y=0，空中：施加向下的力）
		const moveY = ballObject.position.y < movementConfig.groundThreshold ? 0 : movementConfig.airMovementY;

		// 如果没有移动输入，直接返回
		if (moveX === 0 && moveY === 0 && moveZ === 0) return;

		// 创建物理冲量向量并应用缩放因子
		const resultantImpulse = new AmmoLib.btVector3(moveX, moveY, moveZ);
		resultantImpulse.op_mul(movementConfig.scalingFactor);

		// 获取球体的物理刚体并设置线性速度
		const physicsBody = ballObject.userData.physicsBody;
		if (physicsBody) {
			physicsBody.setLinearVelocity(resultantImpulse);
		}
	}

	/**
	 * 更新逻辑（每帧调用）
	 *
	 * 游戏循环的核心更新函数，每帧执行以下操作：
	 * 1. 处理球体移动：根据用户输入（键盘或摇杆）更新球体位置
	 * 2. 更新物理引擎：步进物理模拟，同步物理对象位置
	 * 3. 更新粒子系统：更新粒子动画和镜头光晕
	 *
	 * 执行顺序很重要：
	 * - 先处理用户输入（移动球体）
	 * - 再更新物理引擎（应用物理效果）
	 * - 最后更新视觉效果（粒子系统）
	 *
	 * @param deltaTime - 时间差（秒），用于确保物理模拟的时间一致性
	 */
	function onUpdate(deltaTime: number): void {
		// 处理球体移动
		moveBall();

		// 更新物理引擎
		// 步进物理模拟，同步所有物理对象的位置和旋转
		physicsEngine.update(deltaTime);

		// 根据球体位置更新相机角度
		// 相机会自动跟随球体，并根据球体所在区域调整视角
		if (ballObject) {
			rotateCamera(ballObject);
		}

		// 更新粒子系统
		// 更新背景粒子、发光粒子和镜头光晕的动画效果
		moveParticles();
	}

	// ==================== 初始化函数 ====================
	/**
	 * 启动函数
	 *
	 * 该函数是应用程序的入口点之一，负责初始化所有核心组件和场景对象：
	 * 1. 创建 Three.js 世界场景（相机、渲染器、光照）
	 * 2. 创建 Ammo.js 物理世界
	 * 3. 创建地面、玩家球体、墙壁等基础物理对象
	 * 4. 创建广告牌、链接盒子、3D 文本等交互式元素
	 * 5. 初始化粒子系统和星系效果
	 * 6. 设置事件处理器
	 * 7. 启动游戏主循环
	 */
	function start(): void {
		// 1. 创建 Three.js 世界场景
		createWorld();

		// 2. 创建 Ammo.js 物理世界
		physicsEngine.createWorld();

		// 3. 创建基础物理对象
		createGridPlane();

		ballObject = createBallObj();

		// 4. 创建边界墙（根据平面尺寸动态计算）
		createBoundaryWalls();

		// 5. 创建广告牌和链接盒子
		const billboard1 = createBillboard(AmmoLib, physicsEngine, {
			x: -80,
			y: 2.5,
			z: -70,
			textureImage: billboardTextures.terpSolutionsTexture,
			urlLink: URL.terpsolutions,
			rotation: Math.PI * 0.22,
		}) as BillboardResult;
		cursorHoverObjects.push(billboard1.sign);

		const billboard2 = createBillboard(AmmoLib, physicsEngine, {
			x: -45,
			y: 2.5,
			z: -78,
			textureImage: billboardTextures.bagHolderBetsTexture,
			urlLink: URL.githubBagholder,
			rotation: Math.PI * 0.17,
		}) as BillboardResult;
		cursorHoverObjects.push(billboard2.sign);

		const billboard3 = createBillboardRotated(AmmoLib, physicsEngine, {
			x: -17,
			y: 1.25,
			z: -75,
			textureImage: billboardTextures.homeSweetHomeTexture,
			urlLink: URL.githubHomeSweetHome,
			rotation: Math.PI * 0.15,
		}) as BillboardResult;
		cursorHoverObjects.push(billboard3.sign);

		floydWords(AmmoLib, physicsEngine, {
			x: 16.2,
			y: 1,
			z: -20,
		});
		createTextOnPlane(-70, 0.01, -48, inputText.terpSolutionsText, 20, 40);
		createTextOnPlane(-42, 0.01, -53, inputText.bagholderBetsText, 20, 40);
		createTextOnPlane(-14, 0.01, -49, inputText.homeSweetHomeText, 20, 40);

		const githubBox = createBox(AmmoLib, physicsEngine, {
			x: 12,
			y: 2,
			z: -70,
			scaleX: 4,
			scaleY: 4,
			scaleZ: 1,
			boxTexture: boxTexture.Github,
			URLLink: URL.gitHub,
			color: 0x000000,
			transparent: true,
		});
		cursorHoverObjects.push(githubBox);

		const twitterBox = createBox(AmmoLib, physicsEngine, {
			x: 19,
			y: 2,
			z: -70,
			scaleX: 4,
			scaleY: 4,
			scaleZ: 1,
			boxTexture: boxTexture.twitter,
			URLLink: URL.twitter,
			color: 0x0077b5,
			transparent: true,
		});
		cursorHoverObjects.push(twitterBox);

		const mailBox = createBox(AmmoLib, physicsEngine, {
			x: 27,
			y: 2,
			z: -70,
			scaleX: 4,
			scaleY: 4,
			scaleZ: 1,
			boxTexture: boxTexture.mail,
			URLLink: "mailto:arfloyd7@gmail.com",
			color: 0x000000,
			transparent: false,
		});
		cursorHoverObjects.push(mailBox);

		const writingBox = createBox(AmmoLib, physicsEngine, {
			x: 35,
			y: 2,
			z: -70,
			scaleX: 4,
			scaleY: 4,
			scaleZ: 1,
			boxTexture: boxTexture.writing,
			URLLink: URL.devTo,
			color: 0x000000,
			transparent: false,
		});
		cursorHoverObjects.push(writingBox);

		floatingLabel(11.875, 4.5, -70, "Github");
		floatingLabel(19.125, 4.5, -70, "Twitter");
		floatingLabel(26.875, 4.5, -70, "Email");
		floatingLabel(35, 6.5, -70, "   How I \nmade this");

		allSkillsSection(61, 0.025, 13, 30, 60, inputText.activities);

		// 创建镜头光晕
		createLensFlare(50, -50, -800, 200, 200, boxTexture.lensFlareMain);

		loadFloydText();
		loadEngineerText();

		// 根据设备类型设置提示文本
		let touchText: string;
		let instructionsText: string;
		if (isTouchscreenDevice()) {
			touchText = "Touch boxes with your finger\nto open links";
			instructionsText = "Use the joystick at the bottom\nof the screen to move the ball.";
		} else {
			touchText = "Click on boxes with\nthe mouse to open links";
			instructionsText = "Use the arrow keys on your\nkeyboard to move the ball.";
		}

		simpleText(9, 0.01, 5, instructionsText, 1.25);
		simpleText(23, 0.01, -60, touchText, 1.5);
		simpleText(-42, 0.01, -30, "PROJECTS", 3);
		simpleText(61, 0.01, -15, "TIMELINE", 3);

		// 创建砖墙
		wallOfBricks();

		createTriangle({ x: 63, z: -55 });
		createTriangle({ x: 63, z: -51 });
		createTriangle({ x: 63, z: -47 });
		createTriangle({ x: 63, z: -43 });

		addParticles();
		glowingParticles();
		generateGalaxy();

		// 创建沙滩球（必须在所有资源加载完成后，所以放在 start() 的最后）
		createBeachBall();

		setupEventHandlers();

		// 如果是触摸设备，创建虚拟摇杆
		if (isTouchscreenDevice()) {
			const joystickWrapper = document.getElementById("joystick-wrapper");
			if (joystickWrapper) {
				createJoystick(joystickWrapper);
			}
		}

		// 创建并启动游戏循环
		gameLoop = new GameLoop({
			onUpdate,
			onRender: () => renderer.render(scene, camera),
			stats,
			clock,
			galaxyClock,
			galaxyMaterial,
		});
		gameLoop.start();
	}

	// ==================== 启动应用 ====================
	start();
}

// 启动主函数
main().catch((error) => {
	console.error("Failed to initialize application:", error);
	alert("Failed to initialize application. Please refresh the page.");
});
