import * as THREE from "three";
import { scene } from "../core/World";
import { PhysicsEngine } from "../core/PhysicsEngine";
import { loadTexture } from "../utils/textureLoader";
import { createTriangle } from "./Shapes";
import { CONFIG as PLANE_CONFIG } from "./Planes";

/**
 * 砖墙配置常量
 */
const CONFIG = {
	// 砖块质量
	mass: 0.1,
	// 砖块尺寸
	size: { x: 3, y: 1.5, z: 3 },
	// 砖块数量
	count: { x: 6, y: 6 },
	// 砖墙中心位置（X值对齐到网格边缘：gridSize=180, cellCount=18, cellSize=10）
	// 坐标原点左边第二个格子位置：-2 * cellSize = -20
	center: { x: -4 * PLANE_CONFIG.grid.cellSize, y: 0, z: 0 },
	// 砖墙纹理
	texture: `${(import.meta.env as any).BASE_URL}img/stone.png`,
} as const;

/**
 * 创建砖墙
 */
export function createBrickWalls(): void {
	const { mass, size, count, center, texture } = CONFIG;
	const { x: brickX, y: brickY, z: brickZ } = size;
	const { x: brickCountX, y: brickCountY } = count;

	const pos = new THREE.Vector3(center.x, brickY * 0.5, center.z);
	const quat = new THREE.Quaternion();

	for (let j = 0; j < brickCountY; j++) {
		const oddRow = j % 2 === 1;

		if (oddRow) {
			pos.x = center.x - (brickCountX * brickX) / 2 + brickX / 2;
		} else {
			pos.x = center.x - (brickCountX * brickX) / 2 + (brickX * 0.5) / 2;
		}

		const currentRow = oddRow ? brickCountX : brickCountX + 1;

		for (let i = 0; i < currentRow; i++) {
			let brickXCurrent = brickX;
			let brickMassCurrent = mass;

			if (!oddRow && (i === 0 || i === currentRow - 1)) {
				brickXCurrent *= 0.5;
				brickMassCurrent *= 0.5;
			}

			const brick = new THREE.Mesh(
				new THREE.BoxBufferGeometry(brickXCurrent, brickY, brickZ, 1, 1, 1),
				new THREE.MeshStandardMaterial({
					map: loadTexture(texture),
				})
			);

			brick.position.set(pos.x, pos.y, pos.z);
			brick.quaternion.copy(quat);
			brick.castShadow = true;
			brick.receiveShadow = true;
			brick.renderOrder = 0;
			scene.add(brick);

			PhysicsEngine.getInstance().addRigidPhysics(brick, {
				scale: { x: brickXCurrent, y: brickY, z: brickZ },
				mass: brickMassCurrent,
				quat: quat.clone(),
			});

			if (!oddRow && (i === 0 || i === currentRow - 2)) {
				pos.x += (brickX * 0.5 + brickX) / 2;
			} else {
				pos.x += brickX;
			}
			pos.z += 0.0001;
		}

		pos.y += brickY;
	}

	const rowCenterX = center.x;
	const wallFrontZ = center.z + brickZ * 0.5 + 4;
	const triangleSpacing = 4;
	const triangleStartZ = wallFrontZ;
	const triangleCenterX = rowCenterX - 4.5;

	scene.add(createTriangle({ position: { x: triangleCenterX, z: triangleStartZ } }));
	scene.add(createTriangle({ position: { x: triangleCenterX, z: triangleStartZ + triangleSpacing } }));
	scene.add(createTriangle({ position: { x: triangleCenterX, z: triangleStartZ + triangleSpacing * 2 } }));
	scene.add(createTriangle({ position: { x: triangleCenterX, z: triangleStartZ + triangleSpacing * 3 } }));
}
