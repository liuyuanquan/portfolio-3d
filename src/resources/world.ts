/**
 * 世界场景管理模块
 * 负责 Three.js 场景、相机、渲染器的初始化和管理
 * 以及粒子系统、星系、镜头光晕等视觉效果
 *
 * 功能：
 * - 创建和管理 Three.js 场景
 * - 初始化相机和渲染器
 * - 配置光照系统（半球光、方向光）
 * - 创建和管理粒子系统
 * - 创建和管理星系效果
 * - 创建和管理镜头光晕
 */
import * as THREE from "three";
import Stats from "stats.js";
import galaxyVertexShader from "../shaders/vertex.glsl?raw";
import galaxyFragmentShader from "../shaders/fragment.glsl?raw";
import { GAMEPLAY_CONFIG } from "../config";
import { loadTexture } from "../utils/textureLoader";
import { getRandomArbitrary } from "../utils/math";

// ==================== 类型定义 ====================

/**
 * 粒子属性接口
 * 存储粒子的初始状态和随机性
 */
interface ParticleAttributes {
	/** 粒子的初始大小 */
	startSize: number[];
	/** 粒子的初始位置 */
	startPosition: THREE.Vector3[];
	/** 粒子的随机性值（用于动画） */
	randomness: number[];
}

/**
 * 粒子系统参数接口
 */
interface GalaxyParameters {
	/** 粒子数量 */
	count: number;
	/** 粒子大小 */
	size: number;
	/** 星系半径 */
	radius: number;
	/** 分支数量 */
	branches: number;
	/** 旋转速度 */
	spin: number;
	/** 随机性强度 */
	randomnessPower: number;
	/** 内部颜色 */
	insideColor: string;
	/** 外部颜色 */
	outsideColor: string;
	/** 随机性系数 */
	randomness: number;
}

// ==================== 导出变量 ====================

/**
 * Three.js 时钟对象
 * 用于计算帧率和时间差
 */
export let clock: THREE.Clock;

/**
 * Three.js 场景对象
 * 包含所有 3D 对象
 */
export let scene: THREE.Scene;

/**
 * 透视相机对象
 * 用于渲染场景
 */
export let camera: THREE.PerspectiveCamera;

/**
 * WebGL 渲染器对象
 * 负责将场景渲染到画布上
 */
export let renderer: THREE.WebGLRenderer;

/**
 * 相机辅助工具对象
 * 用于可视化相机的位置和视锥体（用于调试）
 */
export let cameraHelper: THREE.CameraHelper;

/**
 * 性能统计对象
 * 显示 FPS 等性能指标
 */
export let stats: Stats;

/**
 * 粒子组对象
 * 包含所有发光粒子
 */
export let particleGroup: THREE.Object3D;

/**
 * 粒子属性对象
 * 存储粒子的初始状态
 */
export let particleAttributes: ParticleAttributes;

/**
 * 粒子系统对象
 * 用于背景粒子效果
 */
export let particleSystemObject: THREE.Points;

/**
 * 镜头光晕对象
 * 用于创建光晕效果
 */
export let lensFlareObject: THREE.Mesh;

/**
 * 星系时钟对象
 * 用于星系动画的时间计算
 */
export let galaxyClock: THREE.Clock;

/**
 * 资源加载管理器
 * 用于跟踪资源加载进度
 */
export let manager: THREE.LoadingManager = new THREE.LoadingManager();

/**
 * 星系材质对象
 * 用于渲染星系粒子
 */
export let galaxyMaterial: THREE.ShaderMaterial | null = null;

/**
 * 星系点云对象
 * 包含所有星系粒子
 */
export let galaxyPoints: THREE.Points | null = null;

/**
 * 方向光辅助工具对象
 * 用于可视化方向光的位置和方向（用于调试）
 */
export let directionalLightHelper: THREE.DirectionalLightHelper;

// ==================== 配置常量 ====================

/**
 * 粒子系统配置
 */
const PARTICLES_CONFIG = {
	/** 背景粒子数量 */
	backgroundCount: 3000,
	/** 背景粒子大小 */
	backgroundSize: 3,
	/** 背景粒子位置范围 */
	backgroundRange: {
		x: { min: -1100, max: 1100 },
		y: { min: -1100, max: 1100 },
		z: { min: -1100, max: -500 },
	},
} as const;

/**
 * 镜头光晕配置
 */
