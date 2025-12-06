import * as THREE from "three";
import { scene } from "../resources/world";
import { addRigidPhysics } from "./PhysicsHelpers";
import { cursorHoverObjects } from "../resources/cameraUtils";
import { loadFont, loadTexture } from "../utils";

// 获取 base URL（开发环境为 /，生产环境为 /portfolio-3d/）
const BASE_URL: string = (import.meta.env as any).BASE_URL;

/**
 * 链接盒子配置常量
 */
const BOXES_CONFIG = [
	{
		x: 12,
		y: 2,
		z: -70,
		scaleX: 4,
		scaleY: 4,
		scaleZ: 1,
		boxTexture: `${BASE_URL}img/GitHub.png`,
		URLLink: "https://github.com/liuyuanquan",
		color: 0x000000,
		label: {
			x: 11.875,
			y: 4.5,
			z: -70,
			inputMessage: "Github",
		},
	},
	{
		x: 19,
		y: 2,
		z: -70,
		scaleX: 4,
		scaleY: 4,
		scaleZ: 1,
		boxTexture: `${BASE_URL}img/juejin.png`,
		URLLink: "https://juejin.cn/user/4089838986602078",
		color: 0x1f80ff,
		label: {
			x: 19.125,
			y: 4.5,
			z: -70,
			inputMessage: "Juejin",
		},
	},
	{
		x: 27,
		y: 2,
		z: -70,
		scaleX: 4,
		scaleY: 4,
		scaleZ: 1,
		boxTexture: `${BASE_URL}img/QQ邮箱.png`,
		URLLink: "mailto:522703297@qq.com",
		color: 0xf8be32,
		label: {
			x: 26.875,
			y: 4.5,
			z: -70,
			inputMessage: "QQmail",
		},
	},
	// {
	// 	x: 35,
	// 	y: 2,
	// 	z: -70,
	// 	scaleX: 4,
	// 	scaleY: 4,
	// 	scaleZ: 1,
	// 	boxTexture: `${BASE_URL}img/writing.png`,
	// 	URLLink: "https://dev.to/0xfloyd/create-an-interactive-3d-portfolio-website-that-stands-out-to-employers-47gc",
	// 	color: 0x000000,
	// 	transparent: false,
	// 	},
];

/**
 * 创建链接盒子
 *
 * @param options - 配置选项
 *   - x: X 坐标
 *   - y: Y 坐标
 *   - z: Z 坐标
 *   - scaleX: X 轴缩放
 *   - scaleY: Y 轴缩放
 *   - scaleZ: Z 轴缩放
 *   - boxTexture: 盒子纹理路径
 *   - URLLink: 点击跳转的链接
 *   - color: 边框颜色，默认 0x000000
 *   - transparent: 是否透明，默认 true
 *
 * @returns THREE.Mesh 盒子对象
 */
function createBox(options: CreateBoxOptions): THREE.Mesh {
	const { x, y, z, scaleX, scaleY, scaleZ, boxTexture, URLLink, color = 0x000000 } = options;

	const boxScale = { x: scaleX, y: scaleY, z: scaleZ };

	// 创建纹理
	const borderMaterial = new THREE.MeshBasicMaterial({
		color,
	});
	borderMaterial.color.convertSRGBToLinear();

	const texture = loadTexture(boxTexture);
	const loadedTexture = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true,
		color: 0xffffff,
	});

	// 创建六面材质数组：左、右、上、下、前、后
	const materials = [
		borderMaterial, // Left side
		borderMaterial, // Right side
		borderMaterial, // Top side
		borderMaterial, // Bottom side
		loadedTexture, // Front side
		borderMaterial, // Back side
	];

	const linkBox = new THREE.Mesh(new THREE.BoxBufferGeometry(boxScale.x, boxScale.y, boxScale.z), materials);

	// 设置位置
	linkBox.position.set(x, y, z);

	// 设置渲染顺序
	linkBox.renderOrder = 1;

	// 设置阴影属性
	linkBox.castShadow = true;
	linkBox.receiveShadow = true;

	// 设置交互数据
	linkBox.userData = { URL: URLLink, email: URLLink };

	// 添加到场景
	scene.add(linkBox);

	// 添加物理属性
	addRigidPhysics(linkBox, { scale: boxScale });

	// 添加到交互对象列表
	cursorHoverObjects.push(linkBox);

	return linkBox;
}

/**
 * 创建浮动标签文本
 *
 * @param font - 字体对象
 * @param x - X 坐标
 * @param y - Y 坐标
 * @param z - Z 坐标
 * @param text - 文本内容
 */
function createFloatingLabel(font: THREE.Font, x: number, y: number, z: number, text: string): void {
	// 创建文本形状
	const shapes = font.generateShapes(text, 1);
	// 创建几何体
	const geometry = new THREE.ShapeBufferGeometry(shapes);
	// 计算居中偏移
	geometry.computeBoundingBox();
	const boundingBox = geometry.boundingBox;
	if (boundingBox) {
		const xMid = -0.5 * (boundingBox.max.x - boundingBox.min.x);
		geometry.translate(xMid, 0, 0);
	}
	// 创建材质
	const material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 1,
		side: THREE.DoubleSide,
	});
	// 创建网格对象
	const textMesh = new THREE.Mesh(geometry, material);
	textMesh.position.set(x, y, z);
	// 添加到场景
	scene.add(textMesh);
}

/**
 * 创建所有链接盒子
 *
 * 该函数用于批量创建场景中的所有链接盒子，并将它们添加到交互对象列表中。
 * 盒子对象会自动添加到 cursorHoverObjects 数组中，实现点击和悬停效果。
 *
 * @returns void
 */
export function createBoxes(): void {
	for (const boxConfig of BOXES_CONFIG) {
		createBox(boxConfig);
		// 创建对应的浮动标签
		if (boxConfig.label) {
			const { x, y, z, inputMessage } = boxConfig.label;
			loadFont({
				onLoad: (font) => {
					createFloatingLabel(font, x, y, z, inputMessage);
				},
			});
		}
	}
}
