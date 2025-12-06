/**
 * 游戏玩法配置常量
 */
export const GAMEPLAY_CONFIG = {
	// 球体移动配置
	ballMovement: {
		scalingFactor: 20,
		groundThreshold: 2.01,
		airMovementY: -0.25,
	},

	// 渲染循环配置
	renderLoop: {
		galaxyTimeOffset: 150,
		galaxyTimeMultiplier: 5,
	},

	// 粒子系统配置
	particles: {
		total: 50,
		radiusRange: 4,
		spriteScale: { x: 0.5, y: 0.5, z: 1.0 },
		materialColor: 0xffffff,
		texture: "img/spark.png",
	},

	// 星系配置
	galaxy: {
		count: 50000,
		size: 0.005,
		radius: 100,
		branches: 3,
		spin: 1,
		randomnessPower: 3,
		randomness: 0.2,
		insideColor: "#ff6030",
		outsideColor: "#1b3984",
		timeOffset: 150,
		timeMultiplier: 5,
	},
} as const;

/**
 * 游戏玩法配置类型
 */
export type GameplayConfig = typeof GAMEPLAY_CONFIG;

/**
 * 区域边界定义
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

export type AreaBounds = typeof AREA_BOUNDS;
