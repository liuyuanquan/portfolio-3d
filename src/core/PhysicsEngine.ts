/**
 * 物理引擎管理类
 * 封装 Ammo.js 物理世界的创建、管理和更新逻辑
 *
 * 功能：
 * - 创建和管理 Ammo.js 物理世界
 * - 添加/移除刚体
 * - 同步物理世界和 Three.js 场景
 * - 更新物理模拟
 */
import * as THREE from "three";
import { PHYSICS_CONFIG } from "../config";

/**
 * Ammo.js 类型定义
 * 由于 Ammo.js 是全局引入的 UMD 模块，使用 any 类型
 * 在实际使用中，Ammo 对象包含所有 Bullet Physics 的 JavaScript 绑定
 */
type AmmoType = any;

/**
 * 重力向量配置
 */
interface GravityConfig {
	x: number;
	y: number;
	z: number;
}

/**
 * 创建物理世界的选项
 */
interface CreateWorldOptions {
	/** 重力向量，默认使用 PHYSICS_CONFIG.gravity */
	gravity?: GravityConfig;
}

/**
 * 物理引擎管理类
 *
 * 职责：
 * 1. 管理 Ammo.js 物理世界的生命周期
 * 2. 维护 Three.js 对象和物理刚体的映射关系
 * 3. 每帧更新物理模拟并同步到 Three.js 场景
 */
export class PhysicsEngine {
	/** Ammo.js 实例 */
	private Ammo: AmmoType;

	/** 物理世界实例 */
	public physicsWorld: any;

	/** Three.js 对象数组（与刚体一一对应） */
	private rigidBodies: THREE.Object3D[];

	/** 临时变换对象（用于性能优化，避免频繁创建） */
	private tmpTrans: any;

	/** 物理状态常量 */
	public readonly STATE: {
		DISABLE_DEACTIVATION: number;
	};

	/**
	 * 构造函数
	 * @param Ammo - Ammo.js 实例（全局引入）
	 */
	constructor(Ammo: AmmoType) {
		this.Ammo = Ammo;
		this.physicsWorld = null;
		this.rigidBodies = [];
		this.tmpTrans = new Ammo.btTransform();
		this.STATE = {
			DISABLE_DEACTIVATION: PHYSICS_CONFIG.state.DISABLE_DEACTIVATION,
		};
	}

	/**
	 * 创建物理世界
	 *
	 * 物理世界是 Ammo.js 的核心，负责：
	 * - 碰撞检测
	 * - 物理模拟（重力、速度、加速度等）
	 * - 约束求解
	 *
	 * @param options - 配置选项
	 * @param options.gravity - 重力向量，默认使用配置中的值
	 */
	createWorld(options: CreateWorldOptions = {}): void {
		const { gravity = PHYSICS_CONFIG.gravity } = options;

		/**
		 * 碰撞检测配置
		 * btDefaultCollisionConfiguration 提供默认的碰撞检测算法配置
		 */
		const collisionConfiguration =
			new this.Ammo.btDefaultCollisionConfiguration();

		/**
		 * 碰撞调度器
		 * 负责处理碰撞检测和碰撞响应
		 */
		const dispatcher = new this.Ammo.btCollisionDispatcher(
			collisionConfiguration
		);

		/**
		 * 宽相位碰撞检测
		 * 使用动态边界体积层次结构（DBVT）快速筛选可能碰撞的对象对
		 * 提高碰撞检测性能
		 */
		const overlappingPairCache = new this.Ammo.btDbvtBroadphase();

		/**
		 * 约束求解器
		 * 使用顺序脉冲约束求解器处理物理约束（如关节、接触等）
		 */
		const constraintSolver =
			new this.Ammo.btSequentialImpulseConstraintSolver();

		/**
		 * 创建离散动力学世界
		 * 这是物理模拟的核心对象，管理所有物理对象和模拟步骤
		 */
		this.physicsWorld = new this.Ammo.btDiscreteDynamicsWorld(
			dispatcher,
			overlappingPairCache,
			constraintSolver,
			collisionConfiguration
		);

		/**
		 * 设置重力
		 * 重力向量影响所有动态刚体的运动
		 */
		this.physicsWorld.setGravity(
			new this.Ammo.btVector3(gravity.x, gravity.y, gravity.z)
		);
	}

