import * as THREE from "three";
import { manager } from "../resources/world";

/**
 * BASE URL（开发环境为 /，生产环境为 /portfolio-3d/）
 */
const BASE_URL: string = (import.meta.env as any).BASE_URL;

/**
 * 默认字体路径
 */
const DEFAULT_FONT_PATH = `${BASE_URL}json/Roboto_Regular.json`;

/**
 * 字体加载选项
 */
export interface FontLoaderOptions {
	/** 字体加载完成后的回调函数 */
	onLoad: (font: THREE.Font) => void;
}

/**
 * 加载字体
 *
 * @param options - 配置选项
 */
export function loadFont(options: FontLoaderOptions): void {
	const loader = new THREE.FontLoader(manager);
	const { onLoad } = options;

	loader.load(
		DEFAULT_FONT_PATH,
		(font: THREE.Font) => {
			onLoad(font);
		},
		undefined,
		(error: ErrorEvent) => {
			console.error("字体文件加载错误:", error);
		}
	);
}
