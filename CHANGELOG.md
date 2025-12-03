# 更新日志

本项目的所有重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/spec/v2.0.0.html)。

## [未发布]

### 新增

- 添加了遵循 Conventional Commits 规范的提交信息约定
- 添加了 commitlint 和 husky 用于自动验证提交信息
- 添加了 `COMMIT_CONVENTION.md` 文档
- 添加了 Vite 配置（`vite.config.js`）
- 添加了 `CHANGELOG.md` 用于跟踪项目变更
- 在 `package.json` 中添加了 `engines` 字段，指定 Node.js 和 npm 版本要求
- 在 `package.json` 中添加了 `homepage`、`keywords`、`repository`、`bugs` 字段，优化项目元数据
- 添加了 `private` 字段，防止意外发布到 npm
- 添加了 `browserslist` 配置，指定浏览器支持范围
- 添加了 `sideEffects: false` 配置，优化 tree-shaking
- 改进了项目结构，组织资源文件到相应目录

### 变更

- 从 Webpack 迁移到 Vite，提升开发和构建速度
- 更新项目结构：将静态资源组织到 `public/img/`、`public/css/`、`public/json/` 和 `public/ammo/` 目录
- 将 GLSL 着色器文件移动到 `src/shaders/` 目录
- 更改着色器文件导入方式，使用 Vite 原生的 `?raw` 查询参数替代自定义插件
- 将 Ammo.js 从 npm 包改为全局 script 标签导入，简化设置
- 更新所有资源文件路径，从 `/src/jsm/` 改为对应的新目录路径
- 提交信息规范改为使用中文描述
- 项目名称从 `portfolio_2020` 更新为 `portfolio-3d`
- 更新项目描述，明确为个人 3D 交互式作品集网站
- 更新仓库地址为 `git@github.com:liuyuanquan/portfolio-3d.git`
- 更新作者信息为 liuyuanquan
- 更新 README.md 和 index.html，优化项目文档结构和页面内容
- 配置 GitHub Pages 自动部署
- 优化 Vite 配置，区分开发和生产环境的 base 路径

### 移除

- 移除了 Webpack 及相关依赖（`webpack`、`webpack-cli`、`webpack-dev-server`、`babel-loader`、`compression-webpack-plugin`）
- 移除了 Babel 依赖（`@babel/core`、`@babel/preset-env`）- Vite 原生支持 ES 模块
- 移除了 `vite-plugin-glsl` - 改用 Vite 原生的 `?raw` 导入
- 移除了 Express 服务器（`express` 包和 `server.js`）- 改用静态托管
- 移除了 `ammo.js` npm 依赖 - 改用全局 script 标签导入
- 移除了 `webpack.config.js` 配置文件
- 移除了根目录的重复 `style.css` 文件
- 移除了未使用的 `src/builds/` 目录
- 移除了 `heroku-postbuild` 构建脚本
- 移除了空的 `public/jsm/` 和 `src/jsm/` 目录（文件已重新组织）
- 移除了空的 `src/components/` 和 `src/utils/` 目录
- 移除了未使用的 `SVG.reactLogo` 引用

### 修复

- 修复了 Ammo.js 的 ES 模块兼容性问题
- 修复了使用 Vite 原生 `?raw` 导入的着色器文件加载问题
- 修复了由插件冲突导致的模块执行问题

## [1.0.0] - 2020

### 新增

- 初始版本发布
- 使用 Three.js 和 Ammo.js 构建的交互式 3D 作品集
- 物理引擎集成，实现实时移动和碰撞检测
- 桌面和移动端响应式设计
- 用于用户交互的光线投射
- FPS 追踪器用于性能监控
