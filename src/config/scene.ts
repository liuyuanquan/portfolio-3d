/**
 * 场景配置常量
 * 使用 as const 确保类型安全，并通过 typeof 导出类型
 */
export const SCENE_CONFIG = {
	// 场景背景色
	backgroundColor: 0x000000,

	// 相机配置
	camera: {
		fov: 45,
		near: 1,
		far: 5000,
		initialPosition: {
			x: 0,
			y: 30,
			z: 70,
		},
	},

	// 半球光配置
	hemisphereLight: {
		color: 0xffffff,
		groundColor: 0xffffff,
		intensity: 0.1,
		colorHSL: { h: 0.6, s: 0.6, l: 0.6 },
		groundColorHSL: { h: 0.1, s: 1, l: 0.4 },
		position: { x: 0, y: 50, z: 0 },
	},

	// 方向光配置
	directionalLight: {
		color: 0xffffff,
		intensity: 0.7,
		colorHSL: { h: 0.1, s: 1, l: 0.95 },
		position: { x: -10, y: 100, z: 50 },
		multiplyScalar: 100,
		castShadow: true,
		shadow: {
			mapSize: {
				width: 4096,
				height: 4096,
			},
			camera: {
				left: -200,
				right: 200,
				top: 200,
				bottom: -200,
				far: 15000,
			},
		},
	},

	// 渲染器配置
	renderer: {
		antialias: true,
		outputEncoding: "sRGBEncoding", // THREE.sRGBEncoding
		shadowMap: {
			enabled: true,
		},
	},
} as const;

/**
 * 场景配置类型
 * 从常量自动推导类型，无需手动定义接口
 */
export type SceneConfig = typeof SCENE_CONFIG;
