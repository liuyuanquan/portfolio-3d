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
 * 创建链接盒子的选项
 */
interface CreateBoxOptions {
	/** X 坐标 */
	x: number;
	/** Y 坐标 */
	y: number;
	/** Z 坐标 */
	z: number;
	/** X 轴缩放 */
	scaleX: number;
	/** Y 轴缩放 */
	scaleY: number;
	/** Z 轴缩放 */
	scaleZ: number;
	/** 盒子纹理路径 */
	boxTexture: string;
	/** 点击跳转的链接 */
	URLLink: string;
	/** 边框颜色，默认 0x000000 */
	color?: number;
	/** 是否透明，默认 true */
	transparent?: boolean;
	/** 图片背景色（当 transparent 为 false 时使用），默认使用 color */
	backgroundColor?: number;
	/** 浮动标签配置（可选） */
	label?: {
		/** X 坐标 */
		x: number;
		/** Y 坐标 */
		y: number;
		/** Z 坐标 */
		z: number;
		/** 要显示的文本内容 */
		inputMessage: string;
	};
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
	/** 碰撞边距（默认 0.05） */
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

// ==================== 游戏循环配置 ====================

/**
 * 游戏循环配置选项
 */
interface GameLoopOptions {
	/** 更新回调函数，每帧调用，接收 deltaTime（秒）作为参数 */
	onUpdate: (deltaTime: number) => void;
	/** 渲染回调函数，每帧调用，执行渲染操作 */
	onRender: () => void;
	/** Stats.js 实例（可选），如果提供则使用，否则内部创建 */
	stats?: Stats | null;
}
