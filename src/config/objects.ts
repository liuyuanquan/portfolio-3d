/**
 * 对象默认配置常量
 * 使用 as const 确保类型安全，并通过 typeof 导出类型
 */
export const OBJECTS_CONFIG = {
	// 盒子配置
	box: {
		defaultScale: { x: 4, y: 4, z: 1 },
		defaultColor: 0x000000,
		defaultTransparent: true,
	},

	// 文字配置
	text: {
		floyd: {
			text: "0xFloyd",
			color: 0xfffc00,
			size: 3,
			height: 0.5,
			position: { x: 0, y: 0.1, z: -20 },
			geometry: {
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.1,
				bevelSize: 0.11,
				bevelOffset: 0,
				bevelSegments: 1,
			},
			translateX: -0.15,
		},
		engineer: {
			text: "SOFTWARE ENGINEER",
			color: 0x00ff08,
			size: 1.5,
			height: 0.5,
			position: { x: 24, y: 0.1, z: -20 },
			geometry: {
				curveSegments: 20,
				bevelEnabled: true,
				bevelThickness: 0.25,
				bevelSize: 0.1,
			},
			translateX: -0.5,
		},
		font: "json/Roboto_Regular.json",
	},

	// 三角形配置
	triangle: {
		vertices: [
			{ x: 4, y: 0, z: 0 },
			{ x: 5, y: 0, z: 0 },
			{ x: 4.5, y: 1, z: 0 },
		],
		color: 0xffffff,
		rotationX: -Math.PI * 0.5,
		positionY: 0.01,
	},
} as const;

/**
 * 对象配置类型
 * 从常量自动推导类型，无需手动定义接口
 */
export type ObjectsConfig = typeof OBJECTS_CONFIG;
