/**
 * 纹理加载辅助函数
 * 统一处理纹理加载，避免 WebGL 纹理大小调整警告
 */
import * as THREE from "three";

/**
 * 纹理加载选项
 */
export interface TextureLoadOptions {
	/** 是否生成 mipmaps，默认 false */
	generateMipmaps?: boolean;
	/** 最小过滤模式，默认 THREE.LinearFilter */
	minFilter?: THREE.TextureFilter;
	/** 最大过滤模式，默认 THREE.LinearFilter */
	magFilter?: THREE.TextureFilter;
	/** 各向异性过滤，默认 1 */
	anisotropy?: number;
	/** S 轴纹理包裹模式，默认 THREE.ClampToEdgeWrapping */
	wrapS?: THREE.Wrapping;
	/** T 轴纹理包裹模式，默认 THREE.ClampToEdgeWrapping */
	wrapT?: THREE.Wrapping;
}

/**
 * 应用纹理选项到纹理对象
 * @param texture - 纹理对象
 * @param options - 配置选项
 */
function applyTextureOptions(
	texture: THREE.Texture,
	options: {
		generateMipmaps: boolean;
		minFilter: THREE.TextureFilter;
		magFilter: THREE.TextureFilter;
		anisotropy: number;
		wrapS: THREE.Wrapping;
		wrapT: THREE.Wrapping;
	}
): void {
	texture.generateMipmaps = options.generateMipmaps;
	texture.minFilter = options.minFilter;
	texture.magFilter = options.magFilter;
	texture.anisotropy = options.anisotropy;
	texture.wrapS = options.wrapS;
	texture.wrapT = options.wrapT;
}

/**
 * 加载纹理并配置参数以避免大小调整警告
 * @param loader - TextureLoader 实例
 * @param url - 纹理 URL
 * @param options - 配置选项
 * @returns 加载的纹理
 */
export function loadTexture(
	loader: THREE.TextureLoader,
	url: string,
	options: TextureLoadOptions = {}
): THREE.Texture {
	const {
		generateMipmaps = false,
		minFilter = THREE.LinearFilter,
		magFilter = THREE.LinearFilter,
		anisotropy = 1,
		wrapS = THREE.ClampToEdgeWrapping,
		wrapT = THREE.ClampToEdgeWrapping,
	} = options;

	const textureOptions = {
		generateMipmaps,
		minFilter,
		magFilter,
		anisotropy,
		wrapS,
		wrapT,
	};

	const texture = loader.load(
		url,
		// onLoad 回调：纹理加载完成后设置属性
		(loadedTexture: THREE.Texture) => {
			applyTextureOptions(loadedTexture, textureOptions);
			// 强制更新纹理，确保设置生效
			loadedTexture.needsUpdate = true;
		},
		// onProgress 回调（可选）
		undefined,
		// onError 回调（可选）
		undefined
	);

	// 立即设置属性（确保纹理对象在返回时就有正确的属性，即使 onLoad 还未执行）
	// 这对于未缓存的纹理很重要，因为调用者可能会立即使用纹理对象
	applyTextureOptions(texture, textureOptions);

	return texture;
}