	/**
	 * 添加刚体到物理世界
	 *
	 * 将 Three.js 对象和 Ammo.js 刚体关联起来：
	 * 1. 将刚体添加到物理世界
	 * 2. 在 Three.js 对象的 userData 中存储刚体引用
	 * 3. 将对象添加到 rigidBodies 数组以便后续同步
	 *
	 * @param threeObject - Three.js 对象（Mesh、Group 等）
	 * @param rigidBody - Ammo.js 刚体对象
	 */
	addRigidBody(threeObject: THREE.Object3D, rigidBody: any): void {
		if (rigidBody) {
			this.physicsWorld.addRigidBody(rigidBody);
			threeObject.userData.physicsBody = rigidBody;
			this.rigidBodies.push(threeObject);
		}
	}

	/**
	 * 移除刚体
	 *
	 * 从物理世界中移除刚体，并清理关联关系：
	 * 1. 从物理世界中移除刚体
	 * 2. 从 rigidBodies 数组中移除对象
	 * 3. 保留 userData.physicsBody 引用（可选清理）
	 *
	 * @param threeObject - Three.js 对象
	 */
	removeRigidBody(threeObject: THREE.Object3D): void {
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
	 *
	 * 每帧调用此方法以：
	 * 1. 步进物理模拟（计算碰撞、重力、速度等）
	 * 2. 同步物理世界的结果到 Three.js 对象的位置和旋转
	 *
	 * 同步过程：
	 * - 从刚体的运动状态获取世界变换
	 * - 提取位置（origin）和旋转（quaternion）
	 * - 更新 Three.js 对象的 position 和 quaternion
	 *
	 * @param deltaTime - 时间差（秒），通常来自 THREE.Clock
	 * @param maxSubSteps - 最大子步数，默认 10
	 *                     用于处理较大的时间步长，确保模拟稳定性
	 */
	update(deltaTime: number, maxSubSteps: number = 10): void {
		if (!this.physicsWorld) return;

		/**
		 * 步进物理模拟
		 * stepSimulation 会根据 deltaTime 推进物理世界状态
		 * 如果 deltaTime 太大，会自动拆分为多个子步以确保稳定性
		 */
		this.physicsWorld.stepSimulation(deltaTime, maxSubSteps);

		/**
		 * 同步 Three.js 对象位置和旋转
		 * 遍历所有刚体，将物理世界计算的位置和旋转应用到 Three.js 对象
		 */
		for (let i = 0; i < this.rigidBodies.length; i++) {
			const objThree = this.rigidBodies[i];
			const objAmmo = objThree.userData.physicsBody;
			if (!objAmmo) continue;

			/**
			 * 获取运动状态
			 * 运动状态包含刚体的位置和旋转信息
			 */
			const ms = objAmmo.getMotionState();
			if (ms) {
				/**
				 * 获取世界变换
				 * tmpTrans 是复用的临时对象，避免频繁创建以提高性能
				 */
				ms.getWorldTransform(this.tmpTrans);

				/**
				 * 提取位置和旋转
				 * getOrigin() 返回位置向量
				 * getRotation() 返回旋转四元数
				 */
				const p = this.tmpTrans.getOrigin();
				const q = this.tmpTrans.getRotation();

				/**
				 * 更新 Three.js 对象
				 * 将物理世界计算的位置和旋转应用到 Three.js 对象
				 */
				objThree.position.set(p.x(), p.y(), p.z());
				objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
			}
		}
	}

	/**
	 * 获取物理世界实例
	 *
	 * 用于需要直接访问物理世界的场景（通常不需要）
	 *
	 * @returns Ammo.js 物理世界实例
	 */
	getWorld(): any {
		return this.physicsWorld;
	}

	/**
	 * 获取所有刚体关联的 Three.js 对象
	 *
	 * @returns Three.js 对象数组
	 */
	getRigidBodies(): THREE.Object3D[] {
		return this.rigidBodies;
	}

	/**
	 * 清理资源
	 *
	 * 清理所有物理对象和引用，释放内存：
	 * 1. 移除所有刚体
	 * 2. 清理物理世界引用
	 * 3. 清空 rigidBodies 数组
	 *
	 * 注意：Ammo.js 会自动清理内部资源，这里主要清理引用关系
	 */
	dispose(): void {
		// 移除所有刚体（从后往前遍历，避免索引问题）
		for (let i = this.rigidBodies.length - 1; i >= 0; i--) {
			this.removeRigidBody(this.rigidBodies[i]);
		}

		// 清理物理世界引用
		if (this.physicsWorld) {
			// Ammo.js 会自动清理，这里可以添加额外的清理逻辑
			this.physicsWorld = null;
		}

		// 清空数组
		this.rigidBodies = [];
	}
}
