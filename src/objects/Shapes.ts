import * as THREE from "three";
import { PhysicsEngine } from "../core/PhysicsEngine";
import { loadTexture } from "../utils/textureLoader";

/**
 * 创建三角形
 */
export function createTriangle(options: {
	position: {
		x: number;
		y?: number;
		z: number;
	};
}): THREE.Mesh {
	const { position } = options;
	const { x, y = 0.01, z } = position;

	const geom = new THREE.BufferGeometry();
	// 定义三角形的顶点坐标
	geom.setAttribute("position", new THREE.Float32BufferAttribute([4, 0, 0, 5, 0, 0, 4.5, 1, 0], 3));

	const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0xffffff }));
	mesh.rotation.x = -Math.PI * 0.5;
	mesh.position.set(x, y, z);

	return mesh;
}

/**
 * 创建带轮廓线的盒子
 */
export function createBoxWithOutline(options: {
	position: { x: number; y: number; z: number };
	size: { x: number; y: number; z: number };
	color: number;
	showOutline?: boolean;
	outlineColor?: number;
}): THREE.Mesh {
	const { position, size, color, showOutline = false, outlineColor = 0xffffff } = options;
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
		const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: outlineColor, linewidth: 2 }));
		outline.position.set(x, y, z);
		mesh.userData.outline = outline;
	}

	PhysicsEngine.getInstance().addRigidPhysics(mesh, { scale: size });

	return mesh;
}

/**
 * 创建墙壁
 */
export function createWall(options: { position: { x: number; y: number; z: number }; size: { x: number; y: number; z: number } }): THREE.Mesh {
	const { position, size } = options;

	const mesh = new THREE.Mesh(
		new THREE.BoxBufferGeometry(size.x, size.y, size.z),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,
			opacity: 0.5,
			transparent: false,
		})
	);

	mesh.position.set(position.x, position.y, position.z);
	// 接收阴影
	mesh.receiveShadow = true;

	// 添加物理属性
	PhysicsEngine.getInstance().addRigidPhysics(mesh, {
		scale: size,
	});

	return mesh;
}

/**
 * 创建广告牌杆
 */
export function createBillboardPole(options: {
	position: { x: number; y: number; z: number };
	size: { x: number; y: number; z: number };
	rotation: number;
	texture: string;
}): THREE.Mesh {
	const { position, size, rotation, texture } = options;

	const mesh = new THREE.Mesh(
		new THREE.BoxBufferGeometry(size.x, size.y, size.z),
		new THREE.MeshStandardMaterial({
			map: loadTexture(texture),
		})
	);

	mesh.position.set(position.x, position.y, position.z);
	mesh.rotation.y = rotation;
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	PhysicsEngine.getInstance().addRigidPhysics(mesh, {
		scale: size,
	});

	return mesh;
}

/**
 * 创建广告牌面板
 */
export function createBillboardSign(options: {
	position: { x: number; y: number; z: number };
	size: { x: number; y: number; z: number };
	rotation: number;
	texture: string;
	borderColor: number;
	url: string;
	addPhysics?: boolean;
}): THREE.Mesh {
	const { position, size, rotation, texture, borderColor, url, addPhysics = false } = options;

	const borderMaterial = new THREE.MeshBasicMaterial({ color: borderColor });
	// 将颜色转换为线性空间
	borderMaterial.color.convertSRGBToLinear();

	const signMaterial = new THREE.MeshBasicMaterial({ map: loadTexture(texture) });

	// 六面材质数组：左、右、上、下、前、后
	const materials = [borderMaterial, borderMaterial, borderMaterial, borderMaterial, signMaterial, borderMaterial];

	const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), materials);

	mesh.position.set(position.x, position.y, position.z);
	mesh.rotation.y = rotation;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.userData = { URL: url };

	if (addPhysics) {
		// 将 rotation.y 转换为四元数
		const quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
		PhysicsEngine.getInstance().addRigidPhysics(mesh, {
			scale: size,
			quat: { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
		});
	}

	return mesh;
}

/**
 * 在平面上创建纹理（通用函数）
 */
