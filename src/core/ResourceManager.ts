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
	private fonts: Map<string, THREE.Font> = new Map();
	private textures: Map<string, THREE.Texture> = new Map();
	private ammoLib: any = null;

	constructor() {
		this.manager = new THREE.LoadingManager();
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
	 * @param onProgress 可选的进度回调函数，参数为 0-100 的百分比（基于资源数量）
	 */
	public async loadAll(onProgress?: (progress: number) => void): Promise<void> {
		const totalResources = Object.keys(RESOURCE_CONFIG.fonts).length + RESOURCE_CONFIG.preloadTextures.length + 1; // +1 for Ammo.js
		let loadedResources = 0;

		const updateProgress = () => {
			if (onProgress) {
				const progress = Math.round((loadedResources / totalResources) * 100);
				onProgress(progress);
				console.log(`加载进度: ${progress}% | 已加载: ${loadedResources} / ${totalResources} 个资源`);
			}
		};

		// 加载字体
		const fontPromises = Object.entries(RESOURCE_CONFIG.fonts).map(([name, path]) => {
			return new Promise<THREE.Font>((resolve, reject) => {
				const loader = new THREE.FontLoader(this.manager);
				loader.load(
					path,
					(font: THREE.Font) => {
						this.fonts.set(name, font);
						loadedResources++;
						updateProgress();
						resolve(font);
					},
					undefined,
					(error: ErrorEvent) => {
						console.error(`字体文件加载错误 [${name}]:`, error);
						loadedResources++;
						updateProgress();
						reject(error);
					}
				);
			});
		});

		// 加载纹理
		const texturePromise = new Promise<void>((resolve) => {
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
						loadedResources++;
						updateProgress();
						if (loadedCount === totalCount) {
							resolve();
						}
					},
					undefined,
					(error: ErrorEvent) => {
						console.error(`纹理加载错误 [${url}]:`, error);
						loadedCount++;
						loadedResources++;
						updateProgress();
						if (loadedCount === totalCount) {
							resolve();
						}
					}
				);
			});
		});

		// 加载 Ammo.js
		const ammoPromise = this.loadAmmo().then(() => {
			loadedResources++;
			updateProgress();
		});

		// 并行加载所有资源
		await Promise.all([Promise.all(fontPromises), texturePromise, ammoPromise]);

		// 确保最终进度为 100%
		if (onProgress) {
			onProgress(100);
			console.log(`加载完成: 100% | 总共加载了 ${totalResources} 个资源`);
		}
	}

	/**
	 * 获取已加载的字体
	 * @param fontName 字体名称，可选。如果不指定，返回默认字体
	 * @returns THREE.Font 对象，如果字体未加载则返回 null
	 */
	public getFont(fontName?: string): THREE.Font | null {
		const name = fontName || RESOURCE_CONFIG.defaultFont;
		return this.fonts.get(name) || null;
	}

	/**
	 * 获取所有已加载的字体名称列表
	 */
	public getAvailableFonts(): string[] {
		return Array.from(this.fonts.keys());
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
