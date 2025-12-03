# Portfolio 3D

个人 3D 交互式作品集网站，使用 [Three.js](https://github.com/mrdoob/three.js) 和 [Ammo.js](https://github.com/kripken/ammo.js)（Bullet 物理引擎的 JavaScript 移植版）构建，用于展示 GitHub 开源项目、工作经历和 Three.js 3D 效果。

![alt text](https://github.com/liuyuanquan/portfolio-3d/raw/main/public/img/portfolio_2020.gif)

## 项目简介

这是一个基于 WebGL 的 3D 交互式个人作品集网站，通过物理引擎和 3D 渲染技术，以创新的方式展示个人技能、项目和工作经历。网站支持桌面和移动端访问，提供沉浸式的浏览体验。

## 功能特性

- **3D 物理引擎**：使用 Ammo.js 实现实时物理模拟，包括碰撞检测、重力和物体交互
- **交互式 3D 场景**：使用 Three.js 构建丰富的 3D 环境，支持实时渲染和动画
- **响应式设计**：完美适配桌面和移动设备，支持键盘和触摸屏控制
- **光线投射交互**：通过光线投射技术实现精确的点击和触摸交互
- **性能监控**：内置 FPS 追踪器，实时监控渲染性能
- **现代化构建**：使用 Vite 构建工具，支持 HMR（热模块替换）和优化的生产构建

## 技术栈

- **Three.js** - 3D 图形渲染库
- **Ammo.js** - 物理引擎（Bullet Physics 的 JavaScript 移植版）
- **JavaScript (ES Modules)** - 现代 JavaScript 模块系统
- **Vite** - 快速的前端构建工具和开发服务器
- **Node.js** - JavaScript 运行时环境

## 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

运行开发服务器：

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173`（或下一个可用端口）启动。

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
portfolio-3d/
├── public/          # 静态资源
│   ├── ammo/        # Ammo.js 物理引擎文件
│   ├── css/         # 样式文件
│   ├── img/         # 图片资源
│   └── json/        # JSON 文件（字体等）
├── src/             # 源代码
│   ├── config/      # 配置管理模块
│   │   ├── physics.js    # 物理引擎配置
│   │   ├── scene.js      # 场景配置
│   │   ├── objects.js    # 对象默认配置
│   │   ├── gameplay.js   # 游戏玩法配置
│   │   ├── positions.js  # 场景对象位置配置
│   │   └── index.js      # 统一导出
│   ├── core/        # 核心模块
│   │   ├── PhysicsEngine.js  # 物理引擎管理类
│   │   └── GameLoop.js       # 游戏主循环管理类
│   ├── objects/     # 对象创建模块
│   │   ├── Balls.js          # 球体对象
│   │   ├── Boxes.js          # 盒子对象
│   │   ├── Billboards.js     # 广告牌对象
│   │   ├── Walls.js          # 墙壁对象
│   │   ├── Planes.js         # 平面对象
│   │   ├── Shapes.js         # 形状对象
│   │   ├── Text.js           # 3D 文字对象
│   │   ├── PhysicsHelpers.js # 物理辅助函数
│   │   └── index.js          # 统一导出
│   ├── resources/   # 资源管理模块
│   ├── utils/        # 工具函数模块
│   │   └── textureLoader.js  # 纹理加载辅助函数
│   ├── shaders/     # GLSL 着色器文件
│   ├── app.js       # 主应用入口
│   └── WebGL.js     # WebGL 检测模块
├── index.html       # HTML 入口文件
└── vite.config.js   # Vite 配置文件
```

## 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。详细信息请阅读 [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md)。

### 提交示例

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

## 部署

项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 自动部署

当代码推送到 `main` 分支时，GitHub Actions 会自动：

1. 构建项目
2. 部署到 GitHub Pages

**访问地址：** https://liuyuanquan.github.io/portfolio-3d/

### 部署步骤

1. 前往 GitHub 仓库设置：https://github.com/liuyuanquan/portfolio-3d/settings/pages
2. 在 Source 中选择 **GitHub Actions**
3. 保存设置后，每次推送到 `main` 分支都会自动部署

### 手动部署

如果需要手动部署：

```bash
npm run build
# 然后将 dist 目录的内容部署到你的静态托管服务
```

## 相关链接

- [在线演示](https://liuyuanquan.github.io/portfolio-3d/)
- [GitHub 仓库](https://github.com/liuyuanquan/portfolio-3d)
- [Three.js 官方文档](https://threejs.org/)
- [Ammo.js GitHub](https://github.com/kripken/ammo.js)
- [Vite 官方文档](https://vitejs.dev/)
