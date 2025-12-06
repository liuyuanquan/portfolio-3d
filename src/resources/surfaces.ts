/**
 * 表面和文本创建模块
 * 负责创建 3D 场景中的文本和平面表面
 *
 * 功能：
 * - 创建 3D 文本对象
 * - 创建技能展示区域
 * - 在平面上创建文本纹理
 */
import * as THREE from "three";
import { scene } from "./world";
import { loadTexture } from "../utils/textureLoader";

// ==================== 配置常量 ====================

/**
 * BASE URL（开发环境为 /，生产环境为 /portfolio-3d/）
 */
const BASE_URL: string = (import.meta.env as any).BASE_URL;

/**
 * 字体文件路径
 */
const FONT_CONFIG = {
	/** Roboto 字体路径 */
	robotoRegular: `${BASE_URL}json/Roboto_Regular.json`,
} as const;

/**
 * 文本材质配置
 */
const TEXT_MATERIAL_CONFIG = {
	/** 文本颜色（白色） */
	color: 0xffffff,
	/** 透明度 */
	opacity: 1,
	/** 双面渲染 */
	side: THREE.DoubleSide,
} as const;

/**
 * 技能区域配置
 */
const SKILLS_SECTION_CONFIG = {
	/** 默认 Y 轴缩放 */
	defaultYScale: 0.1,
	/** 渲染顺序 */
	renderOrder: 1,
	/** 旋转角度（-90度，使平面水平） */
	rotationX: -Math.PI * 0.5,
} as const;

// ==================== 类型定义 ====================

/**
 * 位置坐标接口
 */
interface Position {
	/** X 轴位置 */
	x: number;
	/** Y 轴位置 */
	y: number;
	/** Z 轴位置 */
	z: number;
}

/**
 * Three.js 字体类型
 */
type Font = THREE.Font;

// ==================== 辅助函数 ====================

/**
 * 计算文本的居中偏移量
 *
 * @param geometry - 文本几何体
 * @returns X 轴偏移量
 */
function calculateTextCenterOffset(geometry: THREE.ShapeBufferGeometry): number {
	geometry.computeBoundingBox();
	const boundingBox = geometry.boundingBox;
	if (!boundingBox) {
		return 0;
	}
	return -0.5 * (boundingBox.max.x - boundingBox.min.x);
}

/**
 * 创建文本材质
 *
 * @returns 文本材质对象
 */
function createTextMaterial(): THREE.MeshBasicMaterial {
	return new THREE.MeshBasicMaterial({
		color: TEXT_MATERIAL_CONFIG.color,
		transparent: true,
		opacity: TEXT_MATERIAL_CONFIG.opacity,
		side: TEXT_MATERIAL_CONFIG.side,
	});
}

/**
 * 创建文本网格对象
 *
 * @param geometry - 文本几何体
 * @param material - 文本材质
 * @param position - 位置坐标
 * @param rotationX - X 轴旋转角度（可选）
 * @returns 文本网格对象
 */
function createTextMesh(geometry: THREE.ShapeBufferGeometry, material: THREE.MeshBasicMaterial, position: Position, rotationX?: number): THREE.Mesh {
	const text = new THREE.Mesh(geometry, material);
	text.position.set(position.x, position.y, position.z);
	if (rotationX !== undefined) {
		text.rotation.x = rotationX;
	}
	return text;
}

// ==================== 主要函数 ====================

/**
 * 创建简单文本
 *
 * 在 3D 场景中创建水平放置的文本对象（使用字体文件）
 *
 * @param x - X 轴位置
 * @param y - Y 轴位置
 * @param z - Z 轴位置
 * @param inputText - 要显示的文本内容
 * @param fontSize - 字体大小
 */
export function simpleText(x: number, y: number, z: number, inputText: string, fontSize: number): void {
	const textLoader = new THREE.FontLoader();

	textLoader.load(
		FONT_CONFIG.robotoRegular,
		(font: Font) => {
			// 创建文本形状
			const shapes = font.generateShapes(inputText, fontSize);

			// 创建几何体
			const geometry = new THREE.ShapeBufferGeometry(shapes);

			// 计算居中偏移
			const xMid = calculateTextCenterOffset(geometry);
			geometry.translate(xMid, 0, 0);

			// 创建材质
			const material = createTextMaterial();

			// 创建网格对象
			const text = createTextMesh(geometry, material, { x, y, z }, SKILLS_SECTION_CONFIG.rotationX);

			// 添加到场景
			scene.add(text);
		},
		undefined, // onProgress
		(error: ErrorEvent) => {
			console.error("字体文件加载错误:", error);
		}
	);
}

/**
 * 创建技能展示区域
 *
 * 创建一个带有纹理的平面，用于展示技能信息
 *
 * @param x - X 轴位置
 * @param y - Y 轴位置
 * @param z - Z 轴位置
 * @param xScale - X 轴缩放
 * @param zScale - Z 轴缩放
 * @param boxTexture - 纹理图片路径
 * @param URLLink - 可选的链接 URL（点击时打开）
 */
export function allSkillsSection(
	x: number,
	y: number,
	z: number,
	xScale: number,
	zScale: number,
	boxTexture: string,
	URLLink: string | null = null
): void {
	// 创建平面几何体
	const geometry = new THREE.PlaneBufferGeometry(xScale, zScale);

	// 加载纹理
	const texture = loadTexture(boxTexture);

	// 创建材质
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true,
	});
	material.depthWrite = true;
	material.depthTest = true;

	// 创建网格对象
	const linkBox = new THREE.Mesh(geometry, material);
	linkBox.position.set(x, y, z);
	linkBox.renderOrder = SKILLS_SECTION_CONFIG.renderOrder;
	linkBox.rotation.x = SKILLS_SECTION_CONFIG.rotationX;
	linkBox.receiveShadow = true;

	// 设置用户数据（用于点击检测）
	if (URLLink) {
		linkBox.userData = { URL: URLLink };
	}

	// 添加到场景
	scene.add(linkBox);
}
