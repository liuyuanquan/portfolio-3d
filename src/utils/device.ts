/**
 * 设备检测工具函数模块
 * 提供设备类型和功能检测相关的工具函数
 */

/**
 * 检测是否为触摸设备
 *
 * 使用多种方法检测设备是否支持触摸，按优先级排序：
 * 1. navigator.maxTouchPoints（最现代和推荐的方法）
 * 2. window.matchMedia('(pointer: coarse)')（CSS 媒体查询 API）
 * 3. 'ontouchstart' in window（传统方法，兼容旧浏览器）
 * 4. navigator.msPointerEnabled（Windows 8 兼容）
 * @returns 如果设备支持触摸，返回 true；否则返回 false
 *
 */
export function isTouchscreenDevice(): boolean {
	// 方法 1：使用 navigator.maxTouchPoints（最现代和推荐）
	// maxTouchPoints > 0 表示设备支持触摸
	if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) {
		return true;
	}

	// 方法 2：使用 CSS 媒体查询（pointer: coarse 表示触摸设备）
	if (typeof window !== "undefined" && window.matchMedia) {
		const matchMedia = window.matchMedia("(pointer: coarse)");
		if (matchMedia.matches) {
			return true;
		}
	}

	// 方法 3：检查 ontouchstart 事件（传统方法，兼容旧浏览器）
	if ("ontouchstart" in window) {
		return true;
	}

	// 方法 4：Windows 8 兼容性检查
	if (
		"msPointerEnabled" in window.navigator &&
		(window.navigator as any).msPointerEnabled
	) {
		return true;
	}

	// 方法 5：检查 document.documentElement（最后的兼容性检查）
	if ("ontouchstart" in document.documentElement) {
		return true;
	}

	return false;
}
