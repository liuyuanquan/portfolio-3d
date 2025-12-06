import { scene } from "../core/World";
import { createTexturedPlane } from "./Shapes";

const BASE_URL: string = (import.meta.env as any).BASE_URL;

const CONFIG = {
	position: { x: 50, y: -50, z: -800 },
	size: { x: 200, y: 200 },
	texture: `${BASE_URL}img/lensflare0.png`,
	opacity: 0.9,
	rotateX: false,
	receiveShadow: true,
} as const;

export let lensFlareObject: THREE.Mesh | null = null;

/**
 * 创建镜头光晕
 */
export function createLensFlare(): void {
	const { position, size, texture, opacity, rotateX, receiveShadow } = CONFIG;

	const lensFlare = createTexturedPlane({
		position,
		size,
		texture,
		opacity,
		rotateX,
		receiveShadow,
	});
	scene.add(lensFlare);
	lensFlareObject = lensFlare;
}
