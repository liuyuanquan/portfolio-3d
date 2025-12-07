import * as THREE from "three";

/**
 * 默认纹理选项
 */
export const DEFAULT_TEXTURE_OPTIONS: TextureOptions = {
	generateMipmaps: false,
	minFilter: THREE.LinearFilter,
	magFilter: THREE.LinearFilter,
	anisotropy: 1,
	wrapS: THREE.ClampToEdgeWrapping,
	wrapT: THREE.ClampToEdgeWrapping,
	encoding: THREE.sRGBEncoding,
	repeat: { x: 1, y: 1 },
};

/**
 * Portfolio 2020 Configuration
 *
 * 本文件包含了整个3D作品集项目的所有配置常量
 * 配置按照功能模块进行组织，便于维护和理解
 */

// ============================================================================
// 1. CORE GAME OBJECTS 核心游戏对象配置
// ============================================================================

/**
 * 玩家球体配置
 * 定义了玩家控制的主球体的物理属性、外观和运动参数
 */
export const BALL_CONFIG = {
	position: { x: 0, y: 0, z: 0 }, // 初始位置
	radius: 2, // 球体半径
	mass: 3, // 物理质量
	quaternion: { x: 0, y: 0, z: 0, w: 1 }, // 初始旋转四元数
	texture: "earth.jpg", // 纹理贴图文件名
	friction: 10, // 表面摩擦系数
	margin: 0.05, // 碰撞边界裕度
	geometrySegments: 32, // 几何体分段数
	movement: {
		scalingFactor: 20, // 移动缩放因子
		groundThreshold: 2.01, // 接地检测阈值
		airMovementY: -0.25, // 空中移动时的Y轴偏移
	},
} as const;

/**
 * 沙滩球配置
 * 定义了场景中的装饰性沙滩球的物理属性和外观
 */
export const BEACH_BALL_CONFIG = {
	position: { x: 20, y: 30, z: 0 }, // 初始位置
	radius: 3, // 球体半径
	mass: 3, // 物理质量
	quaternion: { x: 0, y: 0, z: 0, w: 1 }, // 初始旋转四元数
	texture: "BeachBallColor.jpg", // 纹理贴图文件名
	friction: 1, // 表面摩擦系数（较低以增加滑动感）
	geometrySegments: 32, // 几何体分段数
} as const;

// ============================================================================
// 2. SCENE ENVIRONMENT 场景环境配置
// ============================================================================

/**
 * 网格平面配置
 * 定义了场景的基础地面网格及其物理属性
 */
export const GRID_PLANE_CONFIG = {
	position: { x: 0, y: -0.25, z: 0 }, // 平面位置（略微下沉以避免z-fighting）
	size: {
		y: 0.5, // Y方向尺寸（厚度）
	},
	mass: 0, // 质量为0表示静态物体
	quaternion: { x: 0, y: 0, z: 0, w: 1 }, // 初始旋转四元数
	friction: 10, // 滑动摩擦系数
	rollingFriction: 10, // 滚动摩擦系数
	grid: {
		cellSize: 5, // 每个网格单元的大小
		cellCount: { x: 35, z: 35 }, // X和Z方向的网格单元数量
		positionY: 0.005, // 网格线在Y轴上的位置
	},
	instructions: {
		touchscreen: "使用虚拟摇杆来移动球",
		keyboard: "使用方向键来移动球",
	},
} as const;

/**
 * 计算后的网格平面配置
 * 基于基础配置计算出实际的X和Z方向尺寸
 */
export const GRID_PLANE_CONFIG_COMPUTED = {
	...GRID_PLANE_CONFIG,
	size: {
		x: GRID_PLANE_CONFIG.grid.cellCount.x * GRID_PLANE_CONFIG.grid.cellSize,
		y: GRID_PLANE_CONFIG.size.y,
		z: GRID_PLANE_CONFIG.grid.cellCount.z * GRID_PLANE_CONFIG.grid.cellSize,
	},
} as const;

/**
 * 边界墙配置
 * 定义了场景四周防止球体掉落的隐形墙体尺寸
 */
export const BOUNDARY_WALLS_CONFIG = {
	size: {
		x: 1, // 墙体在X方向的厚度
		y: 4, // 墙体在Y方向的高度
		z: 1, // 墙体在Z方向的厚度
	},
} as const;

/**
 * 砖墙配置
 * 定义了可破坏的砖墙结构的物理属性和外观
 */
