import * as THREE from "three";
import { World, resourceManager } from "../core";
import { LENS_FLARE_CONFIG } from "../config";

/**
 * 镜头光晕对象类
 * 负责创建和管理镜头光晕效果
 */
export class LensFlare {
	/** World 实例 */
	private world: World;
	/** 镜头光晕对象 */
	public lensFlareObject!: THREE.Mesh;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		this.world.scene.add(this.lensFlareObject);
	}

	/**
	 * 更新镜头光晕动画
	 */
	public update(): void {
		const { animation } = LENS_FLARE_CONFIG;

		this.lensFlareObject.rotation.z += animation.rotationSpeed;

		if (this.lensFlareObject.position.x < animation.bounds.x.max) {
			this.lensFlareObject.position.x += animation.moveSpeed.x;
			this.lensFlareObject.position.y += animation.moveSpeed.y;
		} else {
			this.lensFlareObject.position.x = animation.bounds.x.min;
			this.lensFlareObject.position.y = animation.bounds.y.default;
		}
	}

/**
	 * 初始化镜头光晕
 */
	private init(): void {
		this.lensFlareObject = this.createLensFlare();
	}

	/**
	 * 创建镜头光晕对象
	 * @returns 镜头光晕网格对象
	 */
	private createLensFlare(): THREE.Mesh {
		const { position, size, texture, opacity, rotateX, receiveShadow } = LENS_FLARE_CONFIG;

		const material = new THREE.MeshBasicMaterial({
			map: resourceManager.loadTexture(texture),
			transparent: true,
		opacity,
		});

		const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(size.x, size.y), material);
		mesh.position.set(position.x, position.y, position.z);
		mesh.rotation.x = rotateX ? -Math.PI * 0.5 : 0;
		mesh.renderOrder = 1;
		mesh.receiveShadow = receiveShadow;

		return mesh;
	}
}
