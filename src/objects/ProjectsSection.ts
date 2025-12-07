import * as THREE from "three";
import { World, resourceManager } from "../core";
import { PROJECTS_SECTION_CONFIG } from "../config";

/**
 * 项目展示区域对象类
 * 负责创建和管理项目展示区域
 */
export class ProjectsSection {
	/** World 实例 */
	private world: World;
	/** 项目盒子对象 */
	public projectBox!: THREE.Mesh;
	/** 轮廓线对象 */
	private outline: THREE.LineSegments | null = null;
	/** 文本网格数组 */
	private textMeshes: THREE.Mesh[] = [];

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		const { size } = PROJECTS_SECTION_CONFIG;

		this.world.scene.add(this.projectBox);

		if (this.outline) {
			this.world.scene.add(this.outline);
		}

		this.world.physicsEngine.addRigidPhysics(this.projectBox, { scale: size });

		for (const textMesh of this.textMeshes) {
			this.world.scene.add(textMesh);
		}
	}

	/**
	 * 初始化项目展示区域
	 */
	private init(): void {
		this.projectBox = this.createProjectBox();
		this.textMeshes = this.createTexts();
	}

	/**
	 * 创建项目盒子对象
	 * @returns 项目盒子网格对象
	 */
	private createProjectBox(): THREE.Mesh {
		const { position, size, color, showOutline, outlineColor } = PROJECTS_SECTION_CONFIG;
		const { x, y, z } = position;

		const geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
		const material = new THREE.MeshPhongMaterial({
		color,
			transparent: true,
			opacity: 0,
			depthWrite: false,
	});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);

		if (showOutline) {
			this.outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: outlineColor, linewidth: 2 }));
			this.outline.position.set(x, y, z);
	}

		return mesh;
}

	/**
	 * 创建文本网格
	 * @returns 文本网格数组
	 */
	private createTexts(): THREE.Mesh[] {
		const { text, spacing, position } = PROJECTS_SECTION_CONFIG;
		const configs = [text.name, text.role];
		const boxCenterX = position.x;
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
		}

		const mesh = new THREE.Mesh(new THREE.BufferGeometry().fromGeometry(geometry), [
			new THREE.MeshBasicMaterial({ color }),
			new THREE.MeshPhongMaterial({ color }),
		]);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	}
}