export function createTexturedPlane(options: {
	position: { x: number; y: number; z: number };
	size: { x: number; y: number };
	texture: string;
	useAlphaMap?: boolean; // 使用 alphaMap 而不是 map（用于处理透明度）
	textureOptions?: {
		magFilter?: THREE.TextureFilter;
		minFilter?: THREE.TextureFilter;
	};
	url?: string | null;
	receiveShadow?: boolean;
	opacity?: number; // 透明度（0-1）
	rotateX?: boolean; // 是否绕 X 轴旋转 -90 度（默认 true）
}): THREE.Mesh {
	const { position, size, texture, useAlphaMap = false, textureOptions, url = null, receiveShadow = false, opacity = 1, rotateX = true } = options;

	const textureMap = loadTexture(texture, textureOptions);

	const material = new THREE.MeshBasicMaterial({
		...(useAlphaMap ? { alphaMap: textureMap } : { map: textureMap }),
		transparent: true,
		opacity,
		depthWrite: true,
		depthTest: true,
	});

	const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(size.x, size.y), material);
	mesh.position.set(position.x, position.y, position.z);
	if (rotateX) {
		mesh.rotation.x = -Math.PI * 0.5;
	}
	mesh.renderOrder = 1;
	mesh.receiveShadow = receiveShadow;

	if (url) {
		mesh.userData = { URL: url };
	}

	return mesh;
}

/**
 * 创建链接盒子
 */
export function createLinkBox(options: {
	position: { x: number; y: number; z: number };
	size: { x: number; y: number; z: number };
	texture: string;
	url: string;
	borderColor?: number;
}): THREE.Mesh {
	const { position, size, texture, url, borderColor = 0x000000 } = options;

	const borderMaterial = new THREE.MeshBasicMaterial({ color: borderColor });
	borderMaterial.color.convertSRGBToLinear();

	const textureMap = loadTexture(texture);
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

	PhysicsEngine.getInstance().addRigidPhysics(mesh, { scale: size });

	return mesh;
}

/**
 * 创建浮动标签文本（2D 平面文本）
 */
export function createFloatingLabel(options: {
	font: THREE.Font;
	position: { x: number; y: number; z: number };
	text: string;
	size?: number;
	color?: number;
	rotateX?: boolean; // 是否绕 X 轴旋转 -90 度（水平放置）
}): THREE.Mesh {
	const { font, position, text, size = 1, color = 0xffffff, rotateX = false } = options;

	// 生成文本形状并创建几何体
	const shapes = font.generateShapes(text, size);
	const geometry = new THREE.ShapeBufferGeometry(shapes);
	// 计算边界框并居中文本
	geometry.computeBoundingBox();
	if (geometry.boundingBox) {
		const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
		geometry.translate(-0.5 * width, 0, 0);
	}

	const mesh = new THREE.Mesh(
		geometry,
		new THREE.MeshBasicMaterial({
			color,
			transparent: true,
			side: THREE.DoubleSide, // 双面渲染，确保从任何角度都能看到文本
		})
	);
	mesh.position.set(position.x, position.y, position.z);
	if (rotateX) {
		mesh.rotation.x = -Math.PI * 0.5;
	}

	return mesh;
}

/**
 * 创建3D文本网格对象
 *
 * @param options.font - 字体对象
 * @param options.text - 文本内容
 * @param options.size - 文本大小
 * @param options.height - 文本高度（3D 深度）
 * @param options.color - 文本颜色
 * @param options.geometry.curveSegments - 曲线段数（影响圆滑度）
 * @param options.geometry.bevelEnabled - 是否启用斜角
 * @param options.geometry.bevelThickness - 斜角厚度
 * @param options.geometry.bevelSize - 斜角大小
 * @param options.geometry.bevelOffset - 斜角偏移（可选）
 * @param options.geometry.bevelSegments - 斜角段数（可选）
 * @param options.translateX - X 方向平移系数（用于文本居中，通常为 -0.5）
 *
 */
export function createTextMesh(options: {
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
	const { font, text, size, height, color, geometry: geometryConfig, translateX } = options;

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
	// 计算边界框，用于后续的居中计算
	geometry.computeBoundingBox();
	// 计算顶点法线，用于光照渲染
	geometry.computeVertexNormals();
	// 文本自身居中：根据文本宽度和 translateX 系数计算平移距离，使文本在 X 方向居中
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
