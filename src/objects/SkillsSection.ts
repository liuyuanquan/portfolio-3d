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
	/** 文本网格数组（name 和 role） */
	private textMeshes: THREE.Mesh[] = [];
	/** 可点击的标签盒子 */
	private labelBox!: THREE.Mesh;
	/** 标签盒子轮廓线 */
	private labelBoxOutline: THREE.LineSegments | null = null;
	/** 工作经历文字数组 */
	private experienceLabels: THREE.Mesh[] = [];
	/** 可点击的 experiences 区域盒子 */
	private experiencesBox!: THREE.Mesh;
	/** experiences 区域盒子轮廓线 */
	private experiencesBoxOutline: THREE.LineSegments | null = null;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		this.world.scene.add(this.labelBox);

		if (this.labelBoxOutline) {
			this.world.scene.add(this.labelBoxOutline);
		}

		// 为标签盒子添加物理属性（静态物体，质量为 0）
		// 获取 labelBox 的实际尺寸
		this.labelBox.geometry.computeBoundingBox();
		const boxBoundingBox = this.labelBox.geometry.boundingBox;
		if (boxBoundingBox) {
			const boxSize = {
				x: boxBoundingBox.max.x - boxBoundingBox.min.x,
				y: boxBoundingBox.max.y - boxBoundingBox.min.y,
				z: boxBoundingBox.max.z - boxBoundingBox.min.z,
			};
			this.world.physicsEngine.addRigidPhysics(this.labelBox, {
				scale: boxSize,
				mass: 0, // 静态物体
			});
		}

		// 将标签盒子添加到可交互对象列表（用于点击打开PDF）
		const { label } = SKILLS_SECTION_CONFIG;
		if (label.url) {
			this.labelBox.userData.URL = label.url;
			this.world.cursorHoverObjects.push(this.labelBox);
		}

		for (const textMesh of this.textMeshes) {
			this.world.scene.add(textMesh);
		}

		for (const experienceLabel of this.experienceLabels) {
			this.world.scene.add(experienceLabel);
		}

		// 为 experiences 区域盒子添加交互（不添加物理属性，避免阻挡小球）
		if (this.experiencesBox) {
			this.world.scene.add(this.experiencesBox);

			if (this.experiencesBoxOutline) {
				this.world.scene.add(this.experiencesBoxOutline);
			}

			const { experiences } = SKILLS_SECTION_CONFIG;
			if (experiences.url) {
				this.experiencesBox.userData.URL = experiences.url;
				this.world.cursorHoverObjects.push(this.experiencesBox);
			}
		}
	}

	/**
	 * 初始化技能展示区域
	 */
	private init(): void {
		this.textMeshes = this.createTexts();
		this.createLabelBox();
		this.createLabelBoxOutline();
		this.experienceLabels = this.createExperienceLabels();
		this.createExperiencesBox();
		this.createExperiencesBoxOutline();
	}

	/**
	 * 创建文本网格
	 * @returns 文本网格数组
	 */
	private createTexts(): THREE.Mesh[] {
		const { label } = SKILLS_SECTION_CONFIG;
		const { text, spacing, centerX } = label;
		const configs = [text.name, text.role];
		const boxCenterX = centerX;
		const font = resourceManager.getFont()!;

		// 创建文本网格并计算宽度
		const items = configs.map((config) => {
			const mesh = this.createTextMesh({
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
		});

		return items.map((item) => item.mesh);
	}

	/**
	 * 创建文本网格
	 * @param option 文本创建选项
	 * @returns 文本网格对象
	 */
	private createTextMesh(option: {
		font: THREE.Font;
		text: string;
		size: number;
		height: number;
		color: number;
		geometry: {
			curveSegments: number;
			bevelEnabled: boolean;
			bevelThickness: number;
			bevelSize: number;
			bevelOffset?: number;
			bevelSegments?: number;
		};
		translateX: number;
	}): THREE.Mesh {
		const { font, text, size, height, color, geometry: geometryConfig, translateX } = option;

		const geometry = new THREE.TextGeometry(text, {
			font,
			size,
			height,
			curveSegments: geometryConfig.curveSegments,
			bevelEnabled: geometryConfig.bevelEnabled,
			bevelThickness: geometryConfig.bevelThickness,
			bevelSize: geometryConfig.bevelSize,
			bevelOffset: geometryConfig.bevelOffset ?? 0,
			bevelSegments: geometryConfig.bevelSegments ?? 1,
		});
		geometry.computeBoundingBox();
		geometry.computeVertexNormals();
		if (geometry.boundingBox) {
			const xMid = translateX * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
			geometry.translate(xMid, 0, 0);
			// translate 后重新计算边界框
			geometry.computeBoundingBox();
		}

		const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		// 转换为 BufferGeometry 后重新计算边界框
		bufferGeometry.computeBoundingBox();

		const mesh = new THREE.Mesh(bufferGeometry, [new THREE.MeshBasicMaterial({ color }), new THREE.MeshPhongMaterial({ color })]);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	}

	/**
	 * 创建可点击的标签盒子（基于实际文本的边界框）
	 */
	private createLabelBox(): void {
		const { label } = SKILLS_SECTION_CONFIG;
		const { color } = label;

		if (this.textMeshes.length === 0) {
			console.error("文本网格未创建，无法创建 labelBox");
			return;
		}

		// 计算所有文本网格的合并边界框
		const boundingBox = new THREE.Box3();
		this.textMeshes.forEach((mesh) => {
			mesh.geometry.computeBoundingBox();
			if (mesh.geometry.boundingBox) {
				const meshBox = mesh.geometry.boundingBox.clone();
				// 使用 mesh.position 来转换到世界坐标
				meshBox.translate(mesh.position);
				boundingBox.union(meshBox);
			}
		});

		// 计算尺寸和位置
		const size = {
			x: boundingBox.max.x - boundingBox.min.x,
			y: boundingBox.max.y - boundingBox.min.y,
			z: boundingBox.max.z - boundingBox.min.z,
		};
		const center = {
			x: (boundingBox.min.x + boundingBox.max.x) / 2,
			y: (boundingBox.min.y + boundingBox.max.y) / 2,
			z: (boundingBox.min.z + boundingBox.max.z) / 2,
		};

		const geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
		const material = new THREE.MeshPhongMaterial({
			color,
			transparent: true,
			opacity: 0,
			depthWrite: false,
		});
		this.labelBox = new THREE.Mesh(geometry, material);
		this.labelBox.position.set(center.x, center.y, center.z);
	}

	/**
	 * 创建标签盒子轮廓线（基于实际文本的边界框，与 labelBox 使用相同的尺寸和位置）
	 */
	private createLabelBoxOutline(): void {
		const { label } = SKILLS_SECTION_CONFIG;
		const { showOutline, outlineColor } = label;

		if (!showOutline) {
			return;
		}

		if (this.textMeshes.length === 0) {
			return;
		}

		// 计算所有文本网格的合并边界框（与 createLabelBox 使用相同的逻辑）
		const boundingBox = new THREE.Box3();
		this.textMeshes.forEach((mesh) => {
			mesh.geometry.computeBoundingBox();
			if (mesh.geometry.boundingBox) {
				const meshBox = mesh.geometry.boundingBox.clone();
				// 使用 mesh.position 来转换到世界坐标
				meshBox.translate(mesh.position);
				boundingBox.union(meshBox);
			}
		});

		// 计算尺寸和位置（与 labelBox 一致）
		const size = {
			x: boundingBox.max.x - boundingBox.min.x,
			y: boundingBox.max.y - boundingBox.min.y,
			z: boundingBox.max.z - boundingBox.min.z,
		};
		const center = {
			x: (boundingBox.min.x + boundingBox.max.x) / 2,
			y: (boundingBox.min.y + boundingBox.max.y) / 2,
			z: (boundingBox.min.z + boundingBox.max.z) / 2,
		};

		const geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
		this.labelBoxOutline = new THREE.LineSegments(
			new THREE.EdgesGeometry(geometry),
			new THREE.LineBasicMaterial({ color: outlineColor, linewidth: 2 })
		);
		this.labelBoxOutline.position.set(center.x, center.y, center.z);
	}

	/**
	 * 创建工作经历文字标签
	 * @returns 工作经历文字标签数组
	 */
	private createExperienceLabels(): THREE.Mesh[] {
		const { experiences } = SKILLS_SECTION_CONFIG;
		const font = resourceManager.getFont()!;

		return experiences.items.map((experience) =>
			createFloatingLabel({
				font,
				position: experience.position,
				text: experience.text,
				size: experience.size,
				rotateX: true,
				color: experience.color,
			})
		);
	}

	/**
	 * 创建可点击的 experiences 区域盒子（基于实际文字网格的边界框）
	 */
	private createExperiencesBox(): void {
		if (!this.experienceLabels || this.experienceLabels.length === 0) {
			return;
		}

		// 计算所有文字网格的合并边界框
		const boundingBox = new THREE.Box3();
		this.experienceLabels.forEach((mesh) => {
			mesh.geometry.computeBoundingBox();
			if (mesh.geometry.boundingBox) {
				const meshBox = mesh.geometry.boundingBox.clone();
				// 使用 mesh.position 来转换到世界坐标
				meshBox.translate(mesh.position);
				boundingBox.union(meshBox);
			}
		});

		// 计算尺寸和位置（长宽完全匹配文字边缘，高度比文字高0.01）
		const size = {
			x: boundingBox.max.x - boundingBox.min.x, // 完全匹配文字宽度
			y: boundingBox.max.y - boundingBox.min.y + 0.01, // 高度比文字本身高0.01
			z: boundingBox.max.z - boundingBox.min.z, // 完全匹配文字深度
		};
		const center = {
			x: (boundingBox.min.x + boundingBox.max.x) / 2,
			y: (boundingBox.min.y + boundingBox.max.y) / 2,
			z: (boundingBox.min.z + boundingBox.max.z) / 2,
		};

		const geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
		const material = new THREE.MeshPhongMaterial({
			color: 0xff6600,
			transparent: true,
			opacity: 0,
			depthWrite: false,
		});
		this.experiencesBox = new THREE.Mesh(geometry, material);
		this.experiencesBox.position.set(center.x, center.y, center.z);
	}

	/**
	 * 创建 experiences 区域盒子轮廓线（基于实际文字网格的边界框，与 experiencesBox 使用相同的尺寸和位置）
	 */
	private createExperiencesBoxOutline(): void {
		const { experiences } = SKILLS_SECTION_CONFIG;
		const { showOutline, outlineColor } = experiences;

		if (!showOutline) {
			return;
		}

		if (!this.experienceLabels || this.experienceLabels.length === 0) {
			return;
		}

		// 计算所有文字网格的合并边界框（与 createExperiencesBox 使用相同的逻辑）
		const boundingBox = new THREE.Box3();
		this.experienceLabels.forEach((mesh) => {
			mesh.geometry.computeBoundingBox();
			if (mesh.geometry.boundingBox) {
				const meshBox = mesh.geometry.boundingBox.clone();
				// 使用 mesh.position 来转换到世界坐标
				meshBox.translate(mesh.position);
				boundingBox.union(meshBox);
			}
		});

		// 计算尺寸和位置（与 experiencesBox 一致，长宽完全匹配文字边缘，高度比文字高0.01）
		const size = {
			x: boundingBox.max.x - boundingBox.min.x, // 完全匹配文字宽度
			y: boundingBox.max.y - boundingBox.min.y + 0.01, // 高度比文字本身高0.01
			z: boundingBox.max.z - boundingBox.min.z, // 完全匹配文字深度
		};
		const center = {
			x: (boundingBox.min.x + boundingBox.max.x) / 2,
			y: (boundingBox.min.y + boundingBox.max.y) / 2,
			z: (boundingBox.min.z + boundingBox.max.z) / 2,
		};

		const geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
		this.experiencesBoxOutline = new THREE.LineSegments(
			new THREE.EdgesGeometry(geometry),
			new THREE.LineBasicMaterial({ color: outlineColor, linewidth: 2 })
		);
		this.experiencesBoxOutline.position.set(center.x, center.y, center.z);
	}
}
