export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat", // 新功能
				"fix", // 修复 bug
				"docs", // 文档变更
				"style", // 代码格式变更
				"refactor", // 代码重构
				"perf", // 性能优化
				"test", // 测试相关
				"build", // 构建系统
				"ci", // CI 配置
				"chore", // 其他变更
				"revert", // 回滚
			],
		],
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"scope-case": [2, "always", "lower-case"],
		"subject-empty": [2, "never"],
		"subject-full-stop": [2, "never", "。"], // 允许中文句号，但不允许英文句号
		"header-max-length": [2, "always", 100],
		"body-leading-blank": [2, "always"],
		"footer-leading-blank": [2, "always"],
		// 允许中文字符
		"subject-case": [0], // 不检查大小写，允许中文
	},
};
