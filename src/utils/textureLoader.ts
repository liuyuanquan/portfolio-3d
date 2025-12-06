import * as THREE from "three";
import { manager } from "../core/World";

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
		encoding: THREE.TextureEncoding;
		repeat: { x: number; y: number };
	}
): void {
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
 * 加载纹理
 * @param url - 纹理 URL
 * @param options - 配置选项
 * @returns 加载的纹理
 */
export function loadTexture(url: string, options: TextureLoadOptions = {}): THREE.Texture {
	const loader = new THREE.TextureLoader(manager);
	const {
		generateMipmaps = false,
		minFilter = THREE.LinearFilter,
		magFilter = THREE.LinearFilter,
		anisotropy = 1,
		wrapS = THREE.ClampToEdgeWrapping,
		wrapT = THREE.ClampToEdgeWrapping,
		encoding = THREE.sRGBEncoding,
		repeat = { x: 1, y: 1 },
	} = options;

	const textureOptions = {
		generateMipmaps,
		minFilter,
		magFilter,
		anisotropy,
		wrapS,
		wrapT,
		encoding,
		repeat,
	};

	const texture = loader.load(
		url,
		(loadedTexture: THREE.Texture) => {
			applyTextureOptions(loadedTexture, textureOptions);
			loadedTexture.needsUpdate = true;
		},
		undefined,
		undefined
	);

	applyTextureOptions(texture, textureOptions);

	return texture;
}
