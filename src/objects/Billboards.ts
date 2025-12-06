import * as THREE from "three";
import { scene } from "../resources/world";
import { addRigidPhysics } from "./PhysicsHelpers";
import { loadTexture } from "../utils/textureLoader";
import { cursorHoverObjects } from "../resources/cameraUtils";

// 获取 base URL（开发环境为 /，生产环境为 /portfolio-3d/）
const BASE_URL: string = (import.meta.env as any).BASE_URL;

/**
 * 广告牌配置常量
 */
const BILLBOARD_CONFIG = {
	/** 水平广告牌配置 */
	horizontal: {
		poleScale: { x: 1, y: 5, z: 1 },
		signScale: { x: 30, y: 15, z: 1 },
		signOffsetY: 10,
	},
	/** 垂直广告牌配置 */
	vertical: {
		poleScale: { x: 1, y: 2.5, z: 1 },
		signScale: { x: 15, y: 20, z: 1 },
		signOffsetY: 11.25,
	},
	/** 边框颜色 */
	borderColor: 0x000000,
	/** 木纹纹理路径 */
	woodTexture: `${BASE_URL}img/woodTexture.jpg`,
} as const;

/**
 * 占位图路径（项目截图完成后替换为实际路径）
 */
const PLACEHOLDER_IMAGE = `${BASE_URL}img/project-placeholder.png`;

/**
 * 广告牌配置
 */
const BILLBOARDS_CONFIG = [
	{
		x: -80,
		y: 2.5,
		z: -70,
		textureImage: PLACEHOLDER_IMAGE, // TODO: 替换为项目截图
		urlLink: "https://github.com/liuyuanquan/portfolio-3d",
		type: "horizontal" as const,
		rotation: Math.PI * 0.22,
	},
	{
		x: -45,
		y: 2.5,
		z: -78,
		textureImage: PLACEHOLDER_IMAGE, // TODO: 替换为项目截图
		urlLink: "https://github.com/liuyuanquan/portfolio-3d",
		type: "horizontal" as const,
		rotation: Math.PI * 0.17,
	},
	{
		x: -17,
		y: 1.25,
		z: -75,
		textureImage: PLACEHOLDER_IMAGE, // TODO: 替换为项目截图
		urlLink: "https://github.com/liuyuanquan/portfolio-3d",
		type: "vertical" as const,
		rotation: Math.PI * 0.15,
	},
] as const;

/**
 * 创建广告牌杆
 *
 * @param options - 配置选项
 *   - x: X 坐标
 *   - y: Y 坐标
 *   - z: Z 坐标
 *   - poleScale: 杆的尺寸
 *   - rotation: 旋转角度
 *   - woodTexture: 木纹纹理路径
 *
 * @returns THREE.Mesh - 广告牌杆对象
 */
function createBillboardPole(options: {
	x: number;
	y: number;
	z: number;
	poleScale: { x: number; y: number; z: number };
	rotation: number;
	woodTexture: string;
}): THREE.Mesh {
	const { x, y, z, poleScale, rotation, woodTexture } = options;

	// 创建广告牌杆
	const billboardPole = new THREE.Mesh(
		new THREE.BoxBufferGeometry(poleScale.x, poleScale.y, poleScale.z),
		new THREE.MeshStandardMaterial({
			map: loadTexture(woodTexture),
		})
	);

	// 设置位置和旋转
	billboardPole.position.set(x, y, z);
	billboardPole.rotation.y = rotation;

	// 设置阴影属性
	billboardPole.castShadow = true;
	billboardPole.receiveShadow = true;

	// 添加到场景
	scene.add(billboardPole);

	// 添加物理属性
	addRigidPhysics(billboardPole, {
		scale: poleScale,
	});

	return billboardPole;
}

/**
 * 创建广告牌面板
 *
 * @param options - 配置选项
 *   - x: X 坐标
 *   - y: Y 坐标
 *   - z: Z 坐标
 *   - signScale: 面板的尺寸
 *   - rotation: 旋转角度
 *   - textureImage: 面板纹理图片路径
 *   - borderColor: 边框颜色
 *   - urlLink: 点击链接
 *   - addPhysics: 是否添加物理属性，默认 false
 *
 * @returns THREE.Mesh - 广告牌面板对象
 */
