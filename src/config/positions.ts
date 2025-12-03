/**
 * 场景对象位置配置常量
 * 使用 as const 确保类型安全，并通过 typeof 导出类型
 */
export const POSITIONS_CONFIG = {
	// 墙壁位置
	walls: {
		x: [
			{ x: 87.5, y: 1.75, z: 0 },
			{ x: -87.5, y: 1.75, z: 0 },
		],
		z: [
			{ x: 0, y: 1.75, z: 87.5 },
			{ x: 0, y: 1.75, z: -87.5 },
		],
	},

	// 广告牌位置
	billboards: {
		terpSolutions: {
			x: -80,
			y: 2.5,
			z: -70,
			rotation: Math.PI * 0.22,
		},
		bagHolderBets: {
			x: -45,
			y: 2.5,
			z: -78,
			rotation: Math.PI * 0.17,
		},
		homeSweetHome: {
			x: -17,
			y: 1.25,
			z: -75,
			rotation: Math.PI * 0.15,
		},
	},

	// 文字盒子位置
	floydWords: {
		x: 16.2,
		y: 1,
		z: -20,
	},

	// 文本平面位置
	textPlanes: {
		terpSolutions: { x: -70, y: 0.01, z: -48, width: 20, height: 40 },
		bagholderBets: { x: -42, y: 0.01, z: -53, width: 20, height: 40 },
		homeSweetHome: { x: -14, y: 0.01, z: -49, width: 20, height: 40 },
	},

	// 链接盒子位置
	linkBoxes: {
		github: { x: 12, y: 2, z: -70 },
		twitter: { x: 19, y: 2, z: -70 },
		mail: { x: 27, y: 2, z: -70 },
		writing: { x: 35, y: 2, z: -70 },
	},

	// 浮动标签位置
	floatingLabels: {
		github: { x: 11.875, y: 4.5, z: -70 },
		twitter: { x: 19.125, y: 4.5, z: -70 },
		email: { x: 26.875, y: 4.5, z: -70 },
		writing: { x: 35, y: 6.5, z: -70 },
	},

	// 技能区域位置
	skillsSection: {
		x: 61,
		y: 0.025,
		z: 13,
		width: 30,
		height: 60,
	},

	// 镜头光晕位置
	lensFlare: {
		x: 50,
		y: -50,
		z: -800,
		xScale: 200,
		zScale: 200,
	},

	// 简单文本位置
	simpleText: {
		instructions: { x: 9, y: 0.01, z: 5, size: 1.25 },
		touchText: { x: 23, y: 0.01, z: -60, size: 1.5 },
		projects: { x: -42, y: 0.01, z: -30, size: 3 },
		timeline: { x: 61, y: 0.01, z: -15, size: 3 },
	},

	// 三角形位置
	triangles: [
		{ x: 63, z: -55 },
		{ x: 63, z: -51 },
		{ x: 63, z: -47 },
		{ x: 63, z: -43 },
	],
} as const;

/**
 * 位置配置类型
 * 从常量自动推导类型，无需手动定义接口
 */
export type PositionsConfig = typeof POSITIONS_CONFIG;

