import * as THREE from "three";
import { scene } from "../resources/world";
import { addRigidPhysics } from "./PhysicsHelpers";
import { loadTexture } from "../utils/textureLoader";
import { PLANE_CONFIG } from "./Planes";

/**
 * 砖墙配置常量
 */
const BRICK_WALL_CONFIG = {
	brickMass: 0.1,
	brickLength: 3,
	brickDepth: 3,
	brickHeight: 1.5,
	numberOfBricksAcross: 6,
	numberOfRowsHigh: 6,
	startPos: { x: -20, y: 0, z: 10 },
	stoneTexture: `${(import.meta.env as any).BASE_URL}img/stone.png`,
} as const;

/**
 * 边界墙配置常量
 */
const BOUNDARY_WALLS_CONFIG = {
	wallThickness: 0.5,
	wallHeight: 4,
} as const;

/**
 * 创建墙壁
 *
 * 该函数用于创建场景中的边界墙壁，用于限制物体的移动范围。
 * 墙壁是静态物体，不会移动，但可以作为碰撞表面与其他物体发生碰撞。
 *
 * 视觉属性：
 * - 使用 BoxBufferGeometry 创建矩形墙壁
 * - 材质设置为 MeshStandardMaterial，可以很好地响应光照
 * - 颜色为白色，透明度为 75%，半透明效果
 * - 墙壁可以接收阴影，增强场景真实感
 *
 * 物理属性：
 * - 质量为 0（默认），表示静态物体
 * - 碰撞形状为盒子（Box），尺寸与视觉尺寸完全一致
 * - 墙壁不会受到重力影响，也不会因碰撞而移动
 *
 * @param options - 配置选项对象
 *   - x: 墙壁在 X 轴上的位置
 *   - y: 墙壁在 Y 轴上的位置
 *   - z: 墙壁在 Z 轴上的位置
 *   - wallScale: 墙壁的尺寸 {x: 宽度, y: 高度, z: 深度}
 *
 * @returns THREE.Mesh - 创建的墙壁网格对象，已添加到场景中并配置了物理属性
 */
function createWall(options: CreateWallOptions): THREE.Mesh {
	const { x, y, z, wallScale } = options;

	// 创建墙壁
	const wall = new THREE.Mesh(
		new THREE.BoxBufferGeometry(wallScale.x, wallScale.y, wallScale.z),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,
			opacity: 0.75,
			transparent: true,
		})
	);

	// 设置位置和阴影属性
	wall.position.set(x, y, z);
	wall.receiveShadow = true;
	scene.add(wall);

	// 添加物理属性
	addRigidPhysics(wall, {
		scale: wallScale,
	});

	return wall;
}

/**
 * 创建单个砖块
 *
 * 该函数用于创建单个砖块对象，这是构建砖墙的基本单元。
 * 砖块是动态物体，具有质量，可以受到重力和碰撞的影响。
 *
 * 视觉属性：
 * - 使用 BoxBufferGeometry 创建矩形砖块
 * - 材质由调用者提供，通常是带有石头纹理的 MeshStandardMaterial
 * - 砖块可以投射和接收阴影，增强场景真实感
 *
 * 物理属性：
 * - 质量由调用者指定，通常为 0.1（轻量级动态物体）
 * - 碰撞形状为盒子（Box），尺寸与视觉尺寸完全一致
 * - 砖块会受到重力影响，可以因碰撞而移动或倒塌
 *
 * @param options - 配置选项对象
 *   - sx: 砖块在 X 方向的尺寸（长度）
 *   - sy: 砖块在 Y 方向的尺寸（高度）
 *   - sz: 砖块在 Z 方向的尺寸（深度）
 *   - mass: 砖块的质量，通常为 0.1
 *   - pos: 砖块的位置（THREE.Vector3）
 *   - quat: 砖块的旋转四元数（THREE.Quaternion）
 *   - material: 砖块的材质（THREE.Material）
 *
 * @returns THREE.Mesh - 创建的砖块网格对象，已添加到场景中并配置了物理属性
 */
function createBrick(options: CreateBrickOptions): THREE.Mesh {
	const { sx, sy, sz, mass, pos, quat, material } = options;

	// 创建砖块
	const threeObject = new THREE.Mesh(new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1), material);

	// 设置位置和阴影属性
	threeObject.position.copy(pos);
	threeObject.quaternion.copy(quat);
	threeObject.castShadow = true;
	threeObject.receiveShadow = true;
	scene.add(threeObject);

	// 添加物理属性
	addRigidPhysics(threeObject, {
		scale: { x: sx, y: sy, z: sz },
		mass,
		quat,
	});

	return threeObject;
}

/**
 * 创建砖墙
 *
 * 该函数用于创建由多个砖块堆叠而成的砖墙结构。
 * 砖墙采用交错排列的方式（类似真实的砖墙砌法），奇数行的砖块会相对于偶数行偏移半个砖块长度。
 *
 * 排列方式：
 * - 偶数行：砖块正常排列，数量为 numberOfBricksAcross
 * - 奇数行：砖块偏移半个长度，数量为 numberOfBricksAcross + 1
 * - 奇数行的首尾砖块长度减半，用于保持墙体的整齐
 *
 * 视觉属性：
 * - 每个砖块使用石头纹理（stoneTexture）
 * - 砖块可以投射和接收阴影，增强场景真实感
 *
 * 物理属性：
 * - 每个砖块都是独立的动态物体，具有质量
 * - 砖块会受到重力影响，可以因碰撞而移动或倒塌
 * - 砖块之间可以发生碰撞，形成真实的物理交互
 *
 * @returns THREE.Mesh[] - 创建的砖块对象数组，所有砖块已添加到场景中并配置了物理属性
 */
