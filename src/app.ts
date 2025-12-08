/**
 * 主应用入口文件
 */
import { WEBGL } from "three/examples/jsm/WebGL.js";
import { World, GameLoop, PhysicsEngine, InteractionManager, resourceManager } from "./core";
import { isTouchscreenDevice } from "./utils";

// 开发环境引入 vconsole
if (import.meta.env.DEV) {
	import("vconsole").then((VConsole) => {
		new VConsole.default();
		console.log("vConsole 已加载");
	}).catch((error) => {
		console.error("vConsole 加载失败:", error);
	});
}
import {
	GridPlane,
	Ball,
	BeachBall,
	Galaxy,
	Glowing,
	Background,
	LensFlare,
	SkillsSection,
	LinkBoxes,
	Billboards,
	BrickWalls,
	BoundaryWalls,
} from "./objects";

/**
 * 隐藏预加载元素并显示摇杆（如果是触摸设备）
 */
function finishLoading(): void {
	// 隐藏预加载元素并添加淡出动画
	document.querySelectorAll(".preload, .fadeOutDiv").forEach((element) => {
		const el = element as HTMLElement;
		if (el.classList.contains("preload")) {
			// 直接设置 display: none 即可隐藏元素，visibility: hidden 是冗余的
			el.style.display = "none";
		} else if (el.classList.contains("fadeOutDiv")) {
			el.classList.add("fade-out");
		}
	});

	// 资源加载完成后，如果是触摸设备则显示摇杆
	if (isTouchscreenDevice()) {
		const joystickWrapper = document.getElementById("joystick-wrapper");
		if (joystickWrapper) {
			joystickWrapper.classList.add("loaded");
		}
	}
}

async function main(): Promise<void> {
	// 检查 WebGL 可用性
	if (!WEBGL.isWebGLAvailable()) {
		alert("Your browser does not support WebGL. Please update your browser to the latest version.");
		location.href = "https://github.com/liuyuanquan/portfolio-3d";
		return;
	}

	// 初始化资源管理器并加载所有资源
	// 设置进度回调，实时更新加载百分比和资源名称
	const loadingEl = document.getElementById("loading-percentage");
	const resourceNameEl = document.getElementById("loading-resource-name");
	await resourceManager.loadAll((progress: number, resourceName?: string) => {
		if (loadingEl) {
			loadingEl.textContent = progress.toString();
		}
		if (resourceNameEl) {
			resourceNameEl.textContent = resourceName || "";
		}
	});

	// 隐藏预加载元素并显示摇杆（如果是触摸设备）
	finishLoading();

	// 初始化 World 实例
	const world = new World();

	// 初始化交互管理器
	const interactionManager = new InteractionManager(world);
	interactionManager.init();

	// 初始化物理引擎
	const physicsEngine = new PhysicsEngine(world);
	physicsEngine.init();

	// 创建网格平面
	const gridPlane = new GridPlane(world);
	gridPlane.addWorld();

	// 创建星系
	const galaxy = new Galaxy(world);
	galaxy.addWorld();

	// 创建发光粒子
	const glowing = new Glowing(world);
	glowing.addWorld();

	// 创建背景粒子
	const background = new Background(world);
	background.addWorld();

	// 创建镜头光晕
	const lensFlare = new LensFlare(world);
	lensFlare.addWorld();

	// 创建玩家球体
	const ball = new Ball(world);
	ball.addWorld();

	// 创建沙滩球
	const beachBall = new BeachBall(world);
	beachBall.addWorld();

	// 创建技能展示区域
	const skillsSection = new SkillsSection(world);
	skillsSection.addWorld();

	// 创建所有链接盒子
	const linkBoxes = new LinkBoxes(world);
	linkBoxes.addWorld();

	// 创建广告牌
	const billboards = new Billboards(world);
	billboards.addWorld();

	// 创建砖墙
	const brickWalls = new BrickWalls(world);
	brickWalls.addWorld();

	// 创建边界墙
	const boundaryWalls = new BoundaryWalls(world);
	boundaryWalls.addWorld();

	// 启动渲染循环
	const gameLoop = new GameLoop({
		onUpdate: (deltaTime: number, clock: THREE.Clock) => {
			// 更新球体移动
			ball.update();

			// 更新物理引擎
		physicsEngine.update(deltaTime);

			// 更新星系动画
			galaxy.update(clock);

			// 更新发光粒子动画
			glowing.update(clock);

			// 更新背景粒子动画
			background.update();

			// 更新镜头光晕动画
			lensFlare.update();

			// 相机跟随球体
			world.cameraControl.rotateCamera(ball.ballObject);
		},
		onRender: () => {
			world.render();
		},
		});
		gameLoop.start();
}

// 启动主函数
main().catch((error) => {
	console.error("Failed to initialize application:", error);
	alert("Failed to initialize application. Please refresh the page.");
});
