// ==================== Ammo.js 类型声明 ====================

/**
 * Ammo.js 全局函数
 */
declare function Ammo(): Promise<AmmoType>;

/**
 * Ammo.js 类型定义
 */
type AmmoType = any;

/**
 * Ammo.js 物理世界接口
 */
interface AmmoPhysicsWorld {
	setGravity(gravity: any): void;
	addRigidBody(rigidBody: any): void;
	removeRigidBody(rigidBody: any): void;
	stepSimulation(deltaTime: number, maxSubSteps: number): void;
}

// ==================== 对象创建选项 ====================

/**
 * 创建墙壁的选项
 */
interface CreateWallOptions {
	/** X 坐标 */
	x: number;
	/** Y 坐标 */
	y: number;
	/** Z 坐标 */
	z: number;
	/** 墙壁缩放 */
	wallScale: { x: number; y: number; z: number };
}

/**
 * 创建砖块的选项
 */
interface CreateBrickOptions {
	/** X 方向尺寸 */
	sx: number;
	/** Y 方向尺寸 */
	sy: number;
	/** Z 方向尺寸 */
	sz: number;
	/** 质量 */
	mass: number;
	/** 位置 */
	pos: THREE.Vector3;
	/** 旋转四元数 */
	quat: THREE.Quaternion;
	/** 材质 */
	material: THREE.Material;
}

// ==================== 物理相关选项 ====================

/**
 * 添加刚体物理的选项
 */
interface AddRigidPhysicsOptions {
	/** 对象缩放 {x, y, z}（用于盒子形状） */
	scale?: { x: number; y: number; z: number };
	/** 半径（用于球体形状） */
	radius?: number;
	/** 质量（默认 0，静态物体） */
	mass?: number;
	/** 旋转四元数（默认 { x: 0, y: 0, z: 0, w: 1 }） */
	quat?: { x: number; y: number; z: number; w: number };
	/** 滚动摩擦系数 */
	rollingFriction?: number;
	/** 摩擦系数 */
	friction?: number;
	/** 碰撞边距（默认使用 PHYSICS_CONFIG.collisionMargin） */
	margin?: number;
}

// ==================== 资源加载选项 ====================

/**
 * 纹理加载选项
 */
interface TextureLoadOptions {
	/** 是否生成 mipmaps，默认 false */
	generateMipmaps?: boolean;
	/** 最小过滤模式，默认 THREE.LinearFilter */
	minFilter?: THREE.TextureFilter;
	/** 最大过滤模式，默认 THREE.LinearFilter */
	magFilter?: THREE.TextureFilter;
	/** 各向异性过滤，默认 1 */
	anisotropy?: number;
	/** S 轴纹理包裹模式，默认 THREE.ClampToEdgeWrapping */
	wrapS?: THREE.Wrapping;
	/** T 轴纹理包裹模式，默认 THREE.ClampToEdgeWrapping */
	wrapT?: THREE.Wrapping;
	/** 颜色编码，默认 THREE.sRGBEncoding */
	encoding?: THREE.TextureEncoding;
	/** 纹理重复次数，默认 { x: 1, y: 1 } */
	repeat?: { x: number; y: number };
}

// ==================== 返回值类型 ====================

/**
 * 广告牌返回类型
 * 用于 createBillboard 和 createBillboardRotated 函数的返回值
 */
interface BillboardResult {
	pole: THREE.Mesh;
	sign: THREE.Mesh;
}
