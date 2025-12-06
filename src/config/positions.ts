/**
 * 场景对象位置配置常量
 * 使用 as const 确保类型安全，并通过 typeof 导出类型
 */
export const POSITIONS_CONFIG = {
	// 项目展示区域位置
	createProjectsSection: {
		x: 16.2,
		y: 1,
		z: -20,
	},
} as const;

/**
 * 位置配置类型
 * 从常量自动推导类型，无需手动定义接口
 */
export type PositionsConfig = typeof POSITIONS_CONFIG;
