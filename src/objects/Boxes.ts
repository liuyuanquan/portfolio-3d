import { scene } from "../core/World";
import { cursorHoverObjects } from "../core/CameraControl";
import { loadFont } from "../utils";
import { isTouchscreenDevice } from "../utils/device";
import { createLinkBox, createFloatingLabel } from "./Shapes";

// 获取 base URL（开发环境为 /，生产环境为 /portfolio-3d/）
const BASE_URL: string = (import.meta.env as any).BASE_URL;

const BOXES_CONFIG = [
	{
		position: { x: 12, y: 2, z: -70 },
		size: { x: 4, y: 4, z: 1 },
		texture: `${BASE_URL}img/GitHub.png`,
		url: "https://github.com/liuyuanquan",
		borderColor: 0xffffff,
		label: {
			position: { x: 11.875, y: 4.5, z: -70 },
			text: "Github",
		},
	},
	{
		position: { x: 19.5, y: 2, z: -70 },
		size: { x: 4, y: 4, z: 1 },
		texture: `${BASE_URL}img/juejin.png`,
		url: "https://juejin.cn/user/4089838986602078",
		borderColor: 0x1f80ff,
		label: {
			position: { x: 19.625, y: 4.5, z: -70 },
			text: "Juejin",
		},
	},
	{
		position: { x: 27, y: 2, z: -70 },
		size: { x: 4, y: 4, z: 1 },
		texture: `${BASE_URL}img/QQ邮箱.png`,
		url: "mailto:522703297@qq.com",
		borderColor: 0xf8be32,
		label: {
			position: { x: 26.875, y: 4.5, z: -70 },
			text: "QQmail",
		},
	},
];

/**
 * 创建所有链接盒子
 */
export function createBoxes(): void {
	for (const boxConfig of BOXES_CONFIG) {
		const box = createLinkBox({
			position: boxConfig.position,
			size: boxConfig.size,
			texture: boxConfig.texture,
			url: boxConfig.url,
			borderColor: boxConfig.borderColor,
		});
		scene.add(box);
		cursorHoverObjects.push(box);

		// 创建对应的浮动标签
		if (boxConfig.label) {
			loadFont({
				onLoad: (font) => {
					const label = createFloatingLabel({
						font,
						position: boxConfig.label.position,
						text: boxConfig.label.text,
					});
					scene.add(label);
				},
			});
		}
	}

	// 创建触摸/点击提示文本（与第二个 box 中心对齐）
	const secondBox = BOXES_CONFIG[1];
	const lineHeight = 4.5; // 行高
	loadFont({
		onLoad: (font) => {
			const lines = isTouchscreenDevice() ? ["Touch boxes with your finger", "to open links"] : ["Click on boxes with", "the mouse to open links"];

			lines.forEach((line, index) => {
				const label = createFloatingLabel({
					font,
					position: { x: secondBox.position.x, y: 0.01, z: secondBox.position.z + 10 + index * lineHeight },
					text: line,
					size: 1.5,
					rotateX: true,
				});
				scene.add(label);
			});
		},
	});
}
