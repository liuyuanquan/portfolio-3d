import { scene } from "../core/World";
import { loadFont } from "../utils/fontLoader";
import { createTextMesh, createBoxWithOutline } from "./Shapes";

export const CONFIG = {
	position: {
		x: 16.2,
		y: 1,
		z: -20,
	},
	size: { x: 37, y: 3, z: 2 },
	color: 0xff6600,
	showOutline: false,
	outlineColor: 0xffffff,
} as const;

const TEXT_CONFIG = {
	name: {
		text: "Yuanquan",
		color: 0xfffc00,
		size: 3,
		height: 0.5,
		position: { x: 16.2, y: 0, z: -20 }, // 与盒子中心对齐
		geometry: {
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.1,
			bevelSize: 0.11,
			bevelOffset: 0,
			bevelSegments: 1,
		},
		translateX: -0.5, // 文本自身居中
	},
	role: {
		text: "Frontend Expert",
		color: 0x00ff08,
		size: 1.5,
		height: 0.5,
		position: { x: 16.2, y: 0, z: -20 }, // 与盒子中心对齐
		geometry: {
			curveSegments: 20,
			bevelEnabled: true,
			bevelThickness: 0.25,
			bevelSize: 0.1,
		},
		translateX: -0.5, // 文本自身居中
	},
} as const;

export function createProjectsSection(): void {
	const { position, size, color, showOutline, outlineColor } = CONFIG;

	const projectBox = createBoxWithOutline({
		position,
		size,
		color,
		showOutline,
		outlineColor,
	});
	scene.add(projectBox);

	if (showOutline && projectBox.userData.outline) {
		scene.add(projectBox.userData.outline);
	}

	createTexts();
}

function createTexts(): void {
	const configs = [TEXT_CONFIG.name, TEXT_CONFIG.role];
	const boxCenterX = CONFIG.position.x;
	const spacing = 0.5;

	loadFont({
		onLoad: (font) => {
			// 创建文本网格并计算宽度
			const items = configs.map((config) => {
				const mesh = createTextMesh({
					font,
					text: config.text,
					size: config.size,
					height: config.height,
					color: config.color,
					geometry: config.geometry,
					translateX: config.translateX,
				});
				mesh.geometry.computeBoundingBox();
				const box = mesh.geometry.boundingBox;
				const width = box ? box.max.x - box.min.x : 0;
				return { mesh, config, width };
			});

			// 计算总宽度（包括间距），用于整体居中
			const totalWidth = items.reduce((sum, item) => sum + item.width, 0) + spacing;
			let currentX = boxCenterX - totalWidth / 2;

			// 设置每个文本的位置，使其整体水平居中
			items.forEach(({ mesh, config, width }) => {
				currentX += width / 2;
				mesh.position.set(currentX, config.position.y, config.position.z);
				currentX += width / 2 + spacing;
				mesh.renderOrder = 1;
				scene.add(mesh);
			});
		},
	});
}
