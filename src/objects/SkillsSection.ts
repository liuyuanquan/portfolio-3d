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
	/** 工作经历标签（立体文字） */
	private timelineLabel!: THREE.Mesh;
	/** 可点击的标签盒子 */
	private labelBox!: THREE.Mesh;
	/** 工作经历文字数组 */
	private experienceLabels: THREE.Mesh[] = [];

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		const { label } = SKILLS_SECTION_CONFIG;

		this.world.scene.add(this.timelineLabel);
		this.world.scene.add(this.labelBox);

		// 为标签盒子添加物理属性（静态物体，质量为 0）
		this.world.physicsEngine.addRigidPhysics(this.labelBox, {
			scale: label.boxSize,
			mass: 0, // 静态物体
		});

		// 将标签盒子添加到可交互对象列表
		if (label.url) {
			this.labelBox.userData.URL = label.url;
			this.world.cursorHoverObjects.push(this.labelBox);
		}

		for (const experienceLabel of this.experienceLabels) {
			this.world.scene.add(experienceLabel);
		}
	}

	/**
	 * 初始化技能展示区域
	 */
	private init(): void {
		this.timelineLabel = this.createTimelineLabel();
		this.labelBox = this.createLabelBox();
		this.experienceLabels = this.createExperienceLabels();
	}

	/**
	 * 创建工作经历标签（立体文字）
	 * @returns 工作经历标签网格对象
	 */
	private createTimelineLabel(): THREE.Mesh {
		const { label } = SKILLS_SECTION_CONFIG;
		const font = resourceManager.getFont()!;

		const geometry = new THREE.TextGeometry(label.text, {
			font,
			size: label.size,
			height: label.height,
			curveSegments: label.geometry.curveSegments,
			bevelEnabled: label.geometry.bevelEnabled,
			bevelThickness: label.geometry.bevelThickness,
			bevelSize: label.geometry.bevelSize,
			bevelOffset: label.geometry.bevelOffset ?? 0,
			bevelSegments: label.geometry.bevelSegments ?? 1,
		});
		geometry.computeBoundingBox();
		geometry.computeVertexNormals();
		if (geometry.boundingBox) {
			const xMid = label.translateX * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
			geometry.translate(xMid, 0, 0);
		}

		const mesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), [
			new THREE.MeshBasicMaterial({ color: label.color }),
			new THREE.MeshPhongMaterial({ color: label.color }),
		]);
		mesh.position.set(label.position.x, label.position.y, label.position.z);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.renderOrder = 1;

		return mesh;
	}

	/**
	 * 创建可点击的标签盒子
	 * @returns 标签盒子网格对象
	 */
	private createLabelBox(): THREE.Mesh {
		const { label } = SKILLS_SECTION_CONFIG;
		const { boxSize, boxColor, position } = label;

		const geometry = new THREE.BoxBufferGeometry(boxSize.x, boxSize.y, boxSize.z);
		const material = new THREE.MeshPhongMaterial({
			color: boxColor,
			transparent: true,
			opacity: 0,
			depthWrite: false,
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(position.x, position.y, position.z);

		return mesh;
	}

	/**
	 * 创建工作经历文字标签
	 * @returns 工作经历文字标签数组
	 */
	private createExperienceLabels(): THREE.Mesh[] {
		const { experiences } = SKILLS_SECTION_CONFIG;
		const font = resourceManager.getFont()!;

		return experiences.map((experience) =>
			createFloatingLabel({
				font,
				position: experience.position,
				text: experience.text,
				size: experience.size,
				rotateX: true,
				color: 0x00ff00,
			})
		);
	}
}