export const BRICK_WALLS_CONFIG = {
	mass: 0.1, // 每块砖的质量
	size: { x: 3, y: 1.5, z: 3 }, // 砖块的尺寸
	count: { x: 6, y: 6 }, // X和Y方向的砖块数量
	/**
	 * 砖墙中心位置计算函数
	 * 根据网格配置计算砖墙的中心位置
	 */
	get center() {
		return { x: -4 * GRID_PLANE_CONFIG_COMPUTED.grid.cellSize, y: 0, z: 0 };
	},
	texture: "stone.png", // 砖块纹理贴图文件名
} as const;

/**
 * 区域边界定义
 * 定义了场景中不同功能区域的空间边界，用于触发不同的交互行为
 */
export const AREA_BOUNDS = {
	// 区域 1：项目展示区域（三个子区域）
	area1: [
		// 子区域 1：右侧项目区域
		{ x: [42, 77], z: [-20, 40] },
		// 子区域 2：左侧项目区域
		{ x: [-Infinity, -2], z: [-Infinity, -28] },
		// 子区域 3：中间项目区域
		{ x: [-70, -25], z: [-10, 40] },
	],
	// 区域 2：技能展示区域
	area2: { x: [-3, 22], z: [31, 58] },
	// 区域 3：后方区域
	area3: { z: [50, Infinity] },
} as const;

// ============================================================================
// 3. USER INTERACTION 用户交互配置
// ============================================================================

/**
 * 输入控制配置
 * 定义了用户控制界面的虚拟摇杆参数
 */
export const INPUT_CONFIG = {
	joystick: {
		mode: "static" as const, // 摇杆模式：固定位置
		position: { left: "50%", top: "50%" }, // 摇杆初始位置
		size: 125, // 摇杆尺寸
		color: "rgba(255, 255, 255, 0.5)", // 摇杆颜色和透明度
		dynamicPage: true, // 是否动态页面
	},
} as const;

/**
 * 链接盒子配置
 * 定义了场景中可点击的社交链接盒子的位置、外观和行为
 */
export const LINK_BOXES_CONFIG = {
	boxes: [
		{
			position: { x: 12, y: 2, z: -70 }, // 盒子位置
			size: { x: 4, y: 4, z: 1 }, // 盒子尺寸
			texture: "GitHub.png", // 盒子表面纹理
			url: "https://github.com/liuyuanquan", // 点击后跳转的链接
			borderColor: 0xffffff, // 边框颜色
			label: {
				position: { x: 11.875, y: 4.5, z: -70 }, // 标签位置
				text: "Github", // 标签文本
			},
		},
		{
			position: { x: 19.5, y: 2, z: -70 },
			size: { x: 4, y: 4, z: 1 },
			texture: "juejin.png",
			url: "https://juejin.cn/user/4089838986602078",
			borderColor: 0x1f80ff,
			label: {
				position: { x: 19.625, y: 4.5, z: -70 },
				text: "稀土掘金",
			},
		},
		{
			position: { x: 27, y: 2, z: -70 },
			size: { x: 4, y: 4, z: 1 },
			texture: "QQ邮箱.png",
			url: "mailto:522703297@qq.com",
			borderColor: 0xf8be32,
			label: {
				position: { x: 26.875, y: 4.5, z: -70 },
				text: "QQ邮箱",
			},
		},
	],
	instructions: {
		lineHeight: 3.5, // 指示文字行高
		positionOffset: { y: 0.01, z: 10 }, // 指示文字位置偏移
		size: 1.5, // 指示文字大小
		touchscreen: ["用手指点击盒子", "打开链接"],
		keyboard: ["用鼠标点击盒子", "打开链接"],
	},
} as const;

/**
 * 项目展示区域配置
 * 定义了项目展示区域的文字标识和外观设置
 */
export const PROJECTS_SECTION_CONFIG = {
	position: {
		x: 16.2,
		y: 1,
		z: -20,
	},
	size: { x: 25, y: 3, z: 2 },
	color: 0xff6600,
	showOutline: false,
	outlineColor: 0xffffff,
	text: {
		name: {
			text: "刘源泉",
			color: 0xfffc00,
			size: 3,
			height: 0.5,
			position: { x: 16.2, y: 0, z: -20 },
			geometry: {
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.1,
				bevelSize: 0.11,
				bevelOffset: 0,
				bevelSegments: 1,
			},
			translateX: -0.5,
		},
		role: {
			text: "前端专家",
			color: 0x00ff08,
			size: 1.5,
			height: 0.5,
			position: { x: 16.2, y: 0, z: -20 },
			geometry: {
				curveSegments: 20,
				bevelEnabled: true,
				bevelThickness: 0.25,
				bevelSize: 0.1,
			},
			translateX: -0.5,
		},
	},
	spacing: 0.5,
} as const;

