/**
 * 检测是否为触摸设备
 * @returns 如果设备支持触摸，返回 true；否则返回 false
 */
export function isTouchscreenDevice(): boolean {
	if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) {
		return true;
	}

	if (typeof window !== "undefined" && window.matchMedia) {
		const matchMedia = window.matchMedia("(pointer: coarse)");
		if (matchMedia.matches) {
			return true;
		}
	}

	if ("ontouchstart" in window) {
		return true;
	}

	if ("msPointerEnabled" in window.navigator && (window.navigator as any).msPointerEnabled) {
		return true;
	}

	if ("ontouchstart" in document.documentElement) {
		return true;
	}

	return false;
}
