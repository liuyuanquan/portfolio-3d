import * as THREE from "three";
import { World, resourceManager } from "../core";
import { BRICK_WALLS_CONFIG } from "../config";

/**
 * 砖墙对象类
 * 负责创建和管理砖墙
 */
export class BrickWalls {
	private world: World;
	private brickData: BrickData[] = [];
	private triangles: THREE.Mesh[] = [];

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 初始化砖墙
	 */
	private init(): void {
		const { mass, size, count, center, texture } = BRICK_WALLS_CONFIG;
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
						map: resourceManager.loadTexture(texture),
					})
				);

				brick.position.set(pos.x, pos.y, pos.z);
				brick.quaternion.copy(quat);
				brick.castShadow = true;
				brick.receiveShadow = true;
				brick.renderOrder = 0;

				this.brickData.push({
					brick,
					mass: brickMassCurrent,
					scale: { x: brickXCurrent, y: brickY, z: brickZ },
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

		// 创建三角形装饰
		const rowCenterX = center.x;
		const wallFrontZ = center.z + brickZ * 0.5 + 4;
		const triangleSpacing = 4;
		const triangleStartZ = wallFrontZ;
		const triangleCenterX = rowCenterX - 4.5;

		this.triangles.push(this.createTriangle({ position: { x: triangleCenterX, z: triangleStartZ } }));
		this.triangles.push(this.createTriangle({ position: { x: triangleCenterX, z: triangleStartZ + triangleSpacing } }));
		this.triangles.push(this.createTriangle({ position: { x: triangleCenterX, z: triangleStartZ + triangleSpacing * 2 } }));
		this.triangles.push(this.createTriangle({ position: { x: triangleCenterX, z: triangleStartZ + triangleSpacing * 3 } }));
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		// 添加所有砖块到场景并添加物理属性
		for (const brickInfo of this.brickData) {
			this.world.scene.add(brickInfo.brick);
			this.world.physicsEngine.addRigidPhysics(brickInfo.brick, {
				scale: brickInfo.scale,
				mass: brickInfo.mass,
				quat: { x: brickInfo.quat.x, y: brickInfo.quat.y, z: brickInfo.quat.z, w: brickInfo.quat.w },
			});
		}

		// 添加所有三角形到场景
		for (const triangle of this.triangles) {
			this.world.scene.add(triangle);
		}
	}

	/**
	 * 创建三角形
	 * @param options 三角形选项
	 * @returns 三角形网格对象
	 */
	private createTriangle(options: {
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
}