export function wallOfBricks(): THREE.Mesh[] {
	const { brickMass, brickLength, brickDepth, brickHeight, numberOfBricksAcross, numberOfRowsHigh, startPos, stoneTexture } = BRICK_WALL_CONFIG;

	// 初始化位置和旋转
	const pos = new THREE.Vector3();
	const quat = new THREE.Quaternion();
	pos.set(startPos.x, brickHeight * 0.5, startPos.z);
	quat.set(0, 0, 0, 1);

	const bricks: THREE.Mesh[] = [];

	// 构建砖墙：外层循环遍历每一行
	for (let j = 0; j < numberOfRowsHigh; j++) {
		const oddRow = j % 2 === 1;
		pos.x = startPos.x - (numberOfBricksAcross * brickLength) / 2;

		// 奇数行偏移半个砖块长度，形成交错排列
		if (oddRow) {
			pos.x += 0.25 * brickLength;
		}

		const currentRow = oddRow ? numberOfBricksAcross + 1 : numberOfBricksAcross;
		// 内层循环：创建当前行的每个砖块
		for (let i = 0; i < currentRow; i++) {
			let brickLengthCurrent = brickLength;
			let brickMassCurrent = brickMass;
			// 奇数行的首尾砖块长度减半
			if (oddRow && (i === 0 || i === currentRow - 1)) {
				brickLengthCurrent *= 0.5;
				brickMassCurrent *= 0.5;
			}

			const brick = createBrick({
				sx: brickLengthCurrent,
				sy: brickHeight,
				sz: brickDepth,
				mass: brickMassCurrent,
				pos: pos.clone(),
				quat: quat.clone(),
				material: new THREE.MeshStandardMaterial({
					map: loadTexture(stoneTexture),
				}),
			});
			bricks.push(brick);

			// 更新位置，为下一个砖块做准备
			if (oddRow && (i === 0 || i === currentRow - 2)) {
				pos.x += brickLength * 0.25;
			} else {
				pos.x += brickLength;
			}
			pos.z += 0.0001; // Z 坐标微调，避免 z-fighting
		}
		pos.y += brickHeight; // 移动到下一行
	}

	return bricks;
}

/**
 * 创建围绕平面的四堵边界墙
 *
 * 该函数用于根据平面的尺寸和位置，自动创建四堵边界墙（左右前后），
 * 形成一个封闭的游戏区域。墙壁的外边缘会与平面的边缘对齐。
 *
 * 墙壁配置：
 * - 左右墙（X 方向）：Z 长度等于平面 Z 尺寸
 * - 前后墙（Z 方向）：X 长度需要减去左右墙的厚度，避免角落重叠
 * - 所有墙壁的外边缘都与平面边缘对齐
 *
 */
export function createBoundaryWalls(): void {
	const { scale: planeScale, position: planePosition, grid } = PLANE_CONFIG;
	const { wallThickness, wallHeight } = BOUNDARY_WALLS_CONFIG;

	// 计算平面半宽和半深
	const planeHalfWidth = planeScale.x * 0.5;
	const planeHalfDepth = planeScale.z * 0.5;
	// 计算墙壁中心 Y 坐标（基于墙壁高度和网格位置）
	const wallCenterY = wallHeight * 0.5 + grid.positionY;
	const halfWallThickness = wallThickness * 0.5;

	// X 方向墙壁配置（左右墙）
	const xWallScale = { x: wallThickness, y: wallHeight, z: planeScale.z };
	const xWallZ = planePosition.z;

	// 创建右墙（X 正方向）
	createWall({
		x: planePosition.x + planeHalfWidth - halfWallThickness,
		y: wallCenterY,
		z: xWallZ,
		wallScale: xWallScale,
	});

	// 创建左墙（X 负方向）
	createWall({
		x: planePosition.x - planeHalfWidth + halfWallThickness,
		y: wallCenterY,
		z: xWallZ,
		wallScale: xWallScale,
	});

	// Z 方向墙壁配置（前后墙）
	const zWallX = planePosition.x;
	// Z 方向墙壁的 X 长度需要减去左右墙的厚度，避免角落重叠
	const zWallScale = {
		x: planeScale.x - wallThickness * 2,
		y: wallHeight,
		z: wallThickness,
	};

	// 创建前墙（Z 正方向）
	createWall({
		x: zWallX,
		y: wallCenterY,
		z: planePosition.z + planeHalfDepth - halfWallThickness,
		wallScale: zWallScale,
	});

	// 创建后墙（Z 负方向）
	createWall({
		x: zWallX,
		y: wallCenterY,
		z: planePosition.z - planeHalfDepth + halfWallThickness,
		wallScale: zWallScale,
	});
}
