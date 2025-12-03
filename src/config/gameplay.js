/**
 * 游戏玩法配置
 */
export const GAMEPLAY_CONFIG = {
	// 球体移动配置
	ballMovement: {
		scalingFactor: 20,
		groundThreshold: 2.01,
		airMovementY: -0.25,
	},

	// 球体掉落阈值
	ballFallThreshold: -50,

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

	// 镜头光晕配置
	lensFlare: {
		defaultScale: { x: 0.1, y: 0.1, z: 0.1 },
		mass: 0,
	},
};
