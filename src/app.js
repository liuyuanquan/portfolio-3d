import * as THREE from "three";
import { isWebGLAvailable } from "./utils";
import {
	billboardTextures,
	boxTexture,
	inputText,
	URL,
	stoneTexture,
	woodTexture,
} from "./resources/textures";

import {
	setupEventHandlers,
	moveDirection,
	isTouchscreenDevice,
	touchEvent,
	createJoystick,
} from "./resources/eventHandlers";

import {
	preloadDivs,
	preloadOpacity,
	postloadDivs,
	startScreenDivs,
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
	lensFlareObject,
	createLensFlare,
	particleGroup,
	particleAttributes,
	particleSystemObject,
	glowingParticles,
	addParticles,
	moveParticles,
	generateGalaxy,
	galaxyMaterial,
	galaxyClock,
	galaxyPoints,
} from "./resources/world";

import {
	simpleText,
	floatingLabel,
	allSkillsSection,
	createTextOnPlane,
} from "./resources/surfaces";

import {
	pickPosition,
	launchClickPosition,
	getCanvasRelativePosition,
	rotateCamera,
	launchHover,
} from "./resources/utils";

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
	addRigidPhysics,
} from "./objects";
import {
	PHYSICS_CONFIG,
	OBJECTS_CONFIG,
	GAMEPLAY_CONFIG,
	POSITIONS_CONFIG,
} from "./config";

export let cursorHoverObjects = [];

