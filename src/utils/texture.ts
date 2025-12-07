import * as THREE from "three";
import { RESOURCE_CONFIG, DEFAULT_TEXTURE_OPTIONS } from "../config";

/**
 * 应用纹理选项到纹理对象
 */
export function applyTextureOptions(texture: THREE.Texture, options: TextureOptions): void {
	texture.generateMipmaps = options.generateMipmaps;
	texture.minFilter = options.minFilter;
	texture.magFilter = options.magFilter;
	texture.anisotropy = options.anisotropy;
	texture.wrapS = options.wrapS;
	texture.wrapT = options.wrapT;
	texture.encoding = options.encoding;
	texture.repeat.set(options.repeat.x, options.repeat.y);
}

/**
 * 创建纹理选项对象
 * 将可选的 TextureLoadOptions 转换为完整的 TextureOptions
 */
export function createTextureOptions(options: TextureLoadOptions = {}): TextureOptions {
	return {
		generateMipmaps: options.generateMipmaps ?? DEFAULT_TEXTURE_OPTIONS.generateMipmaps,
		minFilter: options.minFilter ?? DEFAULT_TEXTURE_OPTIONS.minFilter,
		magFilter: options.magFilter ?? DEFAULT_TEXTURE_OPTIONS.magFilter,
		anisotropy: options.anisotropy ?? DEFAULT_TEXTURE_OPTIONS.anisotropy,
		wrapS: options.wrapS ?? DEFAULT_TEXTURE_OPTIONS.wrapS,
		wrapT: options.wrapT ?? DEFAULT_TEXTURE_OPTIONS.wrapT,
		encoding: options.encoding ?? DEFAULT_TEXTURE_OPTIONS.encoding,
		repeat: options.repeat ?? DEFAULT_TEXTURE_OPTIONS.repeat,
	};
}

/**
 * 获取纹理完整路径
 * 如果路径是绝对路径（http://、https:// 或 / 开头），则直接返回
 * 否则添加 baseUrl/img/ 前缀
 */
export function getTexturePath(path: string): string {
	if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
		return path;
	}
	return `${RESOURCE_CONFIG.baseUrl}img/${path}`;
}
