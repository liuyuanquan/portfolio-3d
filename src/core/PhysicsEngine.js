/**
 * 物理引擎管理类
 * 封装 Ammo.js 物理世界的创建、管理和更新逻辑
 */
export class PhysicsEngine {
	constructor(Ammo) {
		this.Ammo = Ammo;
		this.physicsWorld = null;
		this.rigidBodies = [];
		this.tmpTrans = new Ammo.btTransform();
		this.STATE = { DISABLE_DEACTIVATION: 4 };
	}

	/**
	 * 创建物理世界
	 * @param {Object} options - 配置选项
	 * @param {Object} options.gravity - 重力向量 {x, y, z}
	 */
	createWorld(options = {}) {
		const { gravity = { x: 0, y: -50, z: 0 } } = options;

		// 碰撞检测配置
		const collisionConfiguration =
			new this.Ammo.btDefaultCollisionConfiguration();
		const dispatcher = new this.Ammo.btCollisionDispatcher(
			collisionConfiguration
		);
		const overlappingPairCache = new this.Ammo.btDbvtBroadphase();
		const constraintSolver =
			new this.Ammo.btSequentialImpulseConstraintSolver();

		// 创建物理世界
		this.physicsWorld = new this.Ammo.btDiscreteDynamicsWorld(
			dispatcher,
			overlappingPairCache,
			constraintSolver,
			collisionConfiguration
		);

		// 设置重力
		this.physicsWorld.setGravity(
			new this.Ammo.btVector3(gravity.x, gravity.y, gravity.z)
		);
	}

	/**
	 * 添加刚体到物理世界
	 * @param {THREE.Object3D} threeObject - Three.js 对象
	 * @param {Object} rigidBody - Ammo.js 刚体
	 */
	addRigidBody(threeObject, rigidBody) {
		if (rigidBody) {
			this.physicsWorld.addRigidBody(rigidBody);
			threeObject.userData.physicsBody = rigidBody;
			this.rigidBodies.push(threeObject);
		}
	}

	/**
	 * 移除刚体
	 * @param {THREE.Object3D} threeObject - Three.js 对象
	 */
	removeRigidBody(threeObject) {
		const index = this.rigidBodies.indexOf(threeObject);
		if (index !== -1) {
			const rigidBody = threeObject.userData.physicsBody;
			if (rigidBody) {
				this.physicsWorld.removeRigidBody(rigidBody);
			}
			this.rigidBodies.splice(index, 1);
		}
	}

	/**
	 * 更新物理世界
	 * @param {number} deltaTime - 时间差（秒）
	 * @param {number} maxSubSteps - 最大子步数，默认 10
	 */
	update(deltaTime, maxSubSteps = 10) {
		if (!this.physicsWorld) return;

		// 步进物理模拟
		this.physicsWorld.stepSimulation(deltaTime, maxSubSteps);

		// 同步 Three.js 对象位置和旋转
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
	 * 获取物理世界实例
	 * @returns {Object} Ammo.js 物理世界
	 */
	getWorld() {
		return this.physicsWorld;
	}

	/**
	 * 获取所有刚体
	 * @returns {Array} 刚体数组
	 */
	getRigidBodies() {
		return this.rigidBodies;
	}

	/**
	 * 清理资源
	 */
	dispose() {
		// 移除所有刚体
		for (let i = this.rigidBodies.length - 1; i >= 0; i--) {
			this.removeRigidBody(this.rigidBodies[i]);
		}

		// 清理物理世界
		if (this.physicsWorld) {
			// Ammo.js 会自动清理，这里可以添加额外的清理逻辑
			this.physicsWorld = null;
		}

		this.rigidBodies = [];
	}
}
