import * as THREE from "three";
import { World, resourceManager } from "../core";
import { BALL_CONFIG } from "../config";

/**
 * 玩家球体对象类
 * 负责创建和管理玩家控制的球体
 */
export class Ball {
	/** World 实例 */
	private world: World;
	/** 球体对象 */
	public ballObject!: THREE.Mesh;

	constructor(world: World) {
		this.world = world;
		this.init();
	}

	/**
	 * 将创建的对象添加到 World 场景中
	 */
	public addWorld(): void {
		this.world.scene.add(this.ballObject);
		this.world.physicsEngine.addRigidPhysics(this.ballObject, {
			radius: BALL_CONFIG.radius,
			mass: BALL_CONFIG.mass,
			quat: BALL_CONFIG.quaternion,
			rollingFriction: BALL_CONFIG.friction,
			margin: BALL_CONFIG.margin,
		});
	}

	/**
	 * 初始化玩家球体
	 */
	private init(): void {
		const { position, radius, texture, geometrySegments } = BALL_CONFIG;

		const marbleTexture = resourceManager.loadTexture(texture, {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			anisotropy: 1,
			repeat: { x: 1, y: 1 },
		});

		const geometry = new THREE.SphereGeometry(radius, geometrySegments, geometrySegments);
		const material = new THREE.MeshLambertMaterial({ map: marbleTexture });
		this.ballObject = new THREE.Mesh(geometry, material);

		this.ballObject.position.set(position.x, position.y, position.z);
		this.ballObject.castShadow = true;
		this.ballObject.receiveShadow = true;
	}

	/**
	 * 更新球体移动
	 * 根据输入方向更新球体的物理速度
	 */
	public update(): void {
		const Ammo = this.world.physicsEngine.getAmmo();
		const movementConfig = BALL_CONFIG.movement;
		const { moveDirection } = this.world.interactionManager;
		const moveX = moveDirection.right - moveDirection.left;
		const moveZ = moveDirection.back - moveDirection.forward;
		const moveY = this.ballObject.position.y < movementConfig.groundThreshold ? 0 : movementConfig.airMovementY;

		if (moveX === 0 && moveY === 0 && moveZ === 0) return;

		const impulse = new Ammo.btVector3(moveX, moveY, moveZ);
		impulse.op_mul(movementConfig.scalingFactor);

		const rigidBody = this.ballObject.userData.physicsBody;
		if (rigidBody) {
			rigidBody.setLinearVelocity(impulse);
		}
	}
}
