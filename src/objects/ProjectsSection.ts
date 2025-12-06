import * as THREE from "three";
import { scene } from "../resources/world";
import { addRigidPhysics } from "./PhysicsHelpers";
import { loadFont } from "../utils/fontLoader";

/**
 * 项目展示区域配置
 */
const PROJECTS_SECTION_CONFIG = {
	position: {
		x: 16.2,
		y: 1,
		z: -20,
	},
	scale: { x: 37, y: 3, z: 2 },
	color: 0xff6600,
	showOutline: true,
	outlineColor: 0xffffff,
} as const;

/**
 * 文本配置
 */
const TEXT_CONFIG = {
	floyd: {
		text: "Yuanquan",
		color: 0xfffc00,
		size: 3,
		height: 0.5,
		position: { x: 16.2, y: 0.1, z: -20 }, // 与盒子中心 x 对齐
		geometry: {
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.1,
			bevelSize: 0.11,
			bevelOffset: 0,
			bevelSegments: 1,
		},
		translateX: -0.5, // 文本自身居中
	},
	engineer: {
		text: "Frontend Expert",
		color: 0x00ff08,
		size: 1.5,
		height: 0.5,
		position: { x: 16.2, y: 0.1, z: -20 }, // 与盒子中心 x 对齐
		geometry: {
			curveSegments: 20,
			bevelEnabled: true,
			bevelThickness: 0.25,
			bevelSize: 0.1,
		},
		translateX: -0.5, // 文本自身居中
	},
} as const;

/**
 * 创建项目展示区域
 *
 * @returns THREE.Mesh 盒子对象
 */
export function createProjectsSection(): THREE.Mesh {
	const { position, scale, color, showOutline, outlineColor } = PROJECTS_SECTION_CONFIG;
	const { x, y, z } = position;

	// 创建文字盒子
	const linkBox = new THREE.Mesh(
		new THREE.BoxBufferGeometry(scale.x, scale.y, scale.z),
		new THREE.MeshPhongMaterial({
			color: color,
		})
	);

	// 设置位置、阴影等属性
	linkBox.position.set(x, y, z);
	linkBox.castShadow = true;
	linkBox.receiveShadow = true;

	// 添加轮廓线（边缘高光）
	if (showOutline) {
		// 创建轮廓线几何体
		const edges = new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(scale.x, scale.y, scale.z));
		const outline = new THREE.LineSegments(
			edges,
			new THREE.LineBasicMaterial({
				color: outlineColor,
				linewidth: 2,
			})
		);
		// 设置位置
		outline.position.set(x, y, z);
		scene.add(outline);
	}

	// 添加物理属性
	addRigidPhysics(linkBox, { scale });

	// 加载文本（并排显示，整体居中）
	loadTexts();

	return linkBox;
}

/**
 * 创建文本网格
 */
function createTextMesh(font: THREE.Font, config: typeof TEXT_CONFIG.floyd | typeof TEXT_CONFIG.engineer): THREE.Mesh {
	const geometryConfig = config.geometry;
	const geometry = new THREE.TextGeometry(config.text, {
		font: font,
		size: config.size,
		height: config.height,
		curveSegments: geometryConfig.curveSegments,
		bevelEnabled: geometryConfig.bevelEnabled,
		bevelThickness: geometryConfig.bevelThickness,
		bevelSize: geometryConfig.bevelSize,
		bevelOffset: (geometryConfig as any).bevelOffset ?? 0,
		bevelSegments: (geometryConfig as any).bevelSegments ?? 1,
	});

	// 计算边界框
	geometry.computeBoundingBox();
	// 计算顶点法线
	geometry.computeVertexNormals();

	// 文本自身居中
	if (geometry.boundingBox) {
		const xMid = config.translateX * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
		geometry.translate(xMid, 0, 0);
	}

	const textGeo = new THREE.BufferGeometry().fromGeometry(geometry);

	// 创建材质
	const textMaterials = [
		new THREE.MeshBasicMaterial({ color: config.color }), // front
		new THREE.MeshPhongMaterial({ color: config.color }), // side
	];

	// 创建网格对象
	const textMesh = new THREE.Mesh(textGeo, textMaterials);
	textMesh.receiveShadow = true;
	textMesh.castShadow = true;

	return textMesh;
}

/**
 * 加载并排显示的文本（整体水平居中）
 */
function loadTexts(): void {
	const floydConfig = TEXT_CONFIG.floyd;
	const engineerConfig = TEXT_CONFIG.engineer;
	const boxCenterX = PROJECTS_SECTION_CONFIG.position.x;
	const spacing = 0.5; // 两个文本之间的间距

	loadFont({
		onLoad: (font) => {
			// 创建两个文本网格
			const floydMesh = createTextMesh(font, floydConfig);
			const engineerMesh = createTextMesh(font, engineerConfig);

			// 计算两个文本的宽度
			floydMesh.geometry.computeBoundingBox();
			engineerMesh.geometry.computeBoundingBox();

			const floydWidth =
				floydMesh.geometry.boundingBox?.max.x && floydMesh.geometry.boundingBox?.min.x
					? floydMesh.geometry.boundingBox.max.x - floydMesh.geometry.boundingBox.min.x
					: 0;
			const engineerWidth =
				engineerMesh.geometry.boundingBox?.max.x && engineerMesh.geometry.boundingBox?.min.x
					? engineerMesh.geometry.boundingBox.max.x - engineerMesh.geometry.boundingBox.min.x
					: 0;

			// 计算总宽度（包括间距）
			const totalWidth = floydWidth + spacing + engineerWidth;

			// 计算第一个文本的位置（整体居中）
			const floydX = boxCenterX - totalWidth / 2 + floydWidth / 2;
			const engineerX = boxCenterX + totalWidth / 2 - engineerWidth / 2;

			// 设置位置
			floydMesh.position.set(floydX, floydConfig.position.y, floydConfig.position.z);
			engineerMesh.position.set(engineerX, engineerConfig.position.y, engineerConfig.position.z);

			// 添加到场景
			scene.add(floydMesh);
			scene.add(engineerMesh);
		},
	});
}
