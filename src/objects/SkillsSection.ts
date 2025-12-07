import * as THREE from "three";
import { World, resourceManager } from "../core";
import { SKILLS_SECTION_CONFIG } from "../config";
import { createFloatingLabel } from "./Shapes";

/**
 * 技能展示区域对象类
 * 负责创建和管理技能展示区域
 */
export class SkillsSection {
	/** World 实例 */
	private world: World;
	/** 技能展示平面对象 */
	public skillsSection!: THREE.Mesh;
	/** TIMELINE 标签 */
	private timelineLabel!: THREE.Mesh;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		this.world.scene.add(this.skillsSection);
		this.world.scene.add(this.timelineLabel);
	}

	/**
	 * 初始化技能展示区域
	 */
	private init(): void {
		this.skillsSection = this.createSkillsPlane();
		this.timelineLabel = this.createTimelineLabel();
	}

	/**
	 * 创建技能展示平面
	 * @returns 技能展示平面网格对象
	 */
	private createSkillsPlane(): THREE.Mesh {
		const { position, size, texture, receiveShadow } = SKILLS_SECTION_CONFIG;

		const material = new THREE.MeshBasicMaterial({
			map: resourceManager.loadTexture(texture),
			transparent: true,
			opacity: 1,
		});

		const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(size.x, size.y), material);
		mesh.position.set(position.x, position.y, position.z);
		mesh.rotation.x = -Math.PI * 0.5;
		mesh.renderOrder = 1;
		mesh.receiveShadow = receiveShadow;

		return mesh;
	}

	/**
	 * 创建 TIMELINE 标签
	 * @returns TIMELINE 标签网格对象
	 */
	private createTimelineLabel(): THREE.Mesh {
		const { label } = SKILLS_SECTION_CONFIG;
		const font = resourceManager.getFont()!;

		return createFloatingLabel({
			font,
			position: label.position,
			text: label.text,
			size: label.size,
			rotateX: true,
			color: 0xff0000,
		});
	}
}
