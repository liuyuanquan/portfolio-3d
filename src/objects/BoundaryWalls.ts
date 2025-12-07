import * as THREE from "three";
import { World } from "../core";
import { BOUNDARY_WALLS_CONFIG, GRID_PLANE_CONFIG_COMPUTED } from "../config";

/**
 * 边界墙对象类
 * 负责创建和管理围绕平面的四堵边界墙
 */
export class BoundaryWalls {
	/** World 实例 */
	private world: World;
	/** 墙壁对象数组 */
	private walls: THREE.Mesh[] = [];
	/** 墙壁尺寸数组 */
	private wallSizes: Array<{ x: number; y: number; z: number }> = [];

	constructor(world: World) {
		this.world = world;
		this.init();
	}

/**
	 * 将创建的对象添加到 World 场景中
 */
	public addWorld(): void {
		for (let i = 0; i < this.walls.length; i++) {
			const wall = this.walls[i];
			const size = this.wallSizes[i];
			this.world.scene.add(wall);
			this.world.physicsEngine.addRigidPhysics(wall, {
				scale: size,
			});
		}
	}

	/**
	 * 初始化边界墙
	 */
	private init(): void {
		const { size: planeScale, position: planePosition, grid } = GRID_PLANE_CONFIG_COMPUTED;
		const { x: thickness, y: height } = BOUNDARY_WALLS_CONFIG.size;

	// 计算平面半宽和半深
	const planeHalfWidth = planeScale.x * 0.5;
	const planeHalfDepth = planeScale.z * 0.5;
	// 计算墙壁中心 Y 坐标
	const wallCenterY = height * 0.5 + grid.positionY;
	// 计算墙壁半厚度
	const halfThickness = thickness * 0.5;

	// 计算左右墙的尺寸
	const xWallSize = { x: thickness, y: height, z: planeScale.z };
	// 计算左右墙的 Z 坐标
	const xWallZ = planePosition.z;

	// 创建左墙
		const leftWall = this.createWall({
		position: {
			x: planePosition.x + planeHalfWidth - halfThickness,
			y: wallCenterY,
			z: xWallZ,
		},
		size: xWallSize,
	});
		this.walls.push(leftWall);
		this.wallSizes.push(xWallSize);

	// 创建右墙
		const rightWall = this.createWall({
		position: {
			x: planePosition.x - planeHalfWidth + halfThickness,
			y: wallCenterY,
			z: xWallZ,
		},
		size: xWallSize,
	});
		this.walls.push(rightWall);
		this.wallSizes.push(xWallSize);

	const zWallX = planePosition.x;
	// 前后墙的 X 长度需要减去左右墙的厚度，避免角落重叠
	const zWallSize = {
		x: planeScale.x - thickness * 2,
		y: height,
		z: thickness,
	};

	// 创建前墙
		const frontWall = this.createWall({
		position: {
			x: zWallX,
			y: wallCenterY,
			z: planePosition.z + planeHalfDepth - halfThickness,
		},
		size: zWallSize,
	});
		this.walls.push(frontWall);
		this.wallSizes.push(zWallSize);

	// 创建后墙
		const backWall = this.createWall({
		position: {
			x: zWallX,
			y: wallCenterY,
			z: planePosition.z - planeHalfDepth + halfThickness,
		},
		size: zWallSize,
	});
		this.walls.push(backWall);
		this.wallSizes.push(zWallSize);
	}

	/**
	 * 创建墙壁
	 * @param option 墙壁创建选项
	 * @returns 墙壁网格对象
	 */
	private createWall(option: { position: { x: number; y: number; z: number }; size: { x: number; y: number; z: number } }): THREE.Mesh {
		const { position, size } = option;

		const mesh = new THREE.Mesh(
			new THREE.BoxBufferGeometry(size.x, size.y, size.z),
			new THREE.MeshStandardMaterial({
				color: 0xffffff,
				opacity: 0.5,
				transparent: false,
			})
		);

		mesh.position.set(position.x, position.y, position.z);
		mesh.receiveShadow = true;

		return mesh;
	}
}
