/**
 * 资源管理器
 * 统一管理所有资源的加载，包括字体、纹理和 Ammo.js
 */
import * as THREE from "three";
import { RESOURCE_CONFIG, DEFAULT_TEXTURE_OPTIONS } from "../config";
import { applyTextureOptions, createTextureOptions, getTexturePath } from "../utils";
import resourceSizes from "../config/resource_sizes.json";

/**
 * 资源字节跟踪信息
 */
interface ResourceBytes {
	loaded: number;
	total: number;
}

/**
 * 资源字节跟踪器
 * 用于跟踪和管理资源加载的字节数
 */
class ResourceBytesTracker {
	private resources: Map<string, ResourceBytes> = new Map();
	private totalBytes = 0;
	private loadedBytes = 0;
	private knownSizes: Map<string, number> = new Map();
	private isTotalBytesFixed = false; // 标记总字节数是否已固定

	/**
	 * 设置已知资源大小
	 */
	setKnownSize(path: string, size: number): void {
		this.knownSizes.set(path, size);
	}

	/**
	 * 设置总字节数（用于初始化，设置为固定值）
	 */
	setTotalBytes(total: number): void {
		this.totalBytes = total;
		this.isTotalBytesFixed = true;
	}

	/**
	 * 初始化资源跟踪
	 */
	initResource(path: string, knownSize?: number): void {
		// 优先使用传入的已知大小，否则从 knownSizes 中查找
		const size = knownSize ?? this.knownSizes.get(path) ?? 0;
		this.resources.set(path, { loaded: 0, total: size });
		
		// 如果总字节数未固定，才动态更新（向后兼容）
		if (!this.isTotalBytesFixed && size > 0) {
			const currentTotal = this.calculateTotalBytes();
			if (currentTotal > this.totalBytes) {
				this.totalBytes = currentTotal;
			}
		}
	}

	/**
	 * 更新资源进度
	 */
	updateProgress(path: string, loaded: number, total: number): void {
		const resource = this.resources.get(path);
		if (!resource) return;

		const previousLoaded = resource.loaded;
		resource.loaded = loaded;
		resource.total = total;

		// 更新已加载字节数
		this.loadedBytes += loaded - previousLoaded;

		// 如果总字节数未固定，才动态更新（向后兼容）
		// 如果已固定，使用 XMLHttpRequest 返回的 total 来更新资源的 total，但不更新总字节数
		if (!this.isTotalBytesFixed && total > 0) {
			const currentTotal = this.calculateTotalBytes();
			if (currentTotal > this.totalBytes) {
				this.totalBytes = currentTotal;
			}
		}
	}

	/**
	 * 完成资源加载
	 */
	completeResource(path: string): void {
		const resource = this.resources.get(path);
		if (resource) {
			this.loadedBytes += resource.total - resource.loaded;
			this.resources.delete(path);
		}
	}

	/**
	 * 移除资源跟踪（用于错误情况）
	 */
	removeResource(path: string): void {
		this.resources.delete(path);
	}

	/**
	 * 计算当前总字节数
	 */
	private calculateTotalBytes(): number {
		return Array.from(this.resources.values()).reduce(
			(sum, bytes) => sum + (bytes.total || 0),
			0
		);
	}

	/**
	 * 添加已加载字节数（用于无法跟踪的资源，如 Ammo.js）
	 * 注意：如果总字节数已固定，不会增加 totalBytes，只增加 loadedBytes
	 */
	addLoadedBytes(bytes: number): void {
		this.loadedBytes += bytes;
		// 如果总字节数未固定，才增加 totalBytes（向后兼容）
		if (!this.isTotalBytesFixed) {
			this.totalBytes += bytes;
		}
	}

	/**
	 * 获取总字节数
	 */
	getTotalBytes(): number {
		return this.totalBytes;
	}

	/**
	 * 获取已加载字节数
	 */
	getLoadedBytes(): number {
		return this.loadedBytes;
	}