const LENS_FLARE_CONFIG = {
	/** 默认 Y 轴缩放 */
	defaultYScale: 0.1,
	/** 透明度 */
	opacity: 0.9,
	/** 渲染顺序 */
	renderOrder: 1,
} as const;

/**
 * 粒子动画配置
 */
const PARTICLE_ANIMATION_CONFIG = {
	/** 粒子系统旋转速度 */
	particleSystemRotationSpeed: 0.0003,
	/** 镜头光晕旋转速度 */
	lensFlareRotationSpeed: 0.0002,
	/** 镜头光晕移动速度 */
	lensFlareMoveSpeed: {
		x: 0.025,
		y: -0.001,
	},
	/** 镜头光晕位置边界 */
	lensFlareBounds: {
		x: { min: -750, max: 750 },
		y: { default: -50 },
	},
	/** 发光粒子动画时间倍数 */
	glowingParticlesTimeMultiplier: 7,
	/** 发光粒子脉冲系数 */
	glowingParticlesPulse: {
		randomnessOffset: 0.75,
		amplitude: 0.1,
		base: 0.9,
		yMultiplier: 1.5,
	},
	/** 粒子组旋转速度 */
	particleGroupRotationSpeed: 0.75,
} as const;

/**
 * 星系位置配置
 */
const GALAXY_POSITION_CONFIG = {
	/** Y 轴位置偏移 */
	yOffset: -50,
	/** Z 轴位置偏移 */
	zOffset: -50,
} as const;

// ==================== 主要函数 ====================

/**
 * 创建 Three.js 世界场景
 * 初始化场景、相机、渲染器、光照系统等核心组件
 */
export function createWorld(): void {
	// 初始化时钟
	clock = new THREE.Clock();
	galaxyClock = new THREE.Clock();

	// 创建场景
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	// 创建坐标轴辅助工具（用于调试）
	// 红色 = X 轴，绿色 = Y 轴，蓝色 = Z 轴
	// 参数表示坐标轴的长度（单位）
	const axesHelper = new THREE.AxesHelper(200);
	scene.add(axesHelper);

	// 创建透视相机
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
	camera.position.set(0, 30, 70);

	// 创建相机辅助工具（用于调试）
	// 显示相机的视锥体（frustum）和位置
	// 视锥体表示相机可以看到的区域
	cameraHelper = new THREE.CameraHelper(camera);
	scene.add(cameraHelper);

	// 创建半球光（环境光）
	const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
	hemiLight.color.setHSL(0.6, 0.6, 0.6);
	hemiLight.groundColor.setHSL(0.1, 1, 0.4);
	hemiLight.position.set(0, 50, 0);
	scene.add(hemiLight);

	// 创建方向光（主光源）
	const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
	dirLight.color.setHSL(0.1, 1, 0.95);
	dirLight.position.set(-10, 100, 50);
	dirLight.position.multiplyScalar(100);
	scene.add(dirLight);

	// 创建方向光辅助工具（用于调试）
	// 显示方向光的位置和方向
	// 参数：光源对象、辅助工具的大小（单位）
	directionalLightHelper = new THREE.DirectionalLightHelper(dirLight, 1);
	scene.add(directionalLightHelper);

	// 配置方向光阴影
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 4096;
	dirLight.shadow.mapSize.height = 4096;
	dirLight.shadow.camera.left = -200;
	dirLight.shadow.camera.right = 200;
	dirLight.shadow.camera.top = 200;
	dirLight.shadow.camera.bottom = -200;
	dirLight.shadow.camera.far = 15000;

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

	// 创建性能统计
	stats = new Stats();
	document.body.appendChild(stats.dom);
}

/**
 * 创建发光粒子系统
 *
 * 创建一组使用 Sprite 材质的发光粒子，用于视觉效果
 */
