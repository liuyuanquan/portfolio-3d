/**
 * 资源管理器
 * 统一管理所有资源的加载，包括字体、纹理和 Ammo.js
 */
import * as THREE from "three";
import { RESOURCE_CONFIG, DEFAULT_TEXTURE_OPTIONS } from "../config";
import { applyTextureOptions, createTextureOptions, getTexturePath } from "../utils";

/**
 * 资源管理器类
 */
export class ResourceManager {
	/** LoadingManager 实例 */
	private manager: THREE.LoadingManager;

	/** 资源缓存 */
	private font: THREE.Font | null = null;
	private textures: Map<string, THREE.Texture> = new Map();
	private ammoLib: any = null;

	constructor() {
		this.manager = new THREE.LoadingManager();
	}

	/**
	 * 加载字体
	 */
	private loadFont(): Promise<THREE.Font> {
		return new Promise((resolve, reject) => {
			if (this.font) {
				resolve(this.font);
				return;
			}

			const loader = new THREE.FontLoader(this.manager);
			loader.load(
				RESOURCE_CONFIG.defaultFontPath,
				(font: THREE.Font) => {
					this.font = font;
					resolve(font);
				},
				undefined,
				(error: ErrorEvent) => {
					console.error("字体文件加载错误:", error);
					reject(error);
				}
			);
		});
	}

	/**
	 * 加载所有预定义的纹理
	 */
	private loadTextures(): Promise<void> {
		return new Promise((resolve) => {
			const loader = new THREE.TextureLoader(this.manager);
			let loadedCount = 0;
			const totalCount: number = RESOURCE_CONFIG.preloadTextures.length;

			if (totalCount === 0) {
				resolve();
				return;
			}

			RESOURCE_CONFIG.preloadTextures.forEach((url) => {
				loader.load(
					url,
					(texture: THREE.Texture) => {
						applyTextureOptions(texture, DEFAULT_TEXTURE_OPTIONS);
						this.textures.set(url, texture);
						loadedCount++;
						if (loadedCount === totalCount) {
							resolve();
						}
					},
					undefined,
					(error: ErrorEvent) => {
						console.error(`纹理加载错误 [${url}]:`, error);
						loadedCount++;
						if (loadedCount === totalCount) {
							resolve();
						}
					}
				);
			});
		});
	}

	/**
	 * 加载 Ammo.js
	 */
	private loadAmmo(): Promise<any> {
		return new Promise((resolve, reject) => {
			if (this.ammoLib) {
				resolve(this.ammoLib);
				return;
			}

			// 使用全局 Ammo 函数
			if (typeof Ammo !== "undefined") {
				Ammo()
					.then((ammoLib: any) => {
						this.ammoLib = ammoLib;
						resolve(ammoLib);
					})
					.catch(reject);
			} else {
				reject(new Error("Ammo.js 未找到"));
			}
		});
	}

	/**
	 * 加载所有资源
	 */
	public async loadAll(): Promise<void> {
		// 并行加载所有资源
		await Promise.all([this.loadFont(), this.loadTextures(), this.loadAmmo()]);
	}

	/**
	 * 获取已加载的字体
	 */
	public getFont(): THREE.Font | null {
		return this.font;
	}

	/**
	 * 获取已加载的 Ammo.js 库
	 */
	public getAmmo(): any {
		return this.ammoLib;
	}

	/**
	 * 加载纹理（如果已缓存则返回缓存的，否则加载并缓存）
	 * 注意：如果缓存的纹理存在但选项不同，会应用新选项到缓存的纹理
	 */
	public loadTexture(url: string, options: TextureLoadOptions = {}): THREE.Texture {
		const fullUrl = getTexturePath(url);
		const textureOptions = createTextureOptions(options);

		// 检查缓存
		const cached = this.textures.get(fullUrl);
		if (cached) {
			applyTextureOptions(cached, textureOptions);
			cached.needsUpdate = true;
			return cached;
		}

		// 加载新纹理
		const loader = new THREE.TextureLoader(this.manager);
		const texture = loader.load(
			fullUrl,
			(loadedTexture: THREE.Texture) => {
				applyTextureOptions(loadedTexture, textureOptions);
				loadedTexture.needsUpdate = true;
			},
			undefined,
			undefined
		);

		applyTextureOptions(texture, textureOptions);
		this.textures.set(fullUrl, texture);

		return texture;
	}
}

/**
 * 资源管理器实例
 */
export const resourceManager = new ResourceManager();
