import * as THREE from "three";

/**
 * 物理引擎管理类（单例模式）
 */
export class PhysicsEngine {
	// ==================== 静态属性 ====================
	/** 单例实例 */
	private static instance: PhysicsEngine | null = null;

	// ==================== 私有属性 ====================
	/** Ammo.js 实例 */
	private Ammo: AmmoType;

	/** 物理世界实例 */
	private physicsWorld: AmmoPhysicsWorld | null;

	/** Three.js 对象数组（与刚体一一对应） */
	private rigidBodies: THREE.Object3D[];

	/** 临时变换对象（用于性能优化，避免频繁创建） */
	private tmpTrans: any;

	// ==================== 公共常量 ====================
	/** 物理状态常量 */
	public readonly STATE: {
		DISABLE_DEACTIVATION: number;
	};

	// ==================== 构造函数 ====================
	/**
	 * 构造函数
	 * @param Ammo - Ammo.js 实例
	 */
	private constructor(Ammo: AmmoType) {
		this.Ammo = Ammo;
		this.physicsWorld = null;
		this.rigidBodies = [];
		this.tmpTrans = new Ammo.btTransform();
		this.STATE = {
			DISABLE_DEACTIVATION: 4,
		};
	}

	// ==================== 静态方法 ====================
	/**
	 * 获取单例实例
	 * @param Ammo - Ammo.js 实例（仅在首次调用时需要，后续调用会被忽略）
	 * @returns 物理引擎实例
	 */
	public static getInstance(Ammo?: AmmoType): PhysicsEngine {
		if (PhysicsEngine.instance) {
			return PhysicsEngine.instance;
		}

		if (!Ammo) {
			throw new Error("PhysicsEngine.getInstance() requires Ammo parameter on first call");
		}

		PhysicsEngine.instance = new PhysicsEngine(Ammo);
		return PhysicsEngine.instance;
	}

	// ==================== 公共 Getter 方法 ====================
	/**
	 * 获取 Ammo.js 实例
	 * @returns Ammo.js 实例
	 */
	public getAmmo(): AmmoType {
		return this.Ammo;
	}

	/**
	 * 获取物理世界实例
	 * @returns 物理世界实例
	 */
	public getPhysicsWorld(): AmmoPhysicsWorld | null {
		return this.physicsWorld;
	}

	/**
	 * 获取刚体数组
	 * @returns 刚体数组
	 */
	public getRigidBodies(): THREE.Object3D[] {
		return this.rigidBodies;
	}

	/**
	 * 获取临时变换对象
	 * @returns 临时变换对象
	 */
	public getTmpTrans(): any {
		return this.tmpTrans;
	}

	// ==================== 公共实例方法 ====================
	/**
	 * 创建物理世界
	 */
	createWorld(): void {
		const Ammo = this.getAmmo();

		const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		const overlappingPairCache = new Ammo.btDbvtBroadphase();
		const constraintSolver = new Ammo.btSequentialImpulseConstraintSolver();

		this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, constraintSolver, collisionConfiguration);
		if (this.physicsWorld) {
			this.physicsWorld.setGravity(new Ammo.btVector3(0, -50, 0));
		}
	}

	/**
	 * 添加刚体到物理世界
	 * @param threeObject - Three.js 对象
	 * @param rigidBody - Ammo.js 刚体对象
	 */
	addRigidBody(threeObject: THREE.Object3D, rigidBody: any): void {
		if (rigidBody && this.physicsWorld) {
			this.physicsWorld.addRigidBody(rigidBody);
			threeObject.userData.physicsBody = rigidBody;
			this.rigidBodies.push(threeObject);
		}
	}

	/**
	 * 移除刚体
	 * @param threeObject - Three.js 对象
	 */
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
	 * 更新物理世界
	 * @param deltaTime - 时间差（秒）
	 * @param maxSubSteps - 最大子步数，默认 10
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

	/**
	 * 清理资源
	 */
	dispose(): void {
		for (let i = this.rigidBodies.length - 1; i >= 0; i--) {
			this.removeRigidBody(this.rigidBodies[i]);
		}

		if (this.physicsWorld) {
			this.physicsWorld = null;
		}

		this.rigidBodies = [];
	}
}
