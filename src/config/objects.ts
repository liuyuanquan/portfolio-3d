/**
 * 对象默认配置常量
 * 使用 as const 确保类型安全，并通过 typeof 导出类型
 */
export const OBJECTS_CONFIG = {
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