/**
 * 技能展示区域配置
 * 定义了技能展示区域的背景板和标签设置
 */
export const SKILLS_SECTION_CONFIG = {
	position: { x: 61, y: 0.025, z: 13 }, // 区域位置
	size: { x: 30, y: 60 }, // 区域尺寸
	texture: "activities_text.png", // 背景纹理
	receiveShadow: true, // 是否接收阴影
	label: {
		position: { x: 61, y: 0.01, z: -15 }, // 标签位置
		text: "工作经历", // 标签文本
		size: 3, // 标签文字大小
	},
} as const;

// ============================================================================
// 4. VISUAL EFFECTS 视觉效果配置
// ============================================================================

/**
 * 广告牌配置
 * 定义了项目展示用的广告牌位置、外观和交互设置
 */
export const BILLBOARDS_CONFIG = {
	billboards: [
		{
			position: { x: -80, y: 2.5, z: -70 }, // 广告牌位置
			texture: "project-placeholder.png", // 广告牌纹理（待替换为实际项目截图）
			url: "https://github.com/liuyuanquan/portfolio-3d", // 点击链接
			type: "horizontal" as const, // 广告牌类型
			rotation: Math.PI * 0.22, // 旋转角度
			textPlane: {
				texture: "project-placeholder.png", // 文字面板纹理
				position: { x: -70, y: 0.01, z: -48 }, // 文字面板位置
				size: { x: 15, y: 30 }, // 文字面板尺寸
			},
		},
		{
			position: { x: -45, y: 2.5, z: -78 },
			texture: "project-placeholder.png",
			url: "https://github.com/liuyuanquan/portfolio-3d",
			type: "horizontal" as const,
			rotation: Math.PI * 0.17,
			textPlane: {
				texture: "project-placeholder.png",
				position: { x: -42, y: 0.01, z: -53 },
				size: { x: 15, y: 30 },
			},
		},
		{
			position: { x: -17, y: 1.25, z: -75 },
			texture: "project-placeholder.png",
			url: "https://github.com/liuyuanquan/portfolio-3d",
			type: "vertical" as const,
			rotation: Math.PI * 0.15,
			textPlane: {
				texture: "project-placeholder.png",
				position: { x: -14, y: 0.01, z: -49 },
				size: { x: 15, y: 30 },
			},
		},
	],
	projectsLabel: {
		text: "项目", // 项目标签文本
		size: 3, // 标签文字大小
		positionOffset: { x: 0, y: 0.01, z: 23 }, // 标签位置偏移
		rotateX: true, // 是否绕X轴旋转
	},
} as const;

/**
 * 镜头光晕配置
 * 定义了场景中的镜头光晕效果参数
 */
export const LENS_FLARE_CONFIG = {
	position: { x: 50, y: -50, z: -800 }, // 光晕位置
	size: { x: 200, y: 200 }, // 光晕尺寸
	texture: "lensflare0.png", // 光晕纹理
	opacity: 0.9, // 透明度
	rotateX: false, // 是否绕X轴旋转
	receiveShadow: true, // 是否接收阴影
	animation: {
		rotationSpeed: 0.0002, // 旋转速度
		moveSpeed: {
			x: 0.025, // X轴移动速度
			y: -0.001, // Y轴移动速度
		},
		bounds: {
			x: { min: -750, max: 750 }, // X轴移动边界
			y: { default: -50 }, // Y轴默认位置
		},
	},
} as const;

/**
 * 星系配置
 * 定义了背景星系的粒子效果参数
 */
export const GALAXY_CONFIG = {
	count: 50000, // 粒子数量
	size: 0.005, // 粒子尺寸
	radius: 100, // 星系半径
	branches: 3, // 螺旋臂数量
	spin: 1, // 自旋程度
	randomnessPower: 3, // 随机分布幂次
	randomness: 0.2, // 随机分布系数
	insideColor: "#ff6030", // 内部颜色
	outsideColor: "#1b3984", // 外部颜色
	position: {
		yOffset: -50, // Y轴偏移
		zOffset: -50, // Z轴偏移
	},
	animation: {
		timeOffset: 150, // 时间偏移
		timeMultiplier: 5, // 时间倍数
	},
} as const;

