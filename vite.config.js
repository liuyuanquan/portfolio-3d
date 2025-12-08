import { defineConfig } from "vite";

export default defineConfig({
	base: process.env.NODE_ENV === "production" ? "/portfolio-3d/" : "/",
	build: {
		outDir: "dist",
		assetsDir: "assets",
	},
	server: {
		host: "0.0.0.0", // 允许局域网访问
		port: 5173, // 默认端口
		strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
	},
	preview: {
		host: "0.0.0.0", // 预览模式也允许局域网访问
		port: 4173,
		strictPort: false,
	},
});
