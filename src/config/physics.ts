/**
 * 物理引擎配置常量
 * 使用 as const 确保类型安全，并通过 typeof 导出类型
 */
export const PHYSICS_CONFIG = {
	// 碰撞形状边距
	collisionMargin: 0.05,

	// 默认质量（0 表示静态物体）
	defaultMass: {
		static: 0,
	},

	// 碰撞标志
	collisionFlags: {
		static: 2,
	},
} as const;

/**
 * 物理引擎配置类型
 * 从常量自动推导类型，无需手动定义接口
 */
export type PhysicsConfig = typeof PHYSICS_CONFIG;
