/**
 * 星系效果管理模块
 */
import * as THREE from "three";
import { World } from "../core";
import { GALAXY_CONFIG } from "../config";
import galaxyVertexShader from "../shaders/vertex.glsl?raw";
import galaxyFragmentShader from "../shaders/fragment.glsl?raw";

/**
 * 星系对象类
 * 负责创建和管理星系粒子效果
 */
export class Galaxy {
	/** World 实例 */
	private world: World;
	/** 星系材质 */
	private galaxyMaterial!: THREE.ShaderMaterial;
	/** 星系点云对象 */
	public galaxyPoints!: THREE.Points;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		this.world.scene.add(this.galaxyPoints);
	}

	/**
	 * 更新星系动画
	 */
	public update(clock: THREE.Clock): void {
		const { animation } = GALAXY_CONFIG;
		const elapsedTime = clock.getElapsedTime() + animation.timeOffset;
		this.galaxyMaterial.uniforms.uTime.value = elapsedTime * animation.timeMultiplier;
	}

	/**
	 * 初始化星系
	 */
	private init(): void {
		this.galaxyPoints = this.createGalaxyPoints();
	}

	/**
	 * 创建星系点云对象
	 * @returns 星系点云对象
	 */
	private createGalaxyPoints(): THREE.Points {
		const { count, radius, branches, randomnessPower, randomness, insideColor: insideColorHex, outsideColor: outsideColorHex } = GALAXY_CONFIG;

		const geometry = this.createGalaxyGeometry(count, radius, branches, randomnessPower, randomness, insideColorHex, outsideColorHex);
		this.galaxyMaterial = this.createGalaxyMaterial();

		const points = new THREE.Points(geometry, this.galaxyMaterial);
		points.position.y = GALAXY_CONFIG.position.yOffset;

		return points;
	}

	/**
	 * 创建星系几何体
	 * @returns 星系几何体
	 */
	private createGalaxyGeometry(
		count: number,
		radius: number,
		branches: number,
		randomnessPower: number,
		randomness: number,
		insideColorHex: string,
		outsideColorHex: string
	): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(count * 3);
		const randomnessArray = new Float32Array(count * 3);
		const colors = new Float32Array(count * 3);
		const scales = new Float32Array(count * 1);

		const insideColor = new THREE.Color(insideColorHex);
		const outsideColor = new THREE.Color(outsideColorHex);

		for (let i = 0; i < count; i++) {
			const i3 = i * 3;
			const radiusValue = Math.random() * radius;
			const branchAngle = ((i % branches) / branches) * Math.PI * 2;
			const randomSign = Math.random() < 0.5 ? 1 : -1;
			const randomPower = Math.pow(Math.random(), randomnessPower);
			const randomOffset = randomPower * randomSign * randomness * radiusValue;

			positions[i3] = Math.cos(branchAngle) * radiusValue;
			positions[i3 + 1] = 0;
			positions[i3 + 2] = Math.sin(branchAngle) * radiusValue;

			const randomYPower = Math.pow(Math.random(), randomnessPower);
			const randomYSign = Math.random() < 0.5 ? 1 : -1;
			randomnessArray[i3] = randomOffset;
			randomnessArray[i3 + 1] = randomYPower * randomYSign * randomness * radiusValue;
			randomnessArray[i3 + 2] = randomOffset + GALAXY_CONFIG.position.zOffset;

			const mixedColor = insideColor.clone();
			mixedColor.lerp(outsideColor, radiusValue / radius);
			colors[i3] = mixedColor.r;
			colors[i3 + 1] = mixedColor.g;
			colors[i3 + 2] = mixedColor.b;

			scales[i] = Math.random();
		}

		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
		geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomnessArray, 3));

		return geometry;
	}

	/**
	 * 创建星系材质
	 * @returns 星系着色器材质
	 */
	private createGalaxyMaterial(): THREE.ShaderMaterial {
		return new THREE.ShaderMaterial({
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			vertexColors: true,
			vertexShader: galaxyVertexShader,
			fragmentShader: galaxyFragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uSize: { value: 30 * this.world.renderer.getPixelRatio() },
			},
		});
	}
}
