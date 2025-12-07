import * as THREE from "three";
import { resourceManager } from "./ResourceManager";
import { World } from "./World";

/**
 * 物理引擎类
 * 封装 Ammo.js 物理引擎，管理物理世界和刚体
 */
export class PhysicsEngine {
	private Ammo: AmmoType;
	private physicsWorld: AmmoPhysicsWorld | null;
	private rigidBodies: THREE.Object3D[];
	private tmpTrans: any;

	public readonly STATE: {
		DISABLE_DEACTIVATION: number;
	};

	constructor(world: World) {
		this.Ammo = resourceManager.getAmmo();
		this.physicsWorld = null;
		this.rigidBodies = [];
		this.tmpTrans = new this.Ammo.btTransform();
		this.STATE = {
			DISABLE_DEACTIVATION: 4,
		};
		world.physicsEngine = this;
	}

	public getAmmo(): AmmoType {
		return this.Ammo;
	}

	public getPhysicsWorld(): AmmoPhysicsWorld | null {
		return this.physicsWorld;
	}

	public getRigidBodies(): THREE.Object3D[] {
		return this.rigidBodies;
	}

	public getTmpTrans(): any {
		return this.tmpTrans;
	}

	/**
	 * 初始化物理世界
	 * 初始化碰撞检测、调度器、约束求解器等组件，设置重力
	 */
	public init(): void {
		const collisionConfiguration = new this.Ammo.btDefaultCollisionConfiguration();
		const dispatcher = new this.Ammo.btCollisionDispatcher(collisionConfiguration);
		const overlappingPairCache = new this.Ammo.btDbvtBroadphase();
		const constraintSolver = new this.Ammo.btSequentialImpulseConstraintSolver();

		this.physicsWorld = new this.Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, constraintSolver, collisionConfiguration);
		if (this.physicsWorld) {
			this.physicsWorld.setGravity(new this.Ammo.btVector3(0, -50, 0));
		}
	}

	/**
	 * 将刚体添加到物理世界
	 * 同时建立 Three.js 对象与物理刚体的关联
	 */
	addRigidBody(threeObject: THREE.Object3D, rigidBody: any): void {
		if (rigidBody && this.physicsWorld) {
			this.physicsWorld.addRigidBody(rigidBody);
			threeObject.userData.physicsBody = rigidBody;
			this.rigidBodies.push(threeObject);
		}
	}

	removeRigidBody(threeObject: THREE.Object3D): void {
		const index = this.rigidBodies.indexOf(threeObject);
		if (index !== -1) {
			const rigidBody = threeObject.userData.physicsBody;
			if (rigidBody && this.physicsWorld) {
				this.physicsWorld.removeRigidBody(rigidBody);
			}
			this.rigidBodies.splice(index, 1);
		}
	}

	/**
	 * 更新物理模拟
	 * 执行物理步进，并将物理计算结果同步到 Three.js 对象的位置和旋转
	 */
	update(deltaTime: number, maxSubSteps: number = 10): void {
		if (!this.physicsWorld) return;

		this.physicsWorld.stepSimulation(deltaTime, maxSubSteps);

		for (let i = 0; i < this.rigidBodies.length; i++) {
			const objThree = this.rigidBodies[i];
			const objAmmo = objThree.userData.physicsBody;
			if (!objAmmo) continue;

			const ms = objAmmo.getMotionState();
			if (ms) {
				ms.getWorldTransform(this.tmpTrans);
				const p = this.tmpTrans.getOrigin();
				const q = this.tmpTrans.getRotation();
				objThree.position.set(p.x(), p.y(), p.z());
				objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
			}
		}
	}

	dispose(): void {
		for (let i = this.rigidBodies.length - 1; i >= 0; i--) {
			this.removeRigidBody(this.rigidBodies[i]);
		}

		this.physicsWorld = null;
		this.rigidBodies = [];
	}

	/**
	 * 为 Three.js 对象创建并添加刚体物理
	 * 支持球体（radius）和盒子（scale）两种形状
	 * mass = 0 为静态物体，mass > 0 为动态物体
	 */
	addRigidPhysics(item: THREE.Object3D, options: AddRigidPhysicsOptions): void {
		const { scale, radius, mass = 0, quat = { x: 0, y: 0, z: 0, w: 1 }, rollingFriction, friction, margin = 0.05 } = options;
		const { x, y, z } = item.position;

		const transform = new this.Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new this.Ammo.btVector3(x, y, z));
		transform.setRotation(new this.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
		const motionState = new this.Ammo.btDefaultMotionState(transform);

		let colShape: any;
		if (radius !== undefined) {
			colShape = new this.Ammo.btSphereShape(radius);
		} else if (scale) {
			colShape = new this.Ammo.btBoxShape(new this.Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
		} else {
			throw new Error("addRigidPhysics: 必须提供 scale 或 radius");
		}
		colShape.setMargin(margin);

		const localInertia = new this.Ammo.btVector3(0, 0, 0);
		colShape.calculateLocalInertia(mass, localInertia);

		const rbInfo = new this.Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
		const body = new this.Ammo.btRigidBody(rbInfo);

		body.setActivationState(this.STATE.DISABLE_DEACTIVATION);
		if (mass === 0) {
			body.setCollisionFlags(2);
		}

		if (friction !== undefined) {
			body.setFriction(friction);
		}

		if (rollingFriction !== undefined) {
			body.setRollingFriction(rollingFriction);
		}

		item.userData.physicsBody = body;
		this.addRigidBody(item, body);
	}
}
