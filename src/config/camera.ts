/**
 * 相机配置模块
 * 管理相机跟随和区域边界配置
 *
 * 功能：
 * - 相机位置偏移配置
 * - 场景区域边界定义
 */

/**
 * 相机位置配置
 */
export const CAMERA_CONFIG = {
	// 区域 1：项目展示区域
	area1: {
		offsetY: 50,
		offsetZ: 40,
	},
	// 区域 2：技能展示区域
	area2: {
		offsetY: 50,
		offsetZ: 40,
	},
	// 区域 3：后方区域
	area3: {
		offsetY: 10,
		offsetZ: 40,
	},
	// 默认位置
	default: {
		offsetY: 30,
		offsetZ: 60,
	},
	// 相机插值速度（0-1，值越大移动越快）
	lerpSpeed: 0.033,
} as const;

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

/**
 * 相机配置类型
 */
export type CameraConfig = typeof CAMERA_CONFIG;
export type AreaBounds = typeof AREA_BOUNDS;