function createBillboardSign(options: {
	x: number;
	y: number;
	z: number;
	signScale: { x: number; y: number; z: number };
	rotation: number;
	textureImage: string;
	borderColor: number;
	urlLink: string;
	addPhysics?: boolean;
}): THREE.Mesh {
	const { x, y, z, signScale, rotation, textureImage, borderColor, urlLink, addPhysics = false } = options;

	// 创建纹理
	const borderMaterial = new THREE.MeshBasicMaterial({
		color: borderColor,
	});
	borderMaterial.color.convertSRGBToLinear();

	const texture = loadTexture(textureImage);
	const signMaterial = new THREE.MeshBasicMaterial({
		map: texture,
	});

	// 创建六面材质数组：左、右、上、下、前、后
	const materials = [
		borderMaterial, // Left side
		borderMaterial, // Right side
		borderMaterial, // Top side
		borderMaterial, // Bottom side
		signMaterial, // Front side
		borderMaterial, // Back side
	];

	const billboardSign = new THREE.Mesh(new THREE.BoxGeometry(signScale.x, signScale.y, signScale.z), materials);

	// 设置位置和旋转
	billboardSign.position.set(x, y, z);
	billboardSign.rotation.y = rotation;

	// 设置阴影属性
	billboardSign.castShadow = true;
	billboardSign.receiveShadow = true;

	// 设置交互数据
	billboardSign.userData = { URL: urlLink };

	// 添加到场景
	scene.add(billboardSign);

	// 添加物理属性（如果需要）
	if (addPhysics) {
		// 将 Three.js 的 rotation.y 转换为四元数
		const quat = new THREE.Quaternion();
		quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
		addRigidPhysics(billboardSign, {
			scale: signScale,
			quat: {
				x: quat.x,
				y: quat.y,
				z: quat.z,
				w: quat.w,
			},
		});
	}

	return billboardSign;
}

/**
 * 创建广告牌
 *
 * 该函数用于创建广告牌对象，支持水平和垂直两种方向。
 * 广告牌由两部分组成：
 * 1. 广告牌杆（pole）：支撑广告牌的立柱
 * 2. 广告牌面板（sign）：显示内容的平面
 *
 * 视觉属性：
 * - 广告牌杆使用木纹纹理（woodTexture.jpg）作为材质
 * - 广告牌面板使用提供的纹理图片作为正面材质
 * - 面板的其他面使用黑色边框材质，形成边框效果
 * - 广告牌可以投射和接收阴影，增强场景真实感
 *
 * 物理属性：
 * - 广告牌杆为静态物体（质量为 0），不会移动
 * - 水平广告牌的面板不添加物理属性，仅作为视觉元素
 * - 垂直广告牌的面板为静态物体（质量为 0），会参与物理碰撞
 * - 碰撞形状为盒子（Box），尺寸与视觉尺寸完全一致
 *
 * @param options - 配置选项对象
 *   - x: 广告牌在 X 轴上的位置
 *   - y: 广告牌在 Y 轴上的位置
 *   - z: 广告牌在 Z 轴上的位置
 *   - textureImage: 广告牌面板的纹理图片路径
 *   - urlLink: 点击广告牌时跳转的链接
 *   - type: 广告牌类型，"horizontal"（水平）或 "vertical"（垂直），默认 "horizontal"
 *   - rotation: 广告牌的旋转角度（弧度），默认 0
 *   - poleScale: 广告牌杆的尺寸，默认根据 type 使用对应配置
 *   - signScale: 广告牌面板的尺寸，默认根据 type 使用对应配置
 *
 * @returns BillboardResult - 包含 pole 和 sign 的对象
 */
export function createBillboard(options: {
	x: number;
	y: number;
	z: number;
	textureImage: string;
	urlLink: string;
	type?: "horizontal" | "vertical";
	rotation?: number;
}): BillboardResult {
	const { borderColor, woodTexture } = BILLBOARD_CONFIG;
	const { x, y, z, textureImage, urlLink, type = "horizontal", rotation = 0 } = options;

	// 根据类型选择配置
	const config = type === "vertical" ? BILLBOARD_CONFIG.vertical : BILLBOARD_CONFIG.horizontal;

	// 创建广告牌杆
	const billboardPole = createBillboardPole({
		x,
		y,
		z,
		poleScale: config.poleScale,
		rotation,
		woodTexture,
	});

	// 创建广告牌面板（垂直广告牌的面板需要添加物理属性）
	const billboardSign = createBillboardSign({
		x,
		y: y + config.signOffsetY,
		z,
		signScale: config.signScale,
		rotation,
		textureImage,
		borderColor,
		urlLink,
		addPhysics: type === "vertical",
	});

	return { pole: billboardPole, sign: billboardSign };
}

/**
 * 创建所有广告牌
 *
 * 该函数用于批量创建场景中的所有广告牌，并将它们的面板对象添加到交互对象列表中。
 * 面板对象会自动添加到 cursorHoverObjects 数组中，实现点击和悬停效果。
 *
 * @returns void
 */
export function createBillboards(): void {
	for (const itemConfig of BILLBOARDS_CONFIG) {
		const billboard = createBillboard(itemConfig);
		cursorHoverObjects.push(billboard.sign);
	}
}