export function glowingParticles(): void {
	const BASE_URL = (import.meta.env as any).BASE_URL;
	const particleTexture = loadTexture(`${BASE_URL}img/spark.png`);

	// 创建粒子组
	particleGroup = new THREE.Object3D();
	particleGroup.position.set(-1, 7, 45);
	particleAttributes = {
		startSize: [],
		startPosition: [],
		randomness: [],
	};

	// 创建粒子
	const particlesConfig = GAMEPLAY_CONFIG.particles;
	const totalParticles = particlesConfig.total;
	const radiusRange = particlesConfig.radiusRange;

	for (let i = 0; i < totalParticles; i++) {
		// 创建 Sprite 材质
		const spriteMaterial = new THREE.SpriteMaterial({
			map: particleTexture,
			color: particlesConfig.materialColor,
		});

		// 创建 Sprite 对象
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(particlesConfig.spriteScale.x, particlesConfig.spriteScale.y, particlesConfig.spriteScale.z);

		// 设置随机位置
		sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
		sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));

		// 设置随机颜色
		sprite.material.color.setHSL(Math.random(), 0.9, 0.7);

		// 配置材质属性
		sprite.material.blending = THREE.AdditiveBlending; // 发光效果
		sprite.renderOrder = 1;

		// 添加到粒子组
		particleGroup.add(sprite);

		// 保存初始状态
		particleAttributes.startPosition.push(sprite.position.clone());
		particleAttributes.randomness.push(Math.random());
	}

	scene.add(particleGroup);
}

/**
 * 创建镜头光晕效果
 *
 * @param x - X 轴位置
 * @param y - Y 轴位置
 * @param z - Z 轴位置
 * @param xScale - X 轴缩放
 * @param zScale - Z 轴缩放
 * @param boxTexture - 纹理路径
 */
export function createLensFlare(x: number, y: number, z: number, xScale: number, zScale: number, boxTexture: string): void {
	// 创建平面几何体
	const geometry = new THREE.PlaneBufferGeometry(xScale, zScale);

	// 加载纹理
	const texture = loadTexture(boxTexture);

	// 创建材质
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true,
		opacity: LENS_FLARE_CONFIG.opacity,
	});
	material.depthWrite = true;
	material.depthTest = true;

	// 创建网格对象
	lensFlareObject = new THREE.Mesh(geometry, material);
	lensFlareObject.position.set(x, y, z);
	lensFlareObject.renderOrder = LENS_FLARE_CONFIG.renderOrder;
	lensFlareObject.receiveShadow = true;

	scene.add(lensFlareObject);
}

/**
 * 创建背景粒子系统
 *
 * 创建大量简单的点粒子，用于背景效果
 */
export function addParticles(): void {
	// 创建几何体（使用已废弃的 Geometry，但为了兼容性保留）
	const geometry = new (THREE as any).Geometry();

	// 生成粒子顶点
	for (let i = 0; i < PARTICLES_CONFIG.backgroundCount; i++) {
		const vertex = new THREE.Vector3();
		vertex.x = getRandomArbitrary(PARTICLES_CONFIG.backgroundRange.x.min, PARTICLES_CONFIG.backgroundRange.x.max);
		vertex.y = getRandomArbitrary(PARTICLES_CONFIG.backgroundRange.y.min, PARTICLES_CONFIG.backgroundRange.y.max);
		vertex.z = getRandomArbitrary(PARTICLES_CONFIG.backgroundRange.z.min, PARTICLES_CONFIG.backgroundRange.z.max);
		geometry.vertices.push(vertex);
	}

	// 创建点材质和点系统
	const material = new THREE.PointsMaterial({
		size: PARTICLES_CONFIG.backgroundSize,
	});
	particleSystemObject = new THREE.Points(geometry, material);

	scene.add(particleSystemObject);
}

/**
 * 生成星系效果
 *
 * 创建一个包含大量粒子的星系，使用自定义着色器渲染
 */
