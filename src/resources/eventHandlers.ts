/**
 * 事件处理模块
 * 处理键盘输入、触摸输入和虚拟摇杆控制
 *
 * 功能：
 * - 键盘方向键和 WASD 键控制
 * - 触摸设备检测
 * - 虚拟摇杆创建和控制（使用 nippleJS 库）
 * - 移动方向状态管理
 */
import nipplejs from "nipplejs";
import type { JoystickManager, JoystickManagerOptions } from "nipplejs";

/**
 * 移动方向状态
 * 记录当前移动方向，用于控制球体移动
 */
export interface MoveDirection {
	/** 左移（A 键或左箭头） */
	left: number;
	/** 右移（D 键或右箭头） */
	right: number;
	/** 前进（W 键或上箭头） */
	forward: number;
	/** 后退（S 键或下箭头） */
	back: number;
}

/**
 * 移动方向状态对象
 * 值：0 = 未按下，1 = 按下
 */
export let moveDirection: MoveDirection = {
	left: 0,
	right: 0,
	forward: 0,
	back: 0,
};

/**
 * 按键到移动方向的映射
 * 使用 event.key 而不是已废弃的 keyCode
 */
const KEY_MAP: Record<string, keyof MoveDirection> = {
	// WASD 键
	w: "forward",
	W: "forward",
	s: "back",
	S: "back",
	a: "left",
	A: "left",
	d: "right",
	D: "right",
	// 方向键
	ArrowUp: "forward",
	ArrowDown: "back",
	ArrowLeft: "left",
	ArrowRight: "right",
};

/**
 * 重置所有移动方向为 0
 */
function resetMoveDirection(): void {
	moveDirection.forward = 0;
	moveDirection.left = 0;
	moveDirection.right = 0;
	moveDirection.back = 0;
}

/**
 * 设置事件处理器
 *
 * 注册键盘事件监听器：
 * - keydown: 按键按下时触发
 * - keyup: 按键释放时触发
 *
 * 支持的按键：
 * - W / 上箭头：前进
 * - S / 下箭头：后退
 * - A / 左箭头：左移
 * - D / 右箭头：右移
 */
export function setupEventHandlers(): void {
	window.addEventListener("keydown", handleKeyDown, false);
	window.addEventListener("keyup", handleKeyUp, false);
}

/**
 * 处理按键按下事件
 *
 * 当用户按下方向键或 WASD 键时，设置对应的移动方向为 1
 *
 * @param event - 键盘事件对象
 */
function handleKeyDown(event: KeyboardEvent): void {
	const direction = KEY_MAP[event.key];
	if (direction) {
		moveDirection[direction] = 1;
	}
}

/**
 * 处理按键释放事件
 *
 * 当用户释放方向键或 WASD 键时，设置对应的移动方向为 0
 *
 * @param event - 键盘事件对象
 */
function handleKeyUp(event: KeyboardEvent): void {
	const direction = KEY_MAP[event.key];
	if (direction) {
		moveDirection[direction] = 0;
	}
}

/**
 * 检测是否为触摸设备
 *
 * 通过多种方式检测设备是否支持触摸：
 * 1. 检查 window.ontouchstart 属性
 * 2. 检查 navigator.msPointerEnabled（Windows 8）
 * 3. 检查 document.documentElement.ontouchstart
 *
 * @returns 如果设备支持触摸，返回 true；否则返回 false
 */
export function isTouchscreenDevice(): boolean {
	return (
		"ontouchstart" in window ||
		("msPointerEnabled" in window.navigator &&
			(window.navigator as any).msPointerEnabled) ||
		"ontouchstart" in document.documentElement
	);
}

/**
 * nippleJS 摇杆配置常量
 */
const JOYSTICK_CONFIG: JoystickManagerOptions = {
	mode: "static",
	position: { left: "50%", top: "50%" },
	size: 125,
	color: "rgba(255, 255, 255, 0.5)",
	dynamicPage: true,
};

/**
 * 创建虚拟摇杆（使用 nippleJS 库）
 *
 * 在移动设备上创建一个可拖拽的虚拟摇杆，用于控制球体移动。
 * 使用 nippleJS 库实现，提供更好的性能和用户体验。
 *
 * 工作原理：
 * 1. 使用 nippleJS 创建虚拟摇杆管理器
 * 2. 监听摇杆移动事件，获取方向信息
 * 3. 根据摇杆方向更新移动方向状态
 * 4. 释放时重置移动方向
 *
 * @param parent - 父元素（通常是 joystick-wrapper）
 */
export function createJoystick(parent: HTMLElement): void {
	/**
	 * 创建 nippleJS 摇杆管理器
	 */
	const manager: JoystickManager = nipplejs.create({
		...JOYSTICK_CONFIG,
		zone: parent,
	});

	/**
	 * 监听摇杆移动事件
	 * 当用户拖拽摇杆时触发
	 */
	manager.on("move", (_evt, data) => {
		/**
		 * 安全检查：确保 data.direction 存在
		 * 在某些情况下（如摇杆在中心位置），direction 可能为 undefined
		 */
		if (!data.direction) {
			// 如果方向未定义，重置所有移动方向
			resetMoveDirection();
			return;
		}

		/**
		 * 直接使用 nippleJS 提供的方向信息
		 * data.direction 包含：
		 * - x: 'left' | 'right' | undefined（当不在水平方向时）
		 * - y: 'up' | 'down' | undefined（当不在垂直方向时）
		 */
		const { x, y } = data.direction;

		/**
		 * 根据方向更新移动方向状态
		 */
		// 水平方向（左右）
		moveDirection.left = x === "left" ? 1 : 0;
		moveDirection.right = x === "right" ? 1 : 0;

		// 垂直方向（前后）
		// nippleJS 的 'up' 对应前进（forward），'down' 对应后退（back）
		moveDirection.forward = y === "up" ? 1 : 0;
		moveDirection.back = y === "down" ? 1 : 0;
	});

	/**
	 * 监听摇杆释放事件
	 * 当用户释放摇杆时触发
	 */
	manager.on("end", resetMoveDirection);
}
