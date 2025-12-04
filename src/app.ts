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
import {
	billboardTextures,
	boxTexture,
	inputText,
	URL,
} from "./config/resources";

import {
	setupEventHandlers,
	moveDirection,
	createJoystick,
} from "./resources/eventHandlers";
import { isTouchscreenDevice } from "./utils/device";

import {
	preloadDivs,
	postloadDivs,
	startButton,
	fadeOutDivs,
} from "./resources/preload";

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

import {
	simpleText,
	floatingLabel,
	allSkillsSection,
	createTextOnPlane,
} from "./resources/surfaces";

import {
	launchClickPosition,
	rotateCamera,
	launchHover,
} from "./resources/cameraUtils";

import { PhysicsEngine } from "./core/PhysicsEngine";

import { GameLoop } from "./core/GameLoop";

import {
	createBall as createBallObj,
	createBeachBall,
	createBox,
	floydWords,
	createBillboard,
	createBillboardRotated,
	createWallX,
	createWallZ,
	wallOfBricks,
	createGridPlane,
	createTriangle,
	loadFloydText,
	loadEngineerText,
} from "./objects";

import {
	PHYSICS_CONFIG,
	GAMEPLAY_CONFIG,
} from "./config";

/**
 * Ammo.js 类型定义
 * 由于 Ammo.js 是全局引入的 UMD 模块，使用 any 类型
 */
type AmmoType = any;

/**
 * 广告牌返回类型
 */
interface BillboardResult {
	pole: THREE.Mesh;
	sign: THREE.Mesh;
}

/**
 * 可交互对象数组（用于鼠标悬停检测）
 * 存储所有可点击的 3D 对象的引用
 */
export let cursorHoverObjects: THREE.Object3D[] = [];

