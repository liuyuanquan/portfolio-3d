/**
 * 交互管理器模块
 * 负责处理键盘输入、触摸设备虚拟摇杆、鼠标/触摸交互和窗口大小变化
 */
import nipplejs from "nipplejs";
import type { JoystickManager, JoystickManagerOptions } from "nipplejs";
import { isTouchscreenDevice } from "../utils";
import { INPUT_CONFIG } from "../config";
import { World } from "./World";

/**
 * 键盘按键到移动方向的映射表
 */
const KEY_MAP: Record<string, keyof MoveDirection> = {
	w: "forward",
	W: "forward",
	s: "back",
	S: "back",
	a: "left",
	A: "left",
	d: "right",
	D: "right",
	ArrowUp: "forward",
	ArrowDown: "back",
	ArrowLeft: "left",
	ArrowRight: "right",
};

/**
 * 交互管理器类
 * 负责处理键盘输入、触摸设备虚拟摇杆、鼠标/触摸交互和窗口大小变化
 */
export class InteractionManager {
	/** World 实例 */
	private world: World;
	/** 当前移动方向状态 */
	public moveDirection: MoveDirection = {
		left: 0,
		right: 0,
		forward: 0,
		back: 0,
	};

	constructor(world: World) {
		this.world = world;
		world.interactionManager = this;
	}

	/**
	 * 初始化交互系统
	 * 注册键盘事件监听器，并在触摸设备上初始化虚拟摇杆
	 */
	public init(): void {
		this.setupKeyboardListeners();
		this.setupJoystick();
		this.setupEventListeners();
	}

	/**
	 * 设置键盘事件监听器
	 */
	private setupKeyboardListeners(): void {
		window.addEventListener("keydown", this.handleKeyDown.bind(this), false);
		window.addEventListener("keyup", this.handleKeyUp.bind(this), false);
		window.addEventListener("blur", this.resetMoveDirection.bind(this), false);
	}

	/**
	 * 初始化虚拟摇杆（仅在触摸设备上）
	 */
	private setupJoystick(): void {
		if (!isTouchscreenDevice()) {
			return;
		}

		const joystickWrapper = document.getElementById("joystick-wrapper");
		if (joystickWrapper) {
			this.initJoystick(joystickWrapper);
		}
	}

	/**
	 * 设置鼠标、触摸和窗口事件监听器
	 */
	private setupEventListeners(): void {
		const canvas = this.world.renderer.domElement;

		canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
		canvas.addEventListener("click", this.handleClick.bind(this));
		// 使用 passive: true 提高性能，因为我们不需要阻止默认行为
		canvas.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: true });
		window.addEventListener("resize", this.handleResize.bind(this));
	}

	/**
	 * 初始化虚拟摇杆
	 * @param parent 摇杆容器 DOM 元素
	 */
	private initJoystick(parent: HTMLElement): void {
		const manager: JoystickManager = nipplejs.create({
			...INPUT_CONFIG.joystick,
			zone: parent,
		} as JoystickManagerOptions);

		manager.on("move", (_evt, data) => {
			if (!data.direction) {
				this.resetMoveDirection();
				return;
			}
			this.updateMoveDirectionFromJoystick(data.direction);
		});

		manager.on("end", () => {
			this.resetMoveDirection();
		});
	}

	/**
	 * 根据摇杆方向更新移动方向状态
	 * @param direction 摇杆方向对象
	 */
	private updateMoveDirectionFromJoystick(direction: { x: string; y: string }): void {
		const { x, y } = direction;
		this.moveDirection.left = x === "left" ? 1 : 0;
		this.moveDirection.right = x === "right" ? 1 : 0;
		this.moveDirection.forward = y === "up" ? 1 : 0;
		this.moveDirection.back = y === "down" ? 1 : 0;
	}

	/**
	 * 重置所有移动方向状态为 0
	 */
	private resetMoveDirection(): void {
		this.moveDirection = {
			left: 0,
			right: 0,
			forward: 0,
			back: 0,
		};
	}

	/**
	 * 处理键盘按下事件
	 * @param event 键盘事件对象
	 */
	private handleKeyDown(event: KeyboardEvent): void {
		const direction = KEY_MAP[event.key];
		if (direction) {
			this.moveDirection[direction] = 1;
		}
	}

	/**
	 * 处理键盘释放事件
	 * @param event 键盘事件对象
	 */
	private handleKeyUp(event: KeyboardEvent): void {
		const direction = KEY_MAP[event.key];
		if (direction) {
			this.moveDirection[direction] = 0;
		}
	}

	/**
	 * 处理鼠标移动事件
	 * @param event 鼠标事件对象
	 */
	private handleMouseMove(event: MouseEvent): void {
		this.world.cameraControl.launchHover(event);
	}

	/**
	 * 处理点击事件
	 * @param event 鼠标事件对象
	 */
	private handleClick(event: MouseEvent): void {
		this.world.cameraControl.launchClickPosition(event);
	}

	/**
	 * 处理触摸开始事件
	 * @param event 触摸事件对象
	 */
	private handleTouchStart(event: TouchEvent): void {
		this.world.cameraControl.launchClickPosition(event);
	}

	/**
	 * 处理窗口大小变化事件
	 */
	private handleResize(): void {
		this.world.cameraControl.camera.aspect = window.innerWidth / window.innerHeight;
		this.world.cameraControl.camera.updateProjectionMatrix();
		this.world.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
