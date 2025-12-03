/**
 * 纹理加载辅助函数
 * 统一处理纹理加载，避免 WebGL 纹理大小调整警告
 */
import * as THREE from "three";

/**
 * 加载纹理并配置参数以避免大小调整警告
 * @param {THREE.TextureLoader} loader - TextureLoader 实例
 * @param {string} url - 纹理 URL
 * @param {Object} options - 配置选项
 * @param {boolean} options.generateMipmaps - 是否生成 mipmaps，默认 false
 * @param {number} options.minFilter - 最小过滤模式，默认 THREE.LinearFilter
 * @param {number} options.magFilter - 最大过滤模式，默认 THREE.LinearFilter
 * @returns {THREE.Texture} 加载的纹理
 */
export function loadTexture(loader, url, options = {}) {
	const {
		generateMipmaps = false,
		minFilter = THREE.LinearFilter,
		magFilter = THREE.LinearFilter,
	} = options;

	const texture = loader.load(
		url,
		// onLoad 回调：纹理加载完成后设置属性
		(texture) => {
			// 禁用 mipmap 生成，避免纹理大小调整警告
			texture.generateMipmaps = generateMipmaps;
			texture.minFilter = minFilter;
			texture.magFilter = magFilter;
			// 使用 ClampToEdgeWrapping 可以避免某些情况下的大小调整
			texture.wrapS = THREE.ClampToEdgeWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;
			// 强制更新纹理，确保设置生效
			texture.needsUpdate = true;
		},
		// onProgress 回调（可选）
		undefined,
		// onError 回调（可选）
		undefined
	);

	// 立即设置属性（对于已缓存的纹理）
	texture.generateMipmaps = generateMipmaps;
	texture.minFilter = minFilter;
	texture.magFilter = magFilter;
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;

	return texture;
}

