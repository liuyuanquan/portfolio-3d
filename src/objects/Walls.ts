import * as THREE from "three";
import { scene } from "../resources/world";
import { addRigidPhysics } from "./PhysicsHelpers";
import { stoneTexture } from "../config/resources";
import { loadTexture } from "../utils/textureLoader";

/**
 * 创建墙壁
 * @param options - 配置选项
 * @returns 墙壁对象
 */
export function createWall(options: CreateWallOptions): THREE.Mesh {
	const { x, y, z, wallScale } = options;

	const wall = new THREE.Mesh(
		new THREE.BoxBufferGeometry(wallScale.x, wallScale.y, wallScale.z),
		new THREE.MeshStandardMaterial({
			color: 0xffffff,
			opacity: 0.75,
			transparent: true,
		})
	);

	wall.position.set(x, y, z);
	wall.receiveShadow = true;
	scene.add(wall);

	addRigidPhysics(wall, { scale: wallScale });

	return wall;
}

/**
 * 创建单个砖块
 * @param options - 配置选项
 * @returns 砖块对象
 */
function createBrick(options: CreateBrickOptions): THREE.Mesh {
	const { sx, sy, sz, mass, pos, quat, material } = options;

	// ==================== Three.js 砖块 ====================
	const threeObject = new THREE.Mesh(new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1), material);
	threeObject.position.copy(pos);
	threeObject.quaternion.copy(quat);
	threeObject.castShadow = true;
	threeObject.receiveShadow = true;
	scene.add(threeObject);

	// ==================== Ammo.js 物理 ====================
	addRigidPhysics(threeObject, { scale: { x: sx, y: sy, z: sz }, mass, quat });

	return threeObject;
}

/**
 * 创建砖墙
 * @param options - 配置选项（可选）
 * @returns 砖块对象数组
 */
export function wallOfBricks(options: WallOfBricksOptions = {}): THREE.Mesh[] {
	const {
		brickMass = 0.1,
		brickLength = 3,
		brickDepth = 3,
		brickHeight = 1.5,
		numberOfBricksAcross = 6,
		numberOfRowsHigh = 6,
		startPos = { x: -20, y: 0, z: 10 },
	} = options;

	const pos = new THREE.Vector3();
	const quat = new THREE.Quaternion();
	pos.set(startPos.x, brickHeight * 0.5, startPos.z);
	quat.set(0, 0, 0, 1);

	const bricks: THREE.Mesh[] = [];

	for (let j = 0; j < numberOfRowsHigh; j++) {
		const oddRow = j % 2 === 1;

		pos.x = startPos.x - (numberOfBricksAcross * brickLength) / 2;

		if (oddRow) {
			pos.x += 0.25 * brickLength;
		}

		const currentRow = oddRow ? numberOfBricksAcross + 1 : numberOfBricksAcross;
		for (let i = 0; i < currentRow; i++) {
			let brickLengthCurrent = brickLength;
			let brickMassCurrent = brickMass;
			if (oddRow && (i === 0 || i === currentRow - 1)) {
				// 奇数行的首尾砖块长度和质量减半
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

			if (oddRow && (i === 0 || i === currentRow - 2)) {
				// 奇数行的首尾砖块位置调整
				pos.x += brickLength * 0.25;
			} else {
				pos.x += brickLength;
			}
			pos.z += 0.0001; // 避免 z-fighting
		}
		pos.y += brickHeight;
	}

	return bricks;
}
