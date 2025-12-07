import * as THREE from "three";

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
