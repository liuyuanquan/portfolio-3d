import { defineConfig } from "vite";

export default defineConfig({
	// 开发环境使用根路径，生产环境使用子路径（GitHub Pages）
	base: process.env.NODE_ENV === "production" ? "/portfolio-3d/" : "/",
	build: {
		outDir: "dist",
		assetsDir: "assets",
	},
});
