/**
 * 星系效果管理模块
 */
import * as THREE from "three";
import { scene, renderer } from "../core/World";
import { GAMEPLAY_CONFIG } from "../config";
import galaxyVertexShader from "../shaders/vertex.glsl?raw";
import galaxyFragmentShader from "../shaders/fragment.glsl?raw";

export let galaxyClock: THREE.Clock | null = null;
export let galaxyMaterial: THREE.ShaderMaterial | null = null;
export let galaxyPoints: THREE.Points | null = null;

const GALAXY_POSITION_CONFIG = {
	yOffset: -50,
	zOffset: -50,
} as const;

export function createGalaxy(): void {
	const { count, radius, branches, randomnessPower, randomness, insideColor: insideColorHex, outsideColor: outsideColorHex } = GAMEPLAY_CONFIG.galaxy;

	if (galaxyPoints !== null) {
		galaxyPoints.geometry.dispose();
		if (galaxyMaterial) {
			galaxyMaterial.dispose();
		}
		scene.remove(galaxyPoints);
	}

	galaxyClock = new THREE.Clock();

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
		randomnessArray[i3 + 2] = randomOffset + GALAXY_POSITION_CONFIG.zOffset;

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

	galaxyMaterial = new THREE.ShaderMaterial({
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
		vertexShader: galaxyVertexShader,
		fragmentShader: galaxyFragmentShader,
		uniforms: {
			uTime: { value: 0 },
			uSize: { value: 30 * renderer.getPixelRatio() },
		},
	});

	galaxyPoints = new THREE.Points(geometry, galaxyMaterial);
	galaxyPoints.position.y = GALAXY_POSITION_CONFIG.yOffset;
	scene.add(galaxyPoints);
}

export function updateGalaxy(): void {
	if (galaxyClock && galaxyMaterial) {
		const elapsedTime = galaxyClock.getElapsedTime() + GAMEPLAY_CONFIG.renderLoop.galaxyTimeOffset;
		galaxyMaterial.uniforms.uTime.value = elapsedTime * GAMEPLAY_CONFIG.renderLoop.galaxyTimeMultiplier;
	}
}
