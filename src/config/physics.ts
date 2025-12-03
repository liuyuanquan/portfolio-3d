/**
 * 物理引擎配置常量
 * 使用 as const 确保类型安全，并通过 typeof 导出类型
 */
export const PHYSICS_CONFIG = {
	// 重力配置
	gravity: {
		x: 0,
		y: -50,
		z: 0,
	},

	// 碰撞形状边距
	collisionMargin: 0.05,

	// 默认质量（0 表示静态物体）
	defaultMass: {
		static: 0,
		ball: 3,
		beachBall: 20,
		brick: 0.1,
	},

	// 摩擦系数
	friction: {
		plane: 10,
		rolling: 10,
		ball: 10,
		beachBall: 1,
	},

	// 物理状态
	state: {
		DISABLE_DEACTIVATION: 4,
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

