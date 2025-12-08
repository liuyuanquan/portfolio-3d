import * as THREE from "three";
import { CameraControl } from "./CameraControl";
import { PhysicsEngine } from "./PhysicsEngine";
import { InteractionManager } from "./InteractionManager";

export class World {
	public readonly scene: THREE.Scene;
	public readonly renderer: THREE.WebGLRenderer;
	public readonly cameraControl: CameraControl;
	public readonly cursorHoverObjects: THREE.Object3D[] = [];
	public readonly cameraHelper: THREE.CameraHelper;
	public readonly directionalLightHelper: THREE.DirectionalLightHelper;
	/** 物理引擎实例 */
	public physicsEngine!: PhysicsEngine;
	/** 交互管理器实例 */
	public interactionManager!: InteractionManager;

	constructor(containerSelector: string = "#WEBGLcontainer") {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);

		// const axesHelper = new THREE.AxesHelper(200);
		// this.scene.add(axesHelper);

		const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
		hemiLight.color.setHSL(0.6, 0.6, 0.6);
		hemiLight.groundColor.setHSL(0.1, 1, 0.4);
		hemiLight.position.set(0, 50, 0);
		this.scene.add(hemiLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
		dirLight.color.setHSL(0.1, 1, 0.95);
		dirLight.position.set(-10, 100, 50);
		dirLight.position.multiplyScalar(100);
		this.scene.add(dirLight);

		dirLight.castShadow = true;
		dirLight.shadow.mapSize.width = 4096;
		dirLight.shadow.mapSize.height = 4096;
		dirLight.shadow.camera.left = -200;
		dirLight.shadow.camera.right = 200;
		dirLight.shadow.camera.top = 200;
		dirLight.shadow.camera.bottom = -200;
		dirLight.shadow.camera.far = 15000;

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.shadowMap.enabled = true;
		
		// 将 canvas 添加到指定的容器中
		const container = document.querySelector(containerSelector) as HTMLElement;
		if (container) {
			container.appendChild(this.renderer.domElement);
		} else {
			// 如果容器不存在，回退到 body
			console.warn(`Container "${containerSelector}" not found, appending canvas to body`);
			document.body.appendChild(this.renderer.domElement);
		}

		this.cameraControl = new CameraControl(this);

		this.cameraHelper = null as any;
		this.directionalLightHelper = null as any;
	}

	/**
	 * 渲染场景
	 */
	public render(): void {
		// 检测纹理尺寸调整（仅在开发环境）
		if (import.meta.env.DEV) {
			this.checkTextureSizes();
		}
		
		this.renderer.render(this.scene, this.cameraControl.camera);
	}

	/**
	 * 检查纹理尺寸（开发环境调试用）
	 */
	private checkTextureSizes(): void {
		// 只在第一次渲染时检查一次
		if ((this as any)._textureSizeChecked) {
			return;
		}
		(this as any)._textureSizeChecked = true;

		this.scene.traverse((object) => {
			if (object instanceof THREE.Mesh) {
				const materials = Array.isArray(object.material) ? object.material : [object.material];
				materials.forEach((material) => {
					if (material instanceof THREE.MeshStandardMaterial || 
						material instanceof THREE.MeshBasicMaterial ||
						material instanceof THREE.MeshLambertMaterial) {
						const maps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap'];
						maps.forEach((mapName) => {
							const texture = (material as any)[mapName] as THREE.Texture | undefined;
							if (texture && texture.image) {
								const image = texture.image;
								if (image instanceof Image) {
									const naturalWidth = image.naturalWidth || image.width;
									const naturalHeight = image.naturalHeight || image.height;
									
									// 检查是否是 2 的幂次方
									const isPowerOfTwo = (value: number) => value > 0 && (value & (value - 1)) === 0;
									
									if (!isPowerOfTwo(naturalWidth) || !isPowerOfTwo(naturalHeight)) {
										// 尝试从纹理的 image 获取 URL
										const textureUrl = (image as HTMLImageElement).src || '未知';
										const fileName = textureUrl.split('/').pop() || textureUrl;
										console.warn(
											`⚠️ 纹理尺寸不是 2 的幂次方: ${fileName}\n` +
											`  尺寸: ${naturalWidth}x${naturalHeight}\n` +
											`  路径: ${textureUrl}`
										);
									}
								}
							}
						});
					}
				});
			}
		});
	}
}