// 检查 WebGL 可用性
if (WEBGL.isWebGLAvailable()) {
	// WebGL 可用，初始化 Ammo.js 物理引擎
	Ammo().then((Ammo: AmmoType) => {
		// 创建物理引擎实例
		const physicsEngine = new PhysicsEngine(Ammo);

		/**
		 * 玩家控制的球体对象
		 * 包含 Three.js 网格对象和 Ammo.js 物理刚体
		 * 初始值为 null，在 start() 函数中通过 createBallObj() 创建
		 */
		let ballObject: THREE.Mesh | null = null;

		/**
		 * 带有链接的交互对象数组
		 * 存储所有可点击的 3D 对象的 UUID，用于点击检测和交互处理
		 * 通过 createBox() 和 floydWords() 函数自动添加对象 UUID
		 */
		let objectsWithLinks: string[] = [];

		// 游戏循环实例
		let gameLoop: GameLoop | null = null;

		/**
		 * 创建物理世界
		 *
		 * 初始化 Ammo.js 物理引擎的世界环境，包括：
		 * - 碰撞检测配置
		 * - 碰撞调度器
		 * - 物理世界实例
		 * - 重力设置
		 *
		 * 必须在创建任何物理对象之前调用此函数
		 */
		function createPhysicsWorld(): void {
			physicsEngine.createWorld({
				gravity: PHYSICS_CONFIG.gravity,
			});
		}

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
			const scalingFactor = movementConfig.scalingFactor;

			// 计算水平移动方向（左右、前后）
			let moveX = moveDirection.right - moveDirection.left;
			let moveZ = moveDirection.back - moveDirection.forward;
			let moveY = 0;

			// 根据球体是否在地面上决定垂直移动
			if (ballObject.position.y < movementConfig.groundThreshold) {
				// 在地面上：只能水平移动，不能垂直移动
				moveX = moveDirection.right - moveDirection.left;
				moveZ = moveDirection.back - moveDirection.forward;
				moveY = 0;
			} else {
				// 在空中：可以水平移动，同时施加向下的力（模拟重力影响）
				moveX = moveDirection.right - moveDirection.left;
				moveZ = moveDirection.back - moveDirection.forward;
				moveY = movementConfig.airMovementY;
			}

			// 如果没有移动输入，直接返回
			if (moveX === 0 && moveY === 0 && moveZ === 0) return;

			// 创建物理冲量向量并应用缩放因子
			const resultantImpulse = new Ammo.btVector3(moveX, moveY, moveZ);
			resultantImpulse.op_mul(scalingFactor);

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
			// 桌面端：需要窗口焦点才能移动（避免后台运行）
			// 移动端：直接移动（触摸设备）
			if (!isTouchscreenDevice()) {
				// 桌面端：检查窗口是否有焦点
				if (document.hasFocus()) {
					// 窗口有焦点：正常移动球体
					moveBall();
				} else {
					// 窗口失去焦点：重置移动方向，停止球体移动
					// 避免用户切换标签页后球体继续移动
					moveDirection.forward = 0;
					moveDirection.back = 0;
					moveDirection.left = 0;
					moveDirection.right = 0;
				}
			} else {
				// 移动端：直接移动球体（不需要焦点检查）
				moveBall();
			}

			// 更新物理引擎
			// 步进物理模拟，同步所有物理对象的位置和旋转
			// 同时检查球体是否掉落，更新相机角度
			updatePhysics(deltaTime);

			// 更新粒子系统
			// 更新背景粒子、发光粒子和镜头光晕的动画效果
			moveParticles();
		}

		/**
		 * 渲染逻辑（每帧调用）
		 */
		function onRender(): void {
			renderer.render(scene, camera);
		}

		/**
		 * 开始按钮点击事件监听器
		 *
		 * 处理用户点击"开始探索"按钮后的逻辑：
		 * 1. 隐藏预加载界面（淡出动画）
		 * 2. 移除按钮监听器，防止重复点击
		 * 3. 注册点击和鼠标移动事件，用于场景交互
		 * 4. 创建沙滩球（作为初始交互对象）
		 * 5. 延迟注册鼠标悬停事件，避免过早触发
		 */
		function startButtonEventListener(): void {
			for (let i = 0; i < fadeOutDivs.length; i++) {
				fadeOutDivs[i].classList.add("fade-out");
			}
			setTimeout(() => {
				const preloadOverlay = document.getElementById("preload-overlay");
				if (preloadOverlay) {
					preloadOverlay.style.display = "none";
				}
			}, 750);

			if (startButton) {
				startButton.removeEventListener("click", startButtonEventListener);
			}
			document.addEventListener("click", launchClickPosition);
			createBeachBall(Ammo, physicsEngine);

			setTimeout(() => {
				document.addEventListener("mousemove", launchHover);
			}, 1000);
		}

		/**
		 * 更新物理引擎逻辑
		 *
		 * 每帧调用，负责：
		 * 1. 更新物理世界状态（碰撞检测、重力、速度等）
		 * 2. 同步物理世界结果到 Three.js 对象的位置和旋转
		 * 3. 检查球体是否掉落，如果掉落则重新创建
		 * 4. 根据球体位置更新相机角度
		 *
		 * @param deltaTime - 时间差（秒），用于物理模拟的时间步进
		 */
		function updatePhysics(deltaTime: number): void {
			// 更新物理引擎（会自动同步所有刚体的位置和旋转）
			physicsEngine.update(deltaTime);

			// 检查球体是否掉落（低于阈值）
			// 如果掉落，移除旧球体并创建新球体，重置游戏状态
			if (
				ballObject &&
				ballObject.position.y < GAMEPLAY_CONFIG.ballFallThreshold
			) {
				// 从场景中移除旧球体
				scene.remove(ballObject);
				// 从物理世界中移除旧球体的刚体
				physicsEngine.removeRigidBody(ballObject);
				// 创建新球体，重置位置
				ballObject = createBallObj(Ammo, physicsEngine);
			}

			// 根据球体位置更新相机角度
			// 相机会自动跟随球体，并根据球体所在区域调整视角
			if (ballObject) {
				rotateCamera(ballObject);
			}
		}

		// 资源加载管理器事件处理
		manager.onStart = function () {
			// 资源开始加载时的回调（可选）
		};

		manager.onLoad = function () {
			let readyStateCheckInterval = setInterval(function () {
				if (document.readyState === "complete") {
					clearInterval(readyStateCheckInterval);
					for (let i = 0; i < preloadDivs.length; i++) {
						const element = preloadDivs[i] as HTMLElement;
						element.style.visibility = "hidden";
						element.style.display = "none";
					}
					for (let i = 0; i < postloadDivs.length; i++) {
						const element = postloadDivs[i] as HTMLElement;
						element.style.visibility = "visible";
						element.style.display = "block";
					}
					// 页面加载完成后，延迟自动点击开始按钮
					setTimeout(() => {
						if (startButton) {
							startButton.click();
						}
					}, 0);
				}
			}, 1000);
		};

		manager.onError = function () {
			// 资源加载错误时的回调（可选）
		};

		if (startButton) {
			startButton.addEventListener("click", startButtonEventListener);
		}

		// 如果是触摸设备，创建虚拟摇杆
		if (isTouchscreenDevice()) {
			const appDirections = document.getElementById("appDirections");
			if (appDirections) {
				appDirections.innerHTML =
					"Use the joystick at the bottom to move the ball. Please use your device in portrait orientation!";
			}
			const joystickWrapper = document.getElementById("joystick-wrapper");
			if (joystickWrapper) {
				createJoystick(joystickWrapper);
				joystickWrapper.style.visibility = "visible";
			}
		}

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
			createPhysicsWorld();

			// 3. 创建基础物理对象
			createGridPlane(Ammo, physicsEngine);
			ballObject = createBallObj(Ammo, physicsEngine);

			createWallX(Ammo, physicsEngine, { x: 87.5, y: 1.75, z: 0 });
			createWallX(Ammo, physicsEngine, { x: -87.5, y: 1.75, z: 0 });
			createWallZ(Ammo, physicsEngine, { x: 0, y: 1.75, z: 87.5 });
			createWallZ(Ammo, physicsEngine, { x: 0, y: 1.75, z: -87.5 });

			// 4. 创建广告牌和链接盒子
			const billboard1 = createBillboard(Ammo, physicsEngine, {
				x: -80,
				y: 2.5,
				z: -70,
				textureImage: billboardTextures.terpSolutionsTexture,
				urlLink: URL.terpsolutions,
				rotation: Math.PI * 0.22,
			}) as BillboardResult;
			cursorHoverObjects.push(billboard1.sign);

			const billboard2 = createBillboard(Ammo, physicsEngine, {
				x: -45,
				y: 2.5,
				z: -78,
				textureImage: billboardTextures.bagHolderBetsTexture,
				urlLink: URL.githubBagholder,
				rotation: Math.PI * 0.17,
			}) as BillboardResult;
			cursorHoverObjects.push(billboard2.sign);

			const billboard3 = createBillboardRotated(Ammo, physicsEngine, {
				x: -17,
				y: 1.25,
				z: -75,
				textureImage: billboardTextures.homeSweetHomeTexture,
				urlLink: URL.githubHomeSweetHome,
				rotation: Math.PI * 0.15,
			}) as BillboardResult;
			cursorHoverObjects.push(billboard3.sign);

			floydWords(Ammo, physicsEngine, objectsWithLinks, {
				x: 16.2,
				y: 1,
				z: -20,
			});
			createTextOnPlane(-70, 0.01, -48, inputText.terpSolutionsText, 20, 40);
			createTextOnPlane(-42, 0.01, -53, inputText.bagholderBetsText, 20, 40);
			createTextOnPlane(-14, 0.01, -49, inputText.homeSweetHomeText, 20, 40);

			const githubBox = createBox(Ammo, physicsEngine, objectsWithLinks, {
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

			const twitterBox = createBox(Ammo, physicsEngine, objectsWithLinks, {
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

			const mailBox = createBox(Ammo, physicsEngine, objectsWithLinks, {
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

			const writingBox = createBox(Ammo, physicsEngine, objectsWithLinks, {
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
				instructionsText =
					"Use the joystick at the bottom\nof the screen to move the ball.";
			} else {
				touchText = "Click on boxes with\nthe mouse to open links";
				instructionsText =
					"Use the arrow keys on your\nkeyboard to move the ball.";
			}

			simpleText(9, 0.01, 5, instructionsText, 1.25);
			simpleText(23, 0.01, -60, touchText, 1.5);
			simpleText(-42, 0.01, -30, "PROJECTS", 3);
			simpleText(61, 0.01, -15, "TIMELINE", 3);

			wallOfBricks(Ammo, physicsEngine);
			createTriangle({ x: 63, z: -55 });
			createTriangle({ x: 63, z: -51 });
			createTriangle({ x: 63, z: -47 });
			createTriangle({ x: 63, z: -43 });

			addParticles();
			glowingParticles();
			generateGalaxy();

			setupEventHandlers();

			// 创建并启动游戏循环
			gameLoop = new GameLoop({
				onUpdate,
				onRender,
				stats,
				clock,
				galaxyClock,
				galaxyMaterial,
			});
			gameLoop.start();
		}

		// 启动应用
		start();
	});
} else {
	// WebGL 不可用，显示错误提示并跳转
	alert(
		"Your browser does not support WebGL. Please update your browser to the latest version."
	);
	location.href = "https://github.com/liuyuanquan/portfolio-3d";
}

