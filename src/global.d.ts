// ==================== Ammo.js 类型声明 ====================

/**
 * Ammo.js 全局函数声明
 */
declare function Ammo(): Promise<AmmoType>;

/**
 * Ammo.js 主类型定义
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

// ==================== 物理相关选项 ====================

/**
 * 砖块数据接口
 */
interface BrickData {
	/** 砖块网格对象 */
	brick: THREE.Mesh;
	/** 砖块质量 */
	mass: number;
	/** 砖块缩放 */
	scale: { x: number; y: number; z: number };
	/** 砖块旋转四元数 */
	quat: THREE.Quaternion;
}

/**
 * 广告牌配置项类型（从 BILLBOARDS_CONFIG 派生）
 */
type BillboardConfigItem = (typeof BILLBOARDS_CONFIG.billboards)[number];

/**
 * 广告牌项接口
 */
interface BillboardItem {
	/** 广告牌杆 */
	pole: THREE.Mesh;
	/** 广告牌面板 */
	sign: THREE.Mesh;
	/** 文本平面 */
	textPlane: THREE.Mesh;
	/** 配置信息 */
	itemConfig: BillboardConfigItem;
}

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
	/** 恢复系数（反弹系数，0-1，0=不反弹，1=完全反弹，默认 0） */
	restitution?: number;
	/** 碰撞边距（默认 0.05） */
	margin?: number;
}

// ==================== 资源加载选项 ====================

/**
 * 纹理加载选项（可选参数）
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

/**
 * 纹理选项接口（完整参数）
 */
interface TextureOptions {
	/** 是否生成 mipmaps */
	generateMipmaps: boolean;
	/** 最小过滤模式 */
	minFilter: THREE.TextureFilter;
	/** 最大过滤模式 */
	magFilter: THREE.TextureFilter;
	/** 各向异性过滤 */
	anisotropy: number;
	/** S 轴纹理包裹模式 */
	wrapS: THREE.Wrapping;
	/** T 轴纹理包裹模式 */
	wrapT: THREE.Wrapping;
	/** 颜色编码 */
	encoding: THREE.TextureEncoding;
	/** 纹理重复次数 */
	repeat: { x: number; y: number };
}

// ==================== 游戏循环配置 ====================

/**
 * 游戏循环配置选项
 */
interface GameLoopOptions {
	/** 更新回调函数，每帧调用，接收 deltaTime（秒）和 clock 作为参数 */
	onUpdate: (deltaTime: number, clock: THREE.Clock) => void;
	/** 渲染回调函数，每帧调用，执行渲染操作 */
	onRender: () => void;
	/** Stats.js 实例（可选），如果提供则使用，否则内部创建 */
	stats?: Stats | null;
}

// ==================== 输入控制 ====================

/**
 * 移动方向接口（存储键盘/触摸输入状态）
 */
interface MoveDirection {
	/** 左方向（0 或 1） */
	left: number;
	/** 右方向（0 或 1） */
	right: number;
	/** 前进方向（0 或 1） */
	forward: number;
	/** 后退方向（0 或 1） */
	back: number;
}
