/**
 * 粒子系统管理模块
 */
import * as THREE from "three";
import { scene } from "../core/World";
import { GAMEPLAY_CONFIG } from "../config";
import { loadTexture } from "../utils/textureLoader";
import { getRandomArbitrary } from "../utils/math";

interface ParticleAttributes {
	startSize: number[];
	startPosition: THREE.Vector3[];
	randomness: number[];
}

export let particleGroup: THREE.Object3D | null = null;
export let particleAttributes: ParticleAttributes | null = null;
export let particleSystemObject: THREE.Points | null = null;

const PARTICLES_CONFIG = {
	backgroundCount: 3000,
	backgroundSize: 3,
	backgroundRange: {
		x: { min: -1100, max: 1100 },
		y: { min: -1100, max: 1100 },
		z: { min: -1100, max: -500 },
	},
} as const;

const PARTICLE_ANIMATION_CONFIG = {
	particleSystemRotationSpeed: 0.0003,
	lensFlareRotationSpeed: 0.0002,
	lensFlareMoveSpeed: {
		x: 0.025,
		y: -0.001,
	},
	lensFlareBounds: {
		x: { min: -750, max: 750 },
		y: { default: -50 },
	},
	glowingParticlesTimeMultiplier: 7,
	glowingParticlesPulse: {
		randomnessOffset: 0.75,
		amplitude: 0.1,
		base: 0.9,
		yMultiplier: 1.5,
	},
	particleGroupRotationSpeed: 0.75,
} as const;

export function createGlowingParticles(): void {
	const BASE_URL = (import.meta.env as any).BASE_URL;
	const { total: totalParticles, radiusRange, materialColor, spriteScale, texture } = GAMEPLAY_CONFIG.particles;
	const particleTexture = loadTexture(`${BASE_URL}${texture}`);

	particleGroup = new THREE.Object3D();
	particleGroup.position.set(-1, 7, 45);
	particleAttributes = {
		startSize: [],
		startPosition: [],
		randomness: [],
	};

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
		particleAttributes.startPosition.push(sprite.position.clone());
		particleAttributes.randomness.push(Math.random());
	}

	scene.add(particleGroup);
}

export function createBackgroundParticles(): void {
	const geometry = new THREE.BufferGeometry();
	const vertices = [];

	for (let i = 0; i < PARTICLES_CONFIG.backgroundCount; i++) {
		const x = getRandomArbitrary(PARTICLES_CONFIG.backgroundRange.x.min, PARTICLES_CONFIG.backgroundRange.x.max);
		const y = getRandomArbitrary(PARTICLES_CONFIG.backgroundRange.y.min, PARTICLES_CONFIG.backgroundRange.y.max);
		const z = getRandomArbitrary(PARTICLES_CONFIG.backgroundRange.z.min, PARTICLES_CONFIG.backgroundRange.z.max);
		vertices.push(x, y, z);
	}

	geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

	const material = new THREE.PointsMaterial({
		size: PARTICLES_CONFIG.backgroundSize,
	});
	particleSystemObject = new THREE.Points(geometry, material);

	scene.add(particleSystemObject);
}

export function moveParticles(clock: THREE.Clock, lensFlareObject: THREE.Mesh | null): void {
	if (particleSystemObject) {
		particleSystemObject.rotation.z += PARTICLE_ANIMATION_CONFIG.particleSystemRotationSpeed;
	}

	if (lensFlareObject) {
		lensFlareObject.rotation.z += PARTICLE_ANIMATION_CONFIG.lensFlareRotationSpeed;

		if (lensFlareObject.position.x < PARTICLE_ANIMATION_CONFIG.lensFlareBounds.x.max) {
			lensFlareObject.position.x += PARTICLE_ANIMATION_CONFIG.lensFlareMoveSpeed.x;
			lensFlareObject.position.y += PARTICLE_ANIMATION_CONFIG.lensFlareMoveSpeed.y;
		} else {
			lensFlareObject.position.x = PARTICLE_ANIMATION_CONFIG.lensFlareBounds.x.min;
			lensFlareObject.position.y = PARTICLE_ANIMATION_CONFIG.lensFlareBounds.y.default;
		}
	}

	if (particleGroup && particleAttributes) {
		const time = PARTICLE_ANIMATION_CONFIG.glowingParticlesTimeMultiplier * clock.getElapsedTime();

		for (let c = 0; c < particleGroup.children.length; c++) {
			const sprite = particleGroup.children[c] as THREE.Sprite;

			const a = particleAttributes.randomness[c] + PARTICLE_ANIMATION_CONFIG.glowingParticlesPulse.randomnessOffset;
			const pulseFactor =
				Math.sin(a * time) * PARTICLE_ANIMATION_CONFIG.glowingParticlesPulse.amplitude + PARTICLE_ANIMATION_CONFIG.glowingParticlesPulse.base;

			const startPos = particleAttributes.startPosition[c];
			sprite.position.x = startPos.x * pulseFactor;
			sprite.position.y = startPos.y * pulseFactor * PARTICLE_ANIMATION_CONFIG.glowingParticlesPulse.yMultiplier;
			sprite.position.z = startPos.z * pulseFactor;
		}

		particleGroup.rotation.y = time * PARTICLE_ANIMATION_CONFIG.particleGroupRotationSpeed;
	}
}
