import { scene } from "../core/World";
import { createTexturedPlane, createFloatingLabel } from "./Shapes";
import { loadFont } from "../utils/fontLoader";

const BASE_URL: string = (import.meta.env as any).BASE_URL;

const CONFIG = {
	position: { x: 61, y: 0.025, z: 13 },
	size: { x: 30, y: 60 },
	texture: `${BASE_URL}img/activities_text.png`,
	receiveShadow: true,
	label: {
		position: { x: 61, y: 0.01, z: -15 },
		text: "TIMELINE",
		size: 3,
	},
} as const;

/**
 * 创建技能展示区域
 */
export function createSkillsSection(): void {
	const { position, size, texture, receiveShadow, label } = CONFIG;

	const skillsSection = createTexturedPlane({
		position,
		size,
		texture,
		receiveShadow,
	});
	scene.add(skillsSection);

	// 创建 "TIMELINE" 标签
	loadFont({
		onLoad: (font) => {
			const timelineLabel = createFloatingLabel({
				font,
				position: label.position,
				text: label.text,
				size: label.size,
				rotateX: true,
			});
			scene.add(timelineLabel);
		},
	});
}
