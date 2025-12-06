/**
 * 游戏主循环管理类
 */
import * as THREE from "three";
import Stats from "stats.js";

export class GameLoop {
	private readonly onUpdate: (deltaTime: number) => void;
	private readonly onRender: () => void;
	private readonly stats: Stats | null;
	private readonly clock: THREE.Clock;
	private isRunning: boolean = false;
	private animationFrameId: number | null = null;

	constructor(options: GameLoopOptions) {
		const { onUpdate, onRender, stats = null } = options;

		this.onUpdate = onUpdate;
		this.onRender = onRender;
		this.clock = new THREE.Clock();
		this.stats = stats || this.createStats();
	}

	private createStats(): Stats | null {
		const stats = new Stats();
		document.body.appendChild(stats.dom);
		return stats;
	}

	getClock(): THREE.Clock {
		return this.clock;
	}

	start(): void {
		if (this.isRunning) return;
		this.isRunning = true;
		this.tick();
	}

	stop(): void {
		if (!this.isRunning) return;
		this.isRunning = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	get running(): boolean {
		return this.isRunning;
	}

	private tick = (): void => {
		if (!this.isRunning) return;

		this.stats?.begin();

		const deltaTime = this.clock.getDelta();

		this.onUpdate(deltaTime);
		this.onRender();

		this.stats?.end();

		this.animationFrameId = requestAnimationFrame(this.tick);
	};
}
