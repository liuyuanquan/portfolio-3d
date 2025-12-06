import * as THREE from "three";
import { scene } from "../core/World";
import { cursorHoverObjects } from "../core/CameraControl";
import { loadFont } from "../utils/fontLoader";
import { createBillboardPole, createBillboardSign, createTexturedPlane, createFloatingLabel } from "./Shapes";

const BASE_URL: string = (import.meta.env as any).BASE_URL;

const BILLBOARD_CONFIG = {
	horizontal: {
		poleSize: { x: 1, y: 5, z: 1 },
		signSize: { x: 30, y: 15, z: 1 },
		signOffsetY: 10,
	},
	vertical: {
		poleSize: { x: 1, y: 2.5, z: 1 },
		signSize: { x: 15, y: 20, z: 1 },
		signOffsetY: 11.25,
	},
	borderColor: 0x000000,
	woodTexture: `${BASE_URL}img/woodTexture.jpg`,
} as const;

const PLACEHOLDER_IMAGE = `${BASE_URL}img/project-placeholder.png`;

const BILLBOARDS_CONFIG = [
	{
		position: { x: -80, y: 2.5, z: -70 },
		texture: PLACEHOLDER_IMAGE, // TODO: 替换为项目截图
		url: "https://github.com/liuyuanquan/portfolio-3d",
		type: "horizontal" as const,
		rotation: Math.PI * 0.22,
		textPlane: {
			texture: PLACEHOLDER_IMAGE,
			position: { x: -70, y: 0.01, z: -48 },
			size: { x: 15, y: 30 },
		},
	},
	{
		position: { x: -45, y: 2.5, z: -78 },
		texture: PLACEHOLDER_IMAGE, // TODO: 替换为项目截图
		url: "https://github.com/liuyuanquan/portfolio-3d",
		type: "horizontal" as const,
		rotation: Math.PI * 0.17,
		textPlane: {
			texture: PLACEHOLDER_IMAGE,
			position: { x: -42, y: 0.01, z: -53 },
			size: { x: 15, y: 30 },
		},
	},
	{
		position: { x: -17, y: 1.25, z: -75 },
		texture: PLACEHOLDER_IMAGE, // TODO: 替换为项目截图
		url: "https://github.com/liuyuanquan/portfolio-3d",
		type: "vertical" as const,
		rotation: Math.PI * 0.15,
		textPlane: {
			texture: PLACEHOLDER_IMAGE,
			position: { x: -14, y: 0.01, z: -49 },
			size: { x: 15, y: 30 },
		},
	},
] as const;

/**
 * 创建广告牌
 */
export function createBillboard(options: {
	position: { x: number; y: number; z: number };
	texture: string;
	url: string;
	type?: "horizontal" | "vertical";
	rotation?: number;
}): { pole: THREE.Mesh; sign: THREE.Mesh } {
	const { borderColor, woodTexture } = BILLBOARD_CONFIG;
	const { position, texture, url, type = "horizontal", rotation = 0 } = options;
	const { x, y, z } = position;

	const config = type === "vertical" ? BILLBOARD_CONFIG.vertical : BILLBOARD_CONFIG.horizontal;

	const pole = createBillboardPole({
		position: { x, y, z },
		size: config.poleSize,
		rotation,
		texture: woodTexture,
	});

	const sign = createBillboardSign({
		position: { x, y: y + config.signOffsetY, z },
		size: config.signSize,
		rotation,
		texture,
		borderColor,
		url,
		addPhysics: type === "vertical",
	});

	return { pole, sign };
}

/**
 * 创建所有广告牌
 */
export function createBillboards(): void {
	for (const itemConfig of BILLBOARDS_CONFIG) {
		const billboard = createBillboard(itemConfig);

		scene.add(billboard.pole);
		scene.add(billboard.sign);
		cursorHoverObjects.push(billboard.sign);

		const textPlane = createTexturedPlane({
			position: itemConfig.textPlane.position,
			texture: itemConfig.textPlane.texture,
			size: itemConfig.textPlane.size,
			useAlphaMap: true,
			textureOptions: {
				magFilter: THREE.NearestFilter,
				minFilter: THREE.LinearFilter,
			},
		});
		scene.add(textPlane);
	}

	// 创建 "PROJECTS" 文本（基于第二个广告牌的 textPlane 位置）
	const secondBillboardTextPlane = BILLBOARDS_CONFIG[1].textPlane;
	loadFont({
		onLoad: (font) => {
			const projectsLabel = createFloatingLabel({
				font,
				position: { x: secondBillboardTextPlane.position.x, y: 0.01, z: secondBillboardTextPlane.position.z + 23 },
				text: "PROJECTS",
				size: 3,
				rotateX: true,
			});
			scene.add(projectsLabel);
		},
	});
}
