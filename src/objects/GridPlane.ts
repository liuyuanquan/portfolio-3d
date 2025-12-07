import * as THREE from "three";
import { World, resourceManager } from "../core";
import { GRID_PLANE_CONFIG_COMPUTED } from "../config";
import { createFloatingLabel } from "./Shapes";
import { isTouchscreenDevice } from "../utils";

/**
 * 网格平面对象类
 * 负责创建和管理网格平面
 */
export class GridPlane {
	/** World 实例 */
	private world: World;
	/** 网格辅助对象 */
	public grid!: THREE.GridHelper;
	/** 物理平面对象 */
	public blockPlane!: THREE.Mesh;
	/** 操作提示文本标签 */
	private instructionsLabel!: THREE.Mesh;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		const { size, quaternion, mass, friction, rollingFriction } = GRID_PLANE_CONFIG_COMPUTED;

		this.world.scene.add(this.grid);
		this.world.scene.add(this.blockPlane);
		this.world.physicsEngine.addRigidPhysics(this.blockPlane, {
			scale: size,
			mass,
			quat: quaternion,
			friction,
			rollingFriction,
		});
		this.world.scene.add(this.instructionsLabel);
	}

	/**
	 * 初始化网格平面
	 * 包含视觉网格（GridHelper）和物理平面（Mesh）
	 */
	private init(): void {
		this.grid = this.createGrid();
		this.blockPlane = this.createBlockPlane();
		this.instructionsLabel = this.createInstructionsLabel();
	}

	/**
	 * 创建网格辅助对象
	 * @returns 网格辅助对象
	 */
	private createGrid(): THREE.GridHelper {
		const { size } = GRID_PLANE_CONFIG_COMPUTED;
		const { cellCount, positionY } = GRID_PLANE_CONFIG_COMPUTED.grid;

		const grid = new THREE.GridHelper(size.x, cellCount.x, 0xffffff, 0xffffff);
		const gridMaterial = grid.material as THREE.Material;
		gridMaterial.opacity = 0.5;
		gridMaterial.transparent = true;
		grid.position.y = positionY;

		return grid;
	}

	/**
	 * 创建物理平面对象
	 * @returns 物理平面网格对象
	 */
	private createBlockPlane(): THREE.Mesh {
		const { position, size } = GRID_PLANE_CONFIG_COMPUTED;

		const blockPlane = new THREE.Mesh(
			new THREE.BoxBufferGeometry(),
			new THREE.MeshPhongMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.25,
			})
		);

		blockPlane.position.set(position.x, position.y, position.z);
		blockPlane.scale.set(size.x, size.y, size.z);
		blockPlane.receiveShadow = true;

		return blockPlane;
	}

	/**
	 * 创建操作提示文本标签
	 * @returns 操作提示文本标签网格对象
	 */
	private createInstructionsLabel(): THREE.Mesh {
		const instructionsText = isTouchscreenDevice()
			? GRID_PLANE_CONFIG_COMPUTED.instructions.touchscreen
			: GRID_PLANE_CONFIG_COMPUTED.instructions.keyboard;

		const font = resourceManager.getFont()!;
		return createFloatingLabel({
			font,
			position: { x: 0, y: 0.01, z: 10 },
			text: instructionsText,
			size: 1.5,
			rotateX: true,
			color: 0xff0000,
		});
	}
}
