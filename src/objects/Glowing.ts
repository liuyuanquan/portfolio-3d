/**
 * 发光粒子效果管理模块
 */
import * as THREE from "three";
import { World, resourceManager } from "../core";
import { GAMEPLAY_CONFIG, PARTICLES_CONFIG } from "../config";

interface ParticleAttributes {
	startSize: number[];
	startPosition: THREE.Vector3[];
	randomness: number[];
}

/**
 * 发光粒子对象类
 * 负责创建和管理发光粒子效果
 */
export class Glowing {
	/** World 实例 */
	private world: World;
	/** 发光粒子组对象 */
	public glowingParticles!: THREE.Object3D;
	/** 粒子属性 */
	private particleAttributes!: ParticleAttributes;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		this.world.scene.add(this.glowingParticles);
	}

	/**
	 * 更新发光粒子动画
	 */
	public update(clock: THREE.Clock): void {
		const { animation } = PARTICLES_CONFIG;
		const time = animation.glowingParticlesTimeMultiplier * clock.getElapsedTime();

		for (let c = 0; c < this.glowingParticles.children.length; c++) {
			const sprite = this.glowingParticles.children[c] as THREE.Sprite;

			const a = this.particleAttributes.randomness[c] + animation.glowingParticlesPulse.randomnessOffset;
			const pulseFactor = Math.sin(a * time) * animation.glowingParticlesPulse.amplitude + animation.glowingParticlesPulse.base;

			const startPos = this.particleAttributes.startPosition[c];
			sprite.position.x = startPos.x * pulseFactor;
			sprite.position.y = startPos.y * pulseFactor * animation.glowingParticlesPulse.yMultiplier;
			sprite.position.z = startPos.z * pulseFactor;
		}

		this.glowingParticles.rotation.y = time * animation.particleGroupRotationSpeed;
	}

	/**
	 * 初始化发光粒子
	 */
	private init(): void {
		this.glowingParticles = this.createGlowingParticles();
		this.particleAttributes = this.createParticleAttributes();
	}

	/**
	 * 创建发光粒子组对象
	 * @returns 发光粒子组对象
	 */
	private createGlowingParticles(): THREE.Object3D {
		const { total: totalParticles, radiusRange, materialColor, spriteScale, texture } = GAMEPLAY_CONFIG.particles;
		const particleTexture = resourceManager.loadTexture(texture);
		const { glowing } = PARTICLES_CONFIG;

		const particleGroup = new THREE.Object3D();
		particleGroup.position.set(glowing.position.x, glowing.position.y, glowing.position.z);

		for (let i = 0; i < totalParticles; i++) {
			const spriteMaterial = new THREE.SpriteMaterial({
				map: particleTexture,
				color: materialColor,
				blending: THREE.AdditiveBlending,
			});

			const sprite = new THREE.Sprite(spriteMaterial);
			sprite.scale.set(spriteScale.x, spriteScale.y, spriteScale.z);
			sprite.renderOrder = 1;

			sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
			sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));
			sprite.material.color.setHSL(Math.random(), 0.9, 0.7);

			particleGroup.add(sprite);
		}

		return particleGroup;
	}

	/**
	 * 创建粒子属性
	 * @returns 粒子属性对象
	 */
	private createParticleAttributes(): ParticleAttributes {
		const { total: totalParticles } = GAMEPLAY_CONFIG.particles;
		const attributes: ParticleAttributes = {
			startSize: [],
			startPosition: [],
			randomness: [],
		};

		for (let i = 0; i < totalParticles; i++) {
			const sprite = this.glowingParticles.children[i] as THREE.Sprite;
			attributes.startPosition.push(sprite.position.clone());
			attributes.randomness.push(Math.random());
		}

		return attributes;
	}
}
