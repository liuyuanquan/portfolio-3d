/**
 * 对象默认配置常量
 * 使用 as const 确保类型安全，并通过 typeof 导出类型
 */
export const OBJECTS_CONFIG = {
	// 球体配置
	ball: {
		position: { x: 8.75, y: 0, z: 0 },
		radius: 2,
		mass: 3,
		quaternion: { x: 0, y: 0, z: 0, w: 1 },
		texture: "img/earth.jpg",
		geometry: {
			widthSegments: 32,
			heightSegments: 32,
		},
	},

	// 沙滩球配置
	beachBall: {
		position: { x: 20, y: 30, z: 0 },
		radius: 2,
		mass: 20,
		quaternion: { x: 0, y: 0, z: 0, w: 1 },
		texture: "img/BeachBallColor.jpg",
		geometry: {
			widthSegments: 32,
			heightSegments: 32,
		},
	},

	// 平面配置
	plane: {
		position: { x: 0, y: -0.25, z: 0 },
		scale: { x: 175, y: 0.5, z: 175 },
		mass: 0,
		quaternion: { x: 0, y: 0, z: 0, w: 1 },
		size: 175,
		divisions: 20,
		grid: {
			color1: 0xffffff,
			color2: 0xffffff,
			opacity: 0.5,
			positionY: 0.005,
		},
		material: {
			color: 0xffffff,
			opacity: 0.25,
			transparent: true,
		},
	},

	// 墙壁配置
	wall: {
		x: {
			scale: { x: 0.125, y: 4, z: 175 },
			material: {
				color: 0xffffff,
				opacity: 0.75,
				transparent: true,
			},
		},
		z: {
			scale: { x: 175, y: 4, z: 0.125 },
			material: {
				color: 0xffffff,
				opacity: 0.75,
				transparent: true,
			},
		},
	},

	// 广告牌配置
	billboard: {
		horizontal: {
			poleScale: { x: 1, y: 5, z: 1 },
			signScale: { x: 30, y: 15, z: 1 },
			signOffsetY: 10,
		},
		vertical: {
			poleScale: { x: 1, y: 2.5, z: 1 },
			signScale: { x: 15, y: 20, z: 1 },
			signOffsetY: 11.25,
		},
		borderColor: 0x000000,
	},

	// 盒子配置
	box: {
		defaultScale: { x: 4, y: 4, z: 1 },
		defaultColor: 0x000000,
		defaultTransparent: true,
	},

	// 砖块配置
	brick: {
		mass: 0.1,
		length: 3,
		depth: 3,
		height: 1.5,
		rows: 6,
		bricksPerRow: 6,
		startPosition: { x: 70, y: 0, z: -60 },
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
