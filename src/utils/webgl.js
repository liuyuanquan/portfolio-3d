/**
 * WebGL 检测工具
 * 检测浏览器是否支持 WebGL 渲染上下文
 */

/**
 * 检测浏览器是否支持 WebGL
 *
 * 方法说明：
 * 1. 检查 window.WebGLRenderingContext 是否存在
 * 2. 创建临时 canvas 元素并尝试获取 WebGL 上下文
 * 3. 如果成功获取上下文，说明浏览器支持 WebGL
 *
 * 注意：不再检查 experimental-webgl，因为：
 * - 所有现代浏览器都支持标准 webgl 上下文
 * - experimental-webgl 是早期浏览器的临时实现，现已废弃
 *
 * @returns {boolean} 是否支持 WebGL
 */
export function isWebGLAvailable() {
	// 首先检查 WebGLRenderingContext 是否存在
	if (!window.WebGLRenderingContext) {
		return false;
	}

	try {
		// 创建临时 canvas 元素
		const canvas = document.createElement("canvas");

		// 尝试获取 WebGL 上下文
		// 如果浏览器不支持 WebGL，getContext 会返回 null
		const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");

		// 检查是否成功获取上下文
		return gl !== null;
	} catch (e) {
		// 如果发生任何错误，说明不支持 WebGL
		return false;
	}
}
