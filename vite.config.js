import { defineConfig } from "vite";

export default defineConfig({
	base: process.env.NODE_ENV === "production" ? "/portfolio-3d/" : "/",
	build: {
		outDir: "dist",
		assetsDir: "assets",
	},
});
