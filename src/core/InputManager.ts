/**
 * 输入管理器模块
 */
import nipplejs from "nipplejs";
import type { JoystickManager, JoystickManagerOptions } from "nipplejs";

export interface MoveDirection {
	left: number;
	right: number;
	forward: number;
	back: number;
}

export let moveDirection: MoveDirection = {
	left: 0,
	right: 0,
	forward: 0,
	back: 0,
};

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

export function resetMoveDirection(): void {
	moveDirection.forward = 0;
	moveDirection.left = 0;
	moveDirection.right = 0;
	moveDirection.back = 0;
}

export function initInput(): void {
	window.addEventListener("keydown", handleKeyDown, false);
	window.addEventListener("keyup", handleKeyUp, false);
	window.addEventListener("blur", resetMoveDirection, false);
}

function handleKeyDown(event: KeyboardEvent): void {
	const direction = KEY_MAP[event.key];
	if (direction) {
		moveDirection[direction] = 1;
	}
}

function handleKeyUp(event: KeyboardEvent): void {
	const direction = KEY_MAP[event.key];
	if (direction) {
		moveDirection[direction] = 0;
	}
}

const JOYSTICK_CONFIG: JoystickManagerOptions = {
	mode: "static",
	position: { left: "50%", top: "50%" },
	size: 125,
	color: "rgba(255, 255, 255, 0.5)",
	dynamicPage: true,
};

export function initJoystick(parent: HTMLElement): void {
	const manager: JoystickManager = nipplejs.create({
		...JOYSTICK_CONFIG,
		zone: parent,
	});

	manager.on("move", (_evt, data) => {
		if (!data.direction) {
			resetMoveDirection();
			return;
		}

		const { x, y } = data.direction;
		moveDirection.left = x === "left" ? 1 : 0;
		moveDirection.right = x === "right" ? 1 : 0;
		moveDirection.forward = y === "up" ? 1 : 0;
		moveDirection.back = y === "down" ? 1 : 0;
	});

	manager.on("end", resetMoveDirection);
}