	/**
	 * 重置跟踪器
	 */
	reset(): void {
		this.resources.clear();
		this.totalBytes = 0;
		this.loadedBytes = 0;
	}
}

/**
 * 获取资源大小配置
 */
function getResourceSize(): typeof resourceSizes {
	return resourceSizes as typeof resourceSizes;
}

/**
 * 资源管理器类
 */
export class ResourceManager {
	/** LoadingManager 实例 */
	private manager: THREE.LoadingManager;

	/** 资源缓存 */
	private fonts: Map<string, THREE.Font> = new Map();
	private textures: Map<string, THREE.Texture> = new Map();
	private ammoLib: AmmoType | null = null;

	constructor() {
		this.manager = new THREE.LoadingManager();
	}

	/**
	 * 加载 Ammo.js
	 */
	private loadAmmo(): Promise<AmmoType> {
		return new Promise((resolve, reject) => {
			if (this.ammoLib) {
				resolve(this.ammoLib);
				return;
			}

			// 使用全局 Ammo 函数
			if (typeof Ammo !== "undefined") {
				Ammo()
					.then((ammoLib: AmmoType) => {
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
	 * 创建进度更新函数
	 */
	private createProgressUpdater(
		onProgress: ((progress: number, resourceName?: string) => void) | undefined,
		tracker: ResourceBytesTracker,
		totalResources: number
	): {
		update: (loadedResources: number, resourceName?: string) => void;
		finalize: () => Promise<void>;
	} {
		let rafId: number | null = null;
		let loadedResources = 0;
		let currentResourceName: string | undefined = undefined;

		const update = (newLoadedResources: number, resourceName?: string) => {
			loadedResources = newLoadedResources;
			if (resourceName !== undefined) {
				currentResourceName = resourceName;
			}
			if (!onProgress) return;

			// 取消之前的动画帧
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}

			// 使用 requestAnimationFrame 确保进度更新能被浏览器渲染
			rafId = requestAnimationFrame(() => {
				const totalBytes = tracker.getTotalBytes();
				const loadedBytes = tracker.getLoadedBytes();

				let progress = 0;
				if (totalBytes > 0) {
					progress = Math.round((loadedBytes / totalBytes) * 100);
					const loadedMB = (loadedBytes / 1024 / 1024).toFixed(2);
					const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
					console.log(`加载进度: ${progress}% | 已加载: ${loadedMB} MB / ${totalMB} MB`);
				} else {
					progress = Math.round((loadedResources / totalResources) * 100);
					console.log(`加载进度: ${progress}% | 已加载: ${loadedResources} / ${totalResources} 个资源`);
				}

				onProgress(progress, currentResourceName);
				rafId = null;
			});
		};

		const finalize = async (): Promise<void> => {
			if (!onProgress) return;

			// 等待之前的动画帧完成
			if (rafId !== null) {
				await new Promise<void>((resolve) => {
					const checkRaf = () => {
						if (rafId === null) {
							resolve();
						} else {
							requestAnimationFrame(checkRaf);
						}
					};
					requestAnimationFrame(checkRaf);
				});
			}

			// 确保最终进度为 100%
			await new Promise<void>((resolve) => {
				requestAnimationFrame(() => {
					onProgress(100);
					const totalBytes = tracker.getTotalBytes();
					if (totalBytes > 0) {
						const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
						console.log(`加载完成: 100% | 总共加载了 ${totalMB} MB`);
					} else {
						console.log(`加载完成: 100% | 总共加载了 ${totalResources} 个资源`);
					}
					resolve();
				});
			});
		};

		return { update, finalize };
	}

	/**
	 * 加载单个字体资源
	 */
	private loadFont(
		name: string,
		path: string,
		tracker: ResourceBytesTracker,
		onProgress: (loadedResources: number, resourceName?: string) => void
	): Promise<THREE.Font> {
		return new Promise<THREE.Font>((resolve, reject) => {
			const loader = new THREE.FontLoader(this.manager);
			// 从资源大小配置中获取已知大小
			const fontSize = (resourceSizes as any).fonts?.[name]?.size;
			tracker.initResource(path, fontSize);
			const resourceName = `字体: ${name}`;

			loader.load(
				path,
				(font: THREE.Font) => {
					this.fonts.set(name, font);
					tracker.completeResource(path);
					onProgress(1, resourceName);
					resolve(font);
				},
				(xhr: ProgressEvent<EventTarget>) => {
					if (xhr.lengthComputable) {
						tracker.updateProgress(path, xhr.loaded, xhr.total);
						onProgress(0, resourceName); // 触发进度更新但不增加资源计数
					}
				},
				(error: ErrorEvent) => {
					console.error(`字体文件加载错误 [${name}]:`, error);
					tracker.removeResource(path);
					onProgress(1); // 即使失败也计入已加载资源
					reject(error);
				}
			);
		});
	}

	/**
	 * 加载所有字体资源
	 */
	private loadFonts(
		tracker: ResourceBytesTracker,
		onProgress: (loadedResources: number, resourceName?: string) => void
	): Promise<THREE.Font[]> {
		const fontEntries = Object.entries(RESOURCE_CONFIG.fonts);
		let loadedCount = 0;

		const progressHandler = (increment: number, resourceName?: string) => {
			if (increment > 0) {
				loadedCount += increment;
			}
			onProgress(loadedCount, resourceName);
		};

		return Promise.all(
			fontEntries.map(([name, path]) =>
				this.loadFont(name, path, tracker, progressHandler)
			)
		);
	}

	/**
	 * 加载所有预加载纹理
	 */
	private loadPreloadTextures(
		tracker: ResourceBytesTracker,
		onProgress: (loadedResources: number, resourceName?: string) => void
	): Promise<void> {
		const textures = RESOURCE_CONFIG.preloadTextures;
		const textureCount: number = textures.length;
		
		// 如果没有纹理需要加载，直接返回
		if (textureCount <= 0) {
			return Promise.resolve();
		}

		return new Promise<void>((resolve, reject) => {
			const loader = new THREE.TextureLoader(this.manager);
			let loadedCount = 0;
			let hasError = false;

			textures.forEach((url) => {
				// 从完整 URL 中提取相对路径（移除 BASE_URL）
				// URL 格式: ${BASE_URL}img/player-ball.webp，需要提取 img/player-ball.webp
				const relativePath = url.replace(/^.*\/img\//, "img/").replace(/^.*\/json\//, "json/");
				const textureSize = (resourceSizes as any).textures?.[relativePath];
				tracker.initResource(url, textureSize);
				// 提取文件名作为资源名称
				const fileName = relativePath.split('/').pop() || relativePath;
				const resourceName = `纹理: ${fileName}`;

				loader.load(
					url,
					(texture: THREE.Texture) => {
						if (hasError) return;

						// 检查纹理尺寸是否被调整
						const image = texture.image;
						if (image && (image.width !== image.naturalWidth || image.height !== image.naturalHeight)) {
							console.warn(
								`纹理尺寸被调整: ${fileName}\n` +
								`  原始尺寸: ${image.naturalWidth}x${image.naturalHeight}\n` +
								`  调整后: ${image.width}x${image.height}\n` +
								`  路径: ${url}`
							);
						}

						applyTextureOptions(texture, DEFAULT_TEXTURE_OPTIONS);
						this.textures.set(url, texture);
						tracker.completeResource(url);
						loadedCount++;
						onProgress(loadedCount, resourceName);

						if (loadedCount === textureCount) {
							resolve();
						}
					},
					(xhr: ProgressEvent<EventTarget>) => {
						if (xhr.lengthComputable) {
							tracker.updateProgress(url, xhr.loaded, xhr.total);
							onProgress(loadedCount, resourceName); // 触发进度更新但不增加资源计数
						}
					},
					(error: ErrorEvent) => {
						console.error(`纹理加载错误 [${url}]:`, error);
						tracker.removeResource(url);
						loadedCount++;
						onProgress(loadedCount);

						if (loadedCount === textureCount) {
							hasError = true;
							reject(error);
						}
					}
				);
			});
		});
	}

	/**
	 * 加载所有资源
	 * @param onProgress 可选的进度回调函数，参数为 progress (0-100) 和 resourceName (当前加载的资源名称)
	 */
	public async loadAll(onProgress?: (progress: number, resourceName?: string) => void): Promise<void> {
		const totalResources =
			Object.keys(RESOURCE_CONFIG.fonts).length +
			RESOURCE_CONFIG.preloadTextures.length +
			1; // +1 for Ammo.js

		const tracker = new ResourceBytesTracker();
		let loadedResources = 0;

		// 初始化总字节数（使用已知的资源大小）
		const sizes = getResourceSize();
		if (sizes.totals?.all) {
			tracker.setTotalBytes(sizes.totals.all);
		}

		const { update, finalize } = this.createProgressUpdater(
			onProgress,
			tracker,
			totalResources
		);

		// 加载字体
		const fontPromises = this.loadFonts(tracker, (count, resourceName) => {
			loadedResources = count;
			update(loadedResources, resourceName);
		});

		// 加载纹理
		const texturePromise = this.loadPreloadTextures(tracker, (count, resourceName) => {
			loadedResources = Object.keys(RESOURCE_CONFIG.fonts).length + count;
			update(loadedResources, resourceName);
		});

		// 加载 Ammo.js（使用实际大小）
		// 注意：Ammo.js 的大小已经包含在预设的 totalBytes 中，所以只需要增加 loadedBytes
		const ammoSize = sizes.ammo?.total ?? 0;
		const ammoPromise = this.loadAmmo()
			.then(() => {
				tracker.addLoadedBytes(ammoSize);
				loadedResources++;
				update(loadedResources, "Ammo.js");
			})
			.catch((error) => {
				console.error("Ammo.js 加载失败:", error);
				loadedResources++;
				update(loadedResources);
				throw error;
			});

		// 并行加载所有资源
		try {
			await Promise.all([fontPromises, texturePromise, ammoPromise]);
		} catch (error) {
			// 即使有资源加载失败，也确保进度更新完成
			await finalize();
			throw error;
		}

		// 确保最终进度为 100%
		await finalize();
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
	 * 获取已加载的 Ammo.js 库
	 */
	public getAmmo(): AmmoType | null {
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
				// 检查纹理尺寸是否被调整（使用 setTimeout 确保 image 已完全加载）
				setTimeout(() => {
					const image = loadedTexture.image;
					if (image && image instanceof Image) {
						const naturalWidth = image.naturalWidth || image.width;
						const naturalHeight = image.naturalHeight || image.height;
						const actualWidth = image.width;
						const actualHeight = image.height;
						
						// 检查是否是 2 的幂次方
						const isPowerOfTwo = (value: number) => (value & (value - 1)) === 0;
						const widthIsPowerOfTwo = isPowerOfTwo(naturalWidth);
						const heightIsPowerOfTwo = isPowerOfTwo(naturalHeight);
						
						const fileName = url.split('/').pop() || url;
						
						if (!widthIsPowerOfTwo || !heightIsPowerOfTwo) {
							console.warn(
								`⚠️ 纹理尺寸不是 2 的幂次方，可能被调整: ${fileName}\n` +
								`  原始尺寸: ${naturalWidth}x${naturalHeight}\n` +
								`  路径: ${fullUrl}`
							);
						}
						
						// 如果尺寸被调整了，输出详细信息
						if (actualWidth !== naturalWidth || actualHeight !== naturalHeight) {
							console.warn(
								`⚠️ 纹理尺寸被调整: ${fileName}\n` +
								`  原始尺寸: ${naturalWidth}x${naturalHeight}\n` +
								`  调整后: ${actualWidth}x${actualHeight}\n` +
								`  路径: ${fullUrl}`
							);
						}
					}
				}, 0);

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