// start Ammo Engine
Ammo().then((Ammo) => {
	// 创建物理引擎实例
	const physicsEngine = new PhysicsEngine(Ammo);

	//Ammo Dynamic bodies for ball
	let ballObject = null;

	// list of hyperlink objects
	var objectsWithLinks = [];

	// 游戏循环实例
	let gameLoop = null;

	//function to create physics world with Ammo.js
	function createPhysicsWorld() {
		physicsEngine.createWorld({
			gravity: PHYSICS_CONFIG.gravity,
		});
	}

	// 对象创建函数已移至 src/objects/ 目录

	/**
	 * 移动球体
	 */
	function moveBall() {
		if (!ballObject) return;

		const movementConfig = GAMEPLAY_CONFIG.ballMovement;
		let scalingFactor = movementConfig.scalingFactor;
		let moveX = moveDirection.right - moveDirection.left;
		let moveZ = moveDirection.back - moveDirection.forward;
		let moveY = 0;

		if (ballObject.position.y < movementConfig.groundThreshold) {
			moveX = moveDirection.right - moveDirection.left;
			moveZ = moveDirection.back - moveDirection.forward;
			moveY = 0;
		} else {
			moveX = moveDirection.right - moveDirection.left;
			moveZ = moveDirection.back - moveDirection.forward;
			moveY = movementConfig.airMovementY;
		}

		// no movement
		if (moveX == 0 && moveY == 0 && moveZ == 0) return;

		let resultantImpulse = new Ammo.btVector3(moveX, moveY, moveZ);
		resultantImpulse.op_mul(scalingFactor);
		let physicsBody = ballObject.userData.physicsBody;
		physicsBody.setLinearVelocity(resultantImpulse);
	}

	/**
	 * 更新逻辑（每帧调用）
	 * @param {number} deltaTime - 时间差（秒）
	 */
	function onUpdate(deltaTime) {
		// 处理球体移动
		if (!isTouchscreenDevice()) {
			if (document.hasFocus()) {
				moveBall();
			} else {
				moveDirection.forward = 0;
				moveDirection.back = 0;
				moveDirection.left = 0;
				moveDirection.right = 0;
			}
		} else {
			moveBall();
		}

		// 更新物理引擎
		updatePhysics(deltaTime);

		// 更新粒子系统
		moveParticles();
	}

	/**
	 * 渲染逻辑（每帧调用）
	 */
	function onRender() {
		renderer.render(scene, camera);
	}

	//loading page section
	function startButtonEventListener() {
		for (let i = 0; i < fadeOutDivs.length; i++) {
			fadeOutDivs[i].classList.add("fade-out");
		}
		setTimeout(() => {
			document.getElementById("preload-overlay").style.display = "none";
		}, 750);

		startButton.removeEventListener("click", startButtonEventListener);
		document.addEventListener("click", launchClickPosition);
		createBeachBall(Ammo, physicsEngine);

		setTimeout(() => {
			document.addEventListener("mousemove", launchHover);
		}, 1000);
	}

	/**
	 * 更新物理引擎逻辑
	 * @param {number} deltaTime - 时间差（秒）
	 */
	function updatePhysics(deltaTime) {
		// 更新物理引擎（会自动同步所有刚体的位置和旋转）
		physicsEngine.update(deltaTime);

		//check to see if ball escaped the plane
		if (
			ballObject &&
			ballObject.position.y < GAMEPLAY_CONFIG.ballFallThreshold
		) {
			scene.remove(ballObject);
			physicsEngine.removeRigidBody(ballObject);
			ballObject = createBallObj(Ammo, physicsEngine);
		}

		//check to see if ball is on text to rotate camera
		if (ballObject) {
			rotateCamera(ballObject);
		}
	}

	//document loading
	manager.onStart = function (item, loaded, total) {
		//console.log("Loading started");
	};

	manager.onLoad = function () {
		var readyStateCheckInterval = setInterval(function () {
			if (document.readyState === "complete") {
				clearInterval(readyStateCheckInterval);
				for (let i = 0; i < preloadDivs.length; i++) {
					preloadDivs[i].style.visibility = "hidden"; // or
					preloadDivs[i].style.display = "none";
				}
				for (let i = 0; i < postloadDivs.length; i++) {
					postloadDivs[i].style.visibility = "visible"; // or
					postloadDivs[i].style.display = "block";
				}
			}
		}, 1000);
		//console.log("Loading complete");
	};

	manager.onError = function (url) {
		//console.log("Error loading");
	};

	startButton.addEventListener("click", startButtonEventListener);

	if (isTouchscreenDevice()) {
		document.getElementById("appDirections").innerHTML =
			"Use the joystick in the bottom left to move the ball. Please use your device in portrait orientation!";
		createJoystick(document.getElementById("joystick-wrapper"));
		document.getElementById("joystick-wrapper").style.visibility = "visible";
		document.getElementById("joystick").style.visibility = "visible";
	}

	//initialize world and begin
	function start() {
		createWorld();
		createPhysicsWorld();

		createGridPlane(Ammo, physicsEngine);
		ballObject = createBallObj(Ammo, physicsEngine);

		createWallX(Ammo, physicsEngine, { x: 87.5, y: 1.75, z: 0 });
		createWallX(Ammo, physicsEngine, { x: -87.5, y: 1.75, z: 0 });
		createWallZ(Ammo, physicsEngine, { x: 0, y: 1.75, z: 87.5 });
		createWallZ(Ammo, physicsEngine, { x: 0, y: 1.75, z: -87.5 });

		const billboard1 = createBillboard(Ammo, physicsEngine, {
			x: -80,
			y: 2.5,
			z: -70,
			textureImage: billboardTextures.terpSolutionsTexture,
			urlLink: URL.terpsolutions,
			rotation: Math.PI * 0.22,
		});
		cursorHoverObjects.push(billboard1.sign);

		const billboard2 = createBillboard(Ammo, physicsEngine, {
			x: -45,
			y: 2.5,
			z: -78,
			textureImage: billboardTextures.bagHolderBetsTexture,
			urlLink: URL.githubBagholder,
			rotation: Math.PI * 0.17,
		});
		cursorHoverObjects.push(billboard2.sign);

		const billboard3 = createBillboardRotated(Ammo, physicsEngine, {
			x: -17,
			y: 1.25,
			z: -75,
			textureImage: billboardTextures.homeSweetHomeTexture,
			urlLink: URL.githubHomeSweetHome,
			rotation: Math.PI * 0.15,
		});
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

		// floatingLabel(3.875, 4.5, -70, 'Twitter');
		floatingLabel(11.875, 4.5, -70, "Github");
		floatingLabel(19.125, 4.5, -70, "Twitter");
		floatingLabel(26.875, 4.5, -70, "Email");
		// floatingLabel(35, 6.5, -70, '  Static \nWebsite');
		floatingLabel(35, 6.5, -70, "   How I \nmade this");
		// floatingLabel(44, 6.5, -70, '   How I \nmade this');

		// allSkillsSection(-50, 0.025, 20, 40, 40, boxTexture.allSkills);
		allSkillsSection(61, 0.025, 13, 30, 60, inputText.activities);

		//lensflare
		createLensFlare(50, -50, -800, 200, 200, boxTexture.lensFlareMain);

		loadFloydText();
		loadEngineerText();

		let touchText, instructionsText;
		if (isTouchscreenDevice()) {
			touchText = "Touch boxes with your \nfinger to open links";
			instructionsText =
				"   Use the joystick in the bottom \nleft of the screen to move the ball.";
		} else {
			touchText = "Click on boxes with \nthe mouse to open links";
			instructionsText =
				"Use the arrow keys on your \n keyboard to move the ball.";
		}

		simpleText(9, 0.01, 5, instructionsText, 1.25);

		simpleText(23, 0.01, -60, touchText, 1.5);
		// simpleText(-50, 0.01, -5, 'SKILLS', 3);
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
		// window.addEventListener('mousemove', onDocumentMouseMove, false);

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

	//check if user's browser has WebGL capabilities
	if (isWebGLAvailable()) {
		start();
	} else {
		alert(
			"Your browser does not support WebGL. Please update your browser to the latest version."
		);
		location.href = "https://github.com/liuyuanquan/portfolio-3d";
	}
});

// 确保文件被识别为 ES 模块
export {};
