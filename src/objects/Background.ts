/**
 * 背景粒子效果管理模块
 */
import * as THREE from "three";
import { World } from "../core";
import { PARTICLES_CONFIG } from "../config";
import { getRandomArbitrary } from "../utils";

/**
 * 背景粒子对象类
 * 负责创建和管理背景粒子效果
 */
export class Background {
	/** World 实例 */
	private world: World;
	/** 背景粒子点云对象 */
	public backgroundPoints!: THREE.Points;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		this.world.scene.add(this.backgroundPoints);
	}

	/**
	 * 更新背景粒子动画
	 */
	public update(): void {
		const { animation } = PARTICLES_CONFIG;
		this.backgroundPoints.rotation.z += animation.particleSystemRotationSpeed;
	}

	/**
	 * 初始化背景粒子
	 */
	private init(): void {
		this.backgroundPoints = this.createBackgroundPoints();
	}

	/**
	 * 创建背景粒子点云对象
	 * @returns 背景粒子点云对象
	 */
	private createBackgroundPoints(): THREE.Points {
		const { background } = PARTICLES_CONFIG;
		const geometry = this.createBackgroundGeometry(background.count, background.range);
		const material = new THREE.PointsMaterial({
			size: background.size,
		});

		return new THREE.Points(geometry, material);
	}

	/**
	 * 创建背景粒子几何体
	 * @param count 粒子数量
	 * @param range 粒子范围
	 * @returns 背景粒子几何体
	 */
	private createBackgroundGeometry(
		count: number,
		range: {
			x: { min: number; max: number };
			y: { min: number; max: number };
			z: { min: number; max: number };
		}
	): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		const vertices = [];

		for (let i = 0; i < count; i++) {
			const x = getRandomArbitrary(range.x.min, range.x.max);
			const y = getRandomArbitrary(range.y.min, range.y.max);
			const z = getRandomArbitrary(range.z.min, range.z.max);
			vertices.push(x, y, z);
		}

		geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

		return geometry;
	}

}
