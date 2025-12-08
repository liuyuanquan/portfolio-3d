import * as THREE from "three";
import { World, resourceManager } from "../core";
import { BEACH_BALL_CONFIG } from "../config";

/**
 * 沙滩球对象类
 * 负责创建和管理沙滩球
 */
export class BeachBall {
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
			radius: BEACH_BALL_CONFIG.radius,
			mass: BEACH_BALL_CONFIG.mass,
			quat: BEACH_BALL_CONFIG.quaternion,
			rollingFriction: BEACH_BALL_CONFIG.friction,
			restitution: BEACH_BALL_CONFIG.restitution,
		});
	}

	/**
	 * 初始化沙滩球
	 */
	private init(): void {
		const { position, radius, texture, geometrySegments } = BEACH_BALL_CONFIG;

		const beachTexture = resourceManager.loadTexture(texture, {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			anisotropy: 1,
			repeat: { x: 1, y: 1 },
		});

		const geometry = new THREE.SphereGeometry(radius, geometrySegments, geometrySegments);
		const material = new THREE.MeshLambertMaterial({ map: beachTexture });
		this.ballObject = new THREE.Mesh(geometry, material);

		this.ballObject.position.set(position.x, position.y, position.z);
		this.ballObject.castShadow = true;
		this.ballObject.receiveShadow = true;
	}
}