/**
 * 粒子系统配置
 * 定义了场景中的各种粒子效果参数
 */
export const PARTICLES_CONFIG = {
	background: {
		count: 3000, // 背景粒子数量
		size: 3, // 背景粒子尺寸
		range: {
			x: { min: -1100, max: 1100 }, // X轴范围
			y: { min: -1100, max: 1100 }, // Y轴范围
			z: { min: -1100, max: -500 }, // Z轴范围
		},
	},
	glowing: {
		position: { x: -1, y: 7, z: 45 }, // 发光粒子位置
	},
	animation: {
		particleSystemRotationSpeed: 0.0003, // 粒子系统旋转速度
		lensFlareRotationSpeed: 0.0002, // 光晕旋转速度
		lensFlareMoveSpeed: {
			x: 0.025, // 光晕X轴移动速度
			y: -0.001, // 光晕Y轴移动速度
		},
		lensFlareBounds: {
			x: { min: -750, max: 750 }, // 光晕X轴移动边界
			y: { default: -50 }, // 光晕Y轴默认位置
		},
		glowingParticlesTimeMultiplier: 7, // 发光粒子时间倍数
		glowingParticlesPulse: {
			randomnessOffset: 0.75, // 脉冲随机偏移
			amplitude: 0.1, // 脉冲幅度
			base: 0.9, // 脉冲基准值
			yMultiplier: 1.5, // Y轴倍数
		},
		particleGroupRotationSpeed: 0.75, // 粒子组旋转速度
	},
} as const;

/**
 * 游戏玩法配置常量
 * 定义了游戏中使用的粒子系统参数
 */
export const GAMEPLAY_CONFIG = {
	particles: {
		total: 50, // 粒子总数
		radiusRange: 4, // 粒子半径范围
		spriteScale: { x: 0.5, y: 0.5, z: 1.0 }, // 精灵缩放
		materialColor: 0xffffff, // 材质颜色
		texture: "spark.png", // 纹理文件名
	},
} as const;

// ============================================================================
// 5. CAMERA 相机配置
// ============================================================================

/**
 * 相机配置
 * 定义了相机的视角参数和不同区域的跟随设置
 */
export const CAMERA_CONFIG = {
	fov: 45, // 视野角度
	near: 1, // 近裁剪面
	far: 5000, // 远裁剪面
	initialPosition: { x: 0, y: 30, z: 70 }, // 初始位置
	area1: {
		offsetY: 50, // 区域1 Y轴偏移
		offsetZ: 40, // 区域1 Z轴偏移
	},
	area2: {
		offsetY: 50, // 区域2 Y轴偏移
		offsetZ: 40, // 区域2 Z轴偏移
	},
	area3: {
		offsetY: 10, // 区域3 Y轴偏移
		offsetZ: 40, // 区域3 Z轴偏移
	},
	default: {
		offsetY: 30, // 默认 Y轴偏移
		offsetZ: 60, // 默认 Z轴偏移
	},
	lerpSpeed: 0.033, // 插值速度
} as const;

// ============================================================================
// 6. RESOURCE MANAGEMENT 资源管理配置
// ============================================================================

/**
 * 资源管理器配置
 * 定义了项目所需的各种资源文件路径
 */
export const RESOURCE_CONFIG = {
	baseUrl: (import.meta.env as any).BASE_URL as string, // 基础URL路径
	defaultFontPath: `${(import.meta.env as any).BASE_URL}json/SourceHanSerifSCVF_Regular.json`, // 默认字体路径
	preloadTextures: [
		`${(import.meta.env as any).BASE_URL}img/earth.jpg`, // 玩家球体纹理
		`${(import.meta.env as any).BASE_URL}img/BeachBallColor.jpg`, // 沙滩球纹理
		`${(import.meta.env as any).BASE_URL}img/stone.png`, // 砖墙纹理
		`${(import.meta.env as any).BASE_URL}img/woodTexture.jpg`, // 广告牌背景纹理
		`${(import.meta.env as any).BASE_URL}img/project-placeholder.png`, // 项目占位图
		`${(import.meta.env as any).BASE_URL}img/lensflare0.png`, // 镜头光晕纹理
		`${(import.meta.env as any).BASE_URL}img/spark.png`, // 粒子火花纹理
	],
} as const;
