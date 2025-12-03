# Portfolio 2020

作为一个隔离项目，我想学习 3D Web 开发，决定将我的作品集改造成一个使用 [Three.js](https://github.com/mrdoob/three.js) 和 [Ammo.js](https://github.com/kripken/ammo.js)（Bullet 物理引擎的 JavaScript 移植版）构建的交互式 3D 世界。制作过程非常有趣！

试试看！[https://www.0xfloyd.com/](https://www.0xfloyd.com/)

我写了一篇文章解释这个网站，[点击这里查看](https://dev.to/0xfloyd/create-an-interactive-3d-portfolio-website-that-stands-out-to-employers-47gc)

![alt text](/img/portfolio_2020.gif)

## 动机

在探索 [Google Experiments](https://experiments.withgoogle.com/) 时，我发现了一个令人惊叹的 Web 渲染世界。那里有太多令人难以置信的 Web 项目，我想学习这项技术。我受到了许多优秀项目的启发，特别是来自[官方示例/文档](https://threejs.org/)、[Lee Stemkoski](https://home.adelphi.edu/~stemkoski/) 和 [Three.js Fundamentals](https://threejsfundamentals.org/) 的示例。

## 功能特性

- 物理引擎（Ammo.js）与 3D 渲染对象（Three.js）结合，实现实时移动、碰撞检测和交互
- 桌面和移动端响应式设计，支持键盘和触摸屏控制
- 光线投射配合事件监听器，实现用户触摸和点击交互
- FPS 追踪器监控帧率/渲染性能
- 使用 Vite 的 HMR（热模块替换）实现快速开发体验
- 优化的生产构建输出

## 技术栈

- Three.js (3D 图形)
- Ammo.js (物理引擎)
- JavaScript (ES 模块)
- Node.js
- Vite (构建工具和开发服务器)
- HTML/CSS
- Git (版本控制) / Github 代码托管

## 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 使用方法

### 开发

在本地运行开发服务器：

```bash
npm install
npm run dev
```

开发服务器将在 `http://localhost:5173`（或下一个可用端口）启动。

### 构建

构建生产版本：

```bash
npm run build
```

构建后的文件将位于 `dist` 目录。

### 预览

在本地预览生产构建：

```bash
npm run preview
```

## 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。详细信息请阅读 [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md)。

### 快速示例

```bash
# 正确的提交信息（使用中文）
git commit -m "feat: 添加新的粒子效果"
git commit -m "fix(physics): 修复碰撞检测问题"
git commit -m "docs: 更新 README 中的安装说明"

# 错误的提交信息
git commit -m "更新代码"      # 太模糊，缺少类型
git commit -m "fix bug"      # 缺少作用域和详细描述
```

项目使用 [commitlint](https://commitlint.js.org/) 和 [husky](https://typicode.github.io/husky/) 自动验证提交信息。不符合规范的提交信息将被拒绝。

## 许可证

本项目采用 MIT 许可证。
