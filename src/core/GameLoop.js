/**
 * 游戏主循环管理类
 * 封装渲染循环逻辑，统一管理动画更新、物理更新、粒子更新等
 */
import { GAMEPLAY_CONFIG } from "../config";

export class GameLoop {
	/**
	 * @param {Object} options - 配置选项
	 * @param {Function} options.onUpdate - 更新回调函数 (deltaTime) => {}
	 * @param {Function} options.onRender - 渲染回调函数 () => {}
	 * @param {Object} options.stats - Stats.js 实例（可选）
	 * @param {Object} options.clock - THREE.Clock 实例
	 * @param {Object} options.galaxyClock - THREE.Clock 实例（用于星系动画）
	 * @param {Object} options.galaxyMaterial - THREE.ShaderMaterial 实例（可选）
	 */
	constructor(options = {}) {
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
	 */
	start() {
		if (this.isRunning) return;

		this.isRunning = true;
		this.tick();
	}

	/**
	 * 停止游戏循环
	 */
	stop() {
		if (!this.isRunning) return;

		this.isRunning = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	/**
	 * 游戏循环主函数
	 */
	tick() {
		if (!this.isRunning) return;

		// FPS 统计开始
		if (this.stats) {
			this.stats.begin();
		}

		// 计算时间差
		const deltaTime = this.clock.getDelta();

		// 更新星系材质时间（如果存在）
		if (this.galaxyClock && this.galaxyMaterial) {
			const elapsedTime =
				this.galaxyClock.getElapsedTime() +
				this.renderConfig.galaxyTimeOffset;
			this.galaxyMaterial.uniforms.uTime.value =
				elapsedTime * this.renderConfig.galaxyTimeMultiplier;
		}

		// 执行更新逻辑
		if (this.onUpdate) {
			this.onUpdate(deltaTime);
		}

		// 执行渲染逻辑
		if (this.onRender) {
			this.onRender();
		}

		// FPS 统计结束
		if (this.stats) {
			this.stats.end();
		}

		// 请求下一帧
		this.animationFrameId = requestAnimationFrame(() => this.tick());
	}

	/**
	 * 检查循环是否正在运行
	 * @returns {boolean}
	 */
	getRunning() {
		return this.isRunning;
	}
}

