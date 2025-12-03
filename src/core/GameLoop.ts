/**
 * 游戏主循环管理类
 * 封装渲染循环逻辑，统一管理动画更新、物理更新、粒子更新等
 *
 * 功能：
 * - 管理渲染循环的启动和停止
 * - 统一处理更新逻辑和渲染逻辑
 * - 自动更新 FPS 统计
 * - 自动更新星系材质的时间 uniform
 */
import * as THREE from "three";
import Stats from "stats.js";
import { GAMEPLAY_CONFIG } from "../config";

/**
 * 游戏循环配置选项
 */
export interface GameLoopOptions {
	/** 更新回调函数，每帧调用，接收 deltaTime（秒）作为参数 */
	onUpdate: (deltaTime: number) => void;
	/** 渲染回调函数，每帧调用，执行渲染操作 */
	onRender: () => void;
	/** Stats.js 实例（可选），用于 FPS 统计 */
	stats?: Stats | null;
	/** THREE.Clock 实例，用于计算时间差 */
	clock: THREE.Clock;
	/** THREE.Clock 实例（可选），用于星系动画的时间计算 */
	galaxyClock?: THREE.Clock | null;
	/** THREE.ShaderMaterial 实例（可选），星系材质，需要更新 uTime uniform */
	galaxyMaterial?: THREE.ShaderMaterial | null;
}

/**
 * 游戏主循环管理类
 *
 * 职责：
 * 1. 管理渲染循环的生命周期（启动/停止）
 * 2. 统一调用更新和渲染回调
 * 3. 处理 FPS 统计
 * 4. 更新星系材质的时间 uniform
 *
 * 工作流程：
 * 1. start() 启动循环
 * 2. tick() 每帧执行：
 *    - 开始 FPS 统计
 *    - 计算时间差（deltaTime）
 *    - 更新星系材质时间
 *    - 调用 onUpdate(deltaTime)
 *    - 调用 onRender()
 *    - 结束 FPS 统计
 *    - 请求下一帧
 */
export class GameLoop {
	/** 更新回调函数 */
	private onUpdate: (deltaTime: number) => void;

	/** 渲染回调函数 */
	private onRender: () => void;

	/** Stats.js 实例（可选） */
	private stats: Stats | null;

	/** THREE.Clock 实例 */
	private clock: THREE.Clock;

	/** 星系时钟实例（可选） */
	private galaxyClock: THREE.Clock | null;

	/** 星系材质实例（可选） */
	private galaxyMaterial: THREE.ShaderMaterial | null;

	/** 循环是否正在运行 */
	private isRunning: boolean;

	/** 当前动画帧 ID（用于取消请求） */
	private animationFrameId: number | null;

	/** 渲染循环配置 */
	private renderConfig: typeof GAMEPLAY_CONFIG.renderLoop;

	/**
	 * 构造函数
	 *
	 * @param options - 配置选项
	 * @param options.onUpdate - 更新回调函数 (deltaTime) => {}
	 * @param options.onRender - 渲染回调函数 () => {}
	 * @param options.stats - Stats.js 实例（可选）
	 * @param options.clock - THREE.Clock 实例
	 * @param options.galaxyClock - THREE.Clock 实例（用于星系动画）
	 * @param options.galaxyMaterial - THREE.ShaderMaterial 实例（可选）
	 */
	constructor(options: GameLoopOptions) {
		const {
			onUpdate,
			onRender,
			stats = null,
			clock,
			galaxyClock = null,
			galaxyMaterial = null,
		} = options;

		this.onUpdate = onUpdate;
		this.onRender = onRender;
		this.stats = stats;
		this.clock = clock;
		this.galaxyClock = galaxyClock;
		this.galaxyMaterial = galaxyMaterial;

		this.isRunning = false;
		this.animationFrameId = null;
		this.renderConfig = GAMEPLAY_CONFIG.renderLoop;
	}

	/**
	 * 启动游戏循环
	 *
	 * 如果循环已经在运行，则不会重复启动
	 */
	start(): void {
		if (this.isRunning) return;

		this.isRunning = true;
		this.tick();
	}

	/**
	 * 停止游戏循环
	 *
	 * 取消当前的动画帧请求，停止循环
	 */
	stop(): void {
		if (!this.isRunning) return;

		this.isRunning = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	/**
	 * 游戏循环主函数
	 *
	 * 每帧执行的核心逻辑：
	 * 1. FPS 统计开始
	 * 2. 计算时间差（deltaTime）
	 * 3. 更新星系材质时间（如果存在）
	 * 4. 执行更新逻辑（物理、动画等）
	 * 5. 执行渲染逻辑
	 * 6. FPS 统计结束
	 * 7. 请求下一帧
	 *
	 * 使用箭头函数确保 this 上下文正确
	 */
	private tick = (): void => {
		if (!this.isRunning) return;

		/**
		 * FPS 统计开始
		 * Stats.js 会记录这一帧的开始时间
		 */
		if (this.stats) {
			this.stats.begin();
		}

		/**
		 * 计算时间差
		 * getDelta() 返回自上次调用以来的时间差（秒）
		 * 用于确保物理模拟和动画的时间一致性
		 */
		const deltaTime = this.clock.getDelta();

		/**
		 * 更新星系材质时间
		 * 如果存在星系材质和时钟，更新 uTime uniform
		 * 用于驱动星系的旋转动画
		 */
		if (this.galaxyClock && this.galaxyMaterial) {
			/**
			 * 计算经过的时间
			 * 添加时间偏移量，使动画从特定时间点开始
			 * 乘以时间倍增器，控制动画速度
			 */
			const elapsedTime =
				this.galaxyClock.getElapsedTime() + this.renderConfig.galaxyTimeOffset;

			/**
			 * 更新材质 uniform
			 * uTime 在着色器中用于计算旋转角度
			 */
			this.galaxyMaterial.uniforms.uTime.value =
				elapsedTime * this.renderConfig.galaxyTimeMultiplier;
		}

		/**
		 * 执行更新逻辑
		 * 包括：
		 * - 物理引擎更新
		 * - 球体移动
		 * - 粒子系统更新
		 * - 其他游戏逻辑
		 */
		if (this.onUpdate) {
			this.onUpdate(deltaTime);
		}

		/**
		 * 执行渲染逻辑
		 * 调用 Three.js 渲染器渲染场景
		 */
		if (this.onRender) {
			this.onRender();
		}

		/**
		 * FPS 统计结束
		 * Stats.js 会记录这一帧的结束时间，计算 FPS
		 */
		if (this.stats) {
			this.stats.end();
		}

		/**
		 * 请求下一帧
		 * requestAnimationFrame 会在浏览器准备好下一帧时调用 tick
		 * 使用箭头函数确保 this 上下文正确
		 */
		this.animationFrameId = requestAnimationFrame(this.tick);
	};

	/**
	 * 检查循环是否正在运行
	 *
	 * @returns 循环是否正在运行
	 */
	getRunning(): boolean {
		return this.isRunning;
	}
}
