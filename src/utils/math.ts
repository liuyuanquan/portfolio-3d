/**
 * 数学工具函数模块
 * 提供常用的数学计算工具函数
 */

/**
 * 生成指定范围内的随机数
 * 生成一个在 [min, max) 范围内的随机浮点数
 * @param min - 最小值（包含）
 * @param max - 最大值（不包含）
 * @returns 随机数
 */
export function getRandomArbitrary(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}

/**
 * 生成指定范围内的随机整数
 * 生成一个在 [min, max] 范围内的随机整数
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @returns 随机整数
 */
export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 将值限制在指定范围内
 * @param value - 要限制的值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 限制后的值
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
