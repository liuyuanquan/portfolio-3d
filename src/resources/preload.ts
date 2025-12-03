/**
 * 预加载 UI 元素管理模块
 * 统一管理预加载相关的 DOM 元素引用，用于控制加载流程和动画效果
 *
 * 功能：
 * - 管理加载动画元素（preload）
 * - 管理加载完成后显示的元素（postload）
 * - 管理淡出动画元素（fadeOutDiv）
 * - 管理开始按钮引用
 */

/**
 * 预加载时显示的元素集合
 * 包括：加载动画（三个圆圈）、Loading 文本等
 * 加载完成后会被隐藏
 */
export const preloadDivs: HTMLCollectionOf<Element> =
	document.getElementsByClassName("preload");

/**
 * 预加载遮罩层元素集合
 * 黑色背景遮罩层，加载完成后会被隐藏
 */
export const preloadOpacity: HTMLCollectionOf<Element> =
	document.getElementsByClassName("preload-overlay");

/**
 * 加载完成后显示的元素集合
 * 包括：开始按钮、标题文本等
 * 加载完成后会被显示
 */
export const postloadDivs: HTMLCollectionOf<Element> =
	document.getElementsByClassName("postload");

/**
 * 开始按钮元素
 * 点击后开始游戏，触发淡出动画
 */
export const startButton: HTMLButtonElement | null = document.getElementById(
	"start-button"
) as HTMLButtonElement | null;

/**
 * 淡出动画元素集合
 * 点击开始按钮后，这些元素会添加 fade-out class，实现淡出效果
 */
export const fadeOutDivs: HTMLCollectionOf<Element> =
	document.getElementsByClassName("fadeOutDiv");
