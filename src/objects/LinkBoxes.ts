import * as THREE from "three";
import { World, resourceManager } from "../core";
import { LINK_BOXES_CONFIG } from "../config";
import { isTouchscreenDevice } from "../utils";
import { createFloatingLabel } from "./Shapes";

/**
 * 链接盒子对象类
 * 负责创建和管理所有链接盒子
 */
export class LinkBoxes {
	/** World 实例 */
	private world: World;
	/** 链接盒子数组 */
	private linkBoxes: THREE.Mesh[] = [];
	/** 标签数组 */
	private labels: THREE.Mesh[] = [];
	/** 提示文本数组 */
	private instructionLabels: THREE.Mesh[] = [];

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 初始化链接盒子
	 */
	private init(): void {
		for (const boxConfig of LINK_BOXES_CONFIG.boxes) {
			const box = this.createLinkBox({
				position: boxConfig.position,
				size: boxConfig.size,
				texture: boxConfig.texture,
				url: boxConfig.url,
				borderColor: boxConfig.borderColor,
			});
			this.linkBoxes.push(box);
		}

		// 创建对应的浮动标签
		const font = resourceManager.getFont()!;
		for (const boxConfig of LINK_BOXES_CONFIG.boxes) {
			if (boxConfig.label) {
				const label = createFloatingLabel({
					font,
					position: boxConfig.label.position,
					text: boxConfig.label.text,
					color: 0xffffff,
				});
				this.labels.push(label);
			}
		}

		// 创建触摸/点击提示文本（与第二个 box 中心对齐）
		const secondBox = LINK_BOXES_CONFIG.boxes[1];
		const { instructions } = LINK_BOXES_CONFIG;
		const lines = isTouchscreenDevice() ? instructions.touchscreen : instructions.keyboard;

		lines.forEach((line, index) => {
			const label = createFloatingLabel({
				font,
				position: {
					x: secondBox.position.x,
					y: instructions.positionOffset.y,
					z: secondBox.position.z + instructions.positionOffset.z + index * instructions.lineHeight,
				},
				text: line,
				size: instructions.size,
				rotateX: true,
				color: 0xffffff,
			});
			this.instructionLabels.push(label);
		});
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		// 添加所有盒子到场景
		for (const box of this.linkBoxes) {
			this.world.scene.add(box);
			this.world.cursorHoverObjects.push(box);
		}

		// 添加所有标签到场景
		for (const label of this.labels) {
			this.world.scene.add(label);
		}

		// 添加所有提示文本到场景
		for (const label of this.instructionLabels) {
			this.world.scene.add(label);
		}
	}

	/**
	 * 创建链接盒子
	 * @param options 链接盒子选项
	 * @returns 链接盒子网格对象
	 */
	private createLinkBox(options: {
		position: { x: number; y: number; z: number };
		size: { x: number; y: number; z: number };
		texture: string;
		url: string;
		borderColor?: number;
	}): THREE.Mesh {
		const { position, size, texture, url, borderColor = 0x000000 } = options;

		const borderMaterial = new THREE.MeshBasicMaterial({ color: borderColor });
		borderMaterial.color.convertSRGBToLinear();

		const textureMap = resourceManager.loadTexture(texture);
		const frontMaterial = new THREE.MeshBasicMaterial({
			map: textureMap,
			transparent: true,
			opacity: 1, // 完全不透明，避免看到后面的物体
			color: 0xf5f5f5, // 浅灰色背景，用于纹理透明区域
			alphaTest: 0.01, // 低于此值的像素显示背景色，高于此值的像素完全不透明
		});

		// 六面材质数组：左、右、上、下、前、后
		const materials = [borderMaterial, borderMaterial, borderMaterial, borderMaterial, frontMaterial, borderMaterial];

		const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(size.x, size.y, size.z), materials);
		mesh.position.set(position.x, position.y, position.z);
		mesh.renderOrder = 1;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.userData = { URL: url, email: url };

		this.world.physicsEngine.addRigidPhysics(mesh, { scale: size });

		return mesh;
	}
}
