import * as THREE from "three";
import { World, resourceManager } from "../core";
import { createFloatingLabel } from "./Shapes";
import { BILLBOARDS_CONFIG } from "../config";

/**
 * 广告牌对象类
 * 负责创建和管理所有广告牌，包括杆、面板、文本平面和项目标签
 */
export class Billboards {
	/** 水平广告牌配置 */
	private static readonly HORIZONTAL_CONFIG = {
		poleSize: { x: 1, y: 5, z: 1 },
		signSize: { x: 30, y: 15, z: 1 },
		signOffsetY: 10,
	} as const;

	/** 垂直广告牌配置 */
	private static readonly VERTICAL_CONFIG = {
		poleSize: { x: 1, y: 2.5, z: 1 },
		signSize: { x: 15, y: 20, z: 1 },
		signOffsetY: 11.25,
	} as const;

	/** 边框颜色 */
	private static readonly BORDER_COLOR = 0x000000;

	/** 木材纹理路径 */
	private static readonly WOOD_TEXTURE = `billboard-wood.webp`;

	/** World 实例 */
	private world: World;
	/** 广告牌列表 */
	private billboards: BillboardItem[] = [];
	/** PROJECTS 文本标签 */
	private projectsLabel!: THREE.Mesh;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 * 包括所有广告牌对象和 PROJECTS 标签
	 */
	public addWorld(): void {
		for (const billboard of this.billboards) {
			this.addBillboardToScene(billboard);
			this.registerBillboardPhysics(billboard);
		}
		this.world.scene.add(this.projectsLabel);
	}

	/**
	 * 初始化广告牌
	 * 根据配置创建所有广告牌对象和 PROJECTS 标签
	 */
	private init(): void {
		const borderColor = Billboards.BORDER_COLOR;

		for (const itemConfig of BILLBOARDS_CONFIG.billboards) {
			const { position, texture, url, type = "horizontal", rotation = 0 } = itemConfig;
			const { x, y, z } = position;

			const config = type === "vertical" ? Billboards.VERTICAL_CONFIG : Billboards.HORIZONTAL_CONFIG;

			const pole = this.createBillboardPole({ x, y, z }, config.poleSize, rotation);

			const sign = this.createBillboardSign({
				position: { x, y: y + config.signOffsetY, z },
				size: config.signSize,
				rotation,
				texture,
				borderColor,
				url,
			});

			const textPlane = this.createTexturedPlane(itemConfig.textPlane.position, itemConfig.textPlane.size, itemConfig.textPlane.texture);

			this.billboards.push({
				pole,
				sign,
				textPlane,
				itemConfig,
			});
		}

		this.projectsLabel = this.createProjectsLabel();
	}

	/**
	 * 创建广告牌杆
	 * @param position 位置坐标
	 * @param size 尺寸
	 * @param rotation 旋转角度（绕 Y 轴）
	 * @returns 广告牌杆网格对象
	 */
	private createBillboardPole(position: { x: number; y: number; z: number }, size: { x: number; y: number; z: number }, rotation: number): THREE.Mesh {
		const mesh = new THREE.Mesh(
			new THREE.BoxBufferGeometry(size.x, size.y, size.z),
			new THREE.MeshStandardMaterial({
				map: resourceManager.loadTexture(Billboards.WOOD_TEXTURE),
			})
		);

		mesh.position.set(position.x, position.y, position.z);
		mesh.rotation.y = rotation;
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	}

	/**
	 * 创建广告牌面板
	 * @param options 配置选项
	 * @returns 广告牌面板网格对象
	 */
	private createBillboardSign(options: {
		position: { x: number; y: number; z: number };
		size: { x: number; y: number; z: number };
		rotation: number;
		texture: string;
		borderColor: number;
		url: string;
	}): THREE.Mesh {
		const { position, size, rotation, texture, borderColor, url } = options;

		const borderMaterial = new THREE.MeshBasicMaterial({ color: borderColor });
		borderMaterial.color.convertSRGBToLinear();

		const signMaterial = new THREE.MeshBasicMaterial({ map: resourceManager.loadTexture(texture) });

		// 六面材质数组：[左, 右, 上, 下, 前, 后]
		const materials = [borderMaterial, borderMaterial, borderMaterial, borderMaterial, signMaterial, borderMaterial];

		const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), materials);

		mesh.position.set(position.x, position.y, position.z);
		mesh.rotation.y = rotation;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.userData = { URL: url };

		return mesh;
	}

	/**
	 * 创建纹理平面
	 * @param position 位置坐标
	 * @param size 尺寸（x, y）
	 * @param texture 纹理路径
	 * @returns 纹理平面网格对象
	 */
	private createTexturedPlane(position: { x: number; y: number; z: number }, size: { x: number; y: number }, texture: string): THREE.Mesh {
		const textureMap = resourceManager.loadTexture(texture, {
			magFilter: THREE.NearestFilter,
			minFilter: THREE.LinearFilter,
		});

		const material = new THREE.MeshBasicMaterial({
			alphaMap: textureMap,
			transparent: true,
			opacity: 1,
			depthWrite: true,
			depthTest: true,
		});

		const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(size.x, size.y), material);
		mesh.position.set(position.x, position.y, position.z);
		mesh.rotation.x = -Math.PI * 0.5;
		mesh.renderOrder = 1;

		return mesh;
	}

	/**
	 * 创建 "PROJECTS" 文本标签
	 * 基于第二个广告牌的文本平面位置
	 * @returns PROJECTS 文本标签网格对象
	 */
	private createProjectsLabel(): THREE.Mesh {
		const secondBillboardTextPlane = BILLBOARDS_CONFIG.billboards[1].textPlane;
		const font = resourceManager.getFont()!;
		const { text, size, positionOffset, rotateX } = BILLBOARDS_CONFIG.projectsLabel;
		return createFloatingLabel({
			font,
			position: {
				x: secondBillboardTextPlane.position.x + positionOffset.x,
				y: positionOffset.y,
				z: secondBillboardTextPlane.position.z + positionOffset.z,
			},
			text,
			size,
			rotateX,
			color: 0xffffff,
		});
	}

	/**
	 * 将广告牌对象添加到场景
	 * @param billboard 广告牌项
	 */
	private addBillboardToScene(billboard: BillboardItem): void {
		const { pole, sign, textPlane } = billboard;
		this.world.scene.add(pole, sign, textPlane);
		this.world.cursorHoverObjects.push(sign);
	}

	/**
	 * 为广告牌注册物理属性
	 * @param billboard 广告牌项
	 */
	private registerBillboardPhysics(billboard: BillboardItem): void {
		const config = billboard.itemConfig.type === "vertical" ? Billboards.VERTICAL_CONFIG : Billboards.HORIZONTAL_CONFIG;

		// 为广告牌杆添加物理属性
		this.world.physicsEngine.addRigidPhysics(billboard.pole, {
			scale: config.poleSize,
		});

		// 仅为垂直类型的广告牌面板添加物理属性
		if (billboard.itemConfig.type === "vertical") {
			const quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), billboard.itemConfig.rotation);
			this.world.physicsEngine.addRigidPhysics(billboard.sign, {
				scale: config.signSize,
				quat: { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
			});
		}
	}
}