export const generateGalaxy = (): void => {
	const parameters: GalaxyParameters = {
		count: GAMEPLAY_CONFIG.galaxy.count,
		size: GAMEPLAY_CONFIG.galaxy.size,
		radius: GAMEPLAY_CONFIG.galaxy.radius,
		branches: GAMEPLAY_CONFIG.galaxy.branches,
		spin: GAMEPLAY_CONFIG.galaxy.spin,
		randomnessPower: GAMEPLAY_CONFIG.galaxy.randomnessPower,
		insideColor: GAMEPLAY_CONFIG.galaxy.insideColor,
		outsideColor: GAMEPLAY_CONFIG.galaxy.outsideColor,
		randomness: GAMEPLAY_CONFIG.galaxy.randomness,
	};

	// 清理旧的星系（如果存在）
	if (galaxyPoints !== null) {
		galaxyPoints.geometry.dispose();
		if (galaxyMaterial) {
			galaxyMaterial.dispose();
		}
		scene.remove(galaxyPoints);
	}

	/**
	 * 创建几何体
	 */
	const geometry = new THREE.BufferGeometry();

	// 创建缓冲区数组
	const positions = new Float32Array(parameters.count * 3);
	const randomness = new Float32Array(parameters.count * 3);
	const colors = new Float32Array(parameters.count * 3);
	const scales = new Float32Array(parameters.count * 1);

	// 创建颜色对象
	const insideColor = new THREE.Color(parameters.insideColor);
	const outsideColor = new THREE.Color(parameters.outsideColor);

	// 生成粒子数据
	for (let i = 0; i < parameters.count; i++) {
		const i3 = i * 3;

		// 计算位置
		const radius = Math.random() * parameters.radius;
		const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

		// 计算随机偏移
		const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
		const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
		const randomZ =
			Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius +
			GALAXY_POSITION_CONFIG.zOffset;

		// 设置基础位置（圆形分布）
		positions[i3] = Math.cos(branchAngle) * radius;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = Math.sin(branchAngle) * radius;

		// 设置随机偏移
		randomness[i3] = randomX;
		randomness[i3 + 1] = randomY;
		randomness[i3 + 2] = randomZ;

		// 计算颜色（从内部到外部渐变）
		const mixedColor = insideColor.clone();
		mixedColor.lerp(outsideColor, radius / parameters.radius);

		colors[i3] = mixedColor.r;
		colors[i3 + 1] = mixedColor.g;
		colors[i3 + 2] = mixedColor.b;

		// 设置随机缩放
		scales[i] = Math.random();
	}

	// 设置几何体属性
	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
	geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
	geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomness, 3));

	/**
	 * 创建材质
	 */
	galaxyMaterial = new THREE.ShaderMaterial({
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
		vertexShader: galaxyVertexShader,
		fragmentShader: galaxyFragmentShader,
		uniforms: {
			uTime: { value: 0 },
			uSize: { value: 30 * renderer.getPixelRatio() },
		},
	});

	/**
	 * 创建点云对象
	 */
	galaxyPoints = new THREE.Points(geometry, galaxyMaterial);
	galaxyPoints.position.y = GALAXY_POSITION_CONFIG.yOffset;
	scene.add(galaxyPoints);
};

/**
 * 更新粒子动画
 *
 * 每帧调用，更新粒子系统、镜头光晕和发光粒子的动画状态
 */
export function moveParticles(): void {
	// 旋转粒子系统
	particleSystemObject.rotation.z += PARTICLE_ANIMATION_CONFIG.particleSystemRotationSpeed;

	// 旋转镜头光晕
	lensFlareObject.rotation.z += PARTICLE_ANIMATION_CONFIG.lensFlareRotationSpeed;

	// 移动镜头光晕
	if (lensFlareObject.position.x < PARTICLE_ANIMATION_CONFIG.lensFlareBounds.x.max) {
		lensFlareObject.position.x += PARTICLE_ANIMATION_CONFIG.lensFlareMoveSpeed.x;
		lensFlareObject.position.y += PARTICLE_ANIMATION_CONFIG.lensFlareMoveSpeed.y;
	} else {
		// 重置位置
		lensFlareObject.position.x = PARTICLE_ANIMATION_CONFIG.lensFlareBounds.x.min;
		lensFlareObject.position.y = PARTICLE_ANIMATION_CONFIG.lensFlareBounds.y.default;
	}

	// 更新发光粒子动画
	const time = PARTICLE_ANIMATION_CONFIG.glowingParticlesTimeMultiplier * clock.getElapsedTime();

	for (let c = 0; c < particleGroup.children.length; c++) {
		const sprite = particleGroup.children[c] as THREE.Sprite;

		// 计算脉冲系数（基于正弦波）
		const a = particleAttributes.randomness[c] + PARTICLE_ANIMATION_CONFIG.glowingParticlesPulse.randomnessOffset;
		const pulseFactor =
			Math.sin(a * time) * PARTICLE_ANIMATION_CONFIG.glowingParticlesPulse.amplitude + PARTICLE_ANIMATION_CONFIG.glowingParticlesPulse.base;

		// 更新位置（基于初始位置和脉冲系数）
		const startPos = particleAttributes.startPosition[c];
		sprite.position.x = startPos.x * pulseFactor;
		sprite.position.y = startPos.y * pulseFactor * PARTICLE_ANIMATION_CONFIG.glowingParticlesPulse.yMultiplier;
		sprite.position.z = startPos.z * pulseFactor;
	}

	// 旋转整个粒子组
	particleGroup.rotation.y = time * PARTICLE_ANIMATION_CONFIG.particleGroupRotationSpeed;
}
