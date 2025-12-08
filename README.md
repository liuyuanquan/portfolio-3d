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
- **面向对象架构**：采用 TypeScript 和类封装，通过依赖注入实现模块化设计
- **统一资源管理**：集中管理纹理、字体和物理引擎资源，支持缓存和同步访问

## 技术栈

- **Three.js** - 3D 图形渲染库
- **Ammo.js** - 物理引擎（Bullet Physics 的 JavaScript 移植版）
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 快速的前端构建工具和开发服务器
- **nipplejs** - 虚拟摇杆库（移动端控制）
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

**局域网访问**：开发服务器已配置为允许局域网访问。启动后，你可以在同一局域网内的手机或其他设备上通过电脑的 IP 地址访问，例如 `http://192.168.1.100:5173`。启动时会显示 Network 地址。

**移动端调试**：开发环境会自动加载 vconsole，方便在移动设备上查看控制台日志。

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

### 其他命令

**计算资源大小**：
```bash
npm run calculate-resources
```
自动提取源代码中使用的字符，并计算所有资源文件的实际大小。

**调整纹理尺寸**：
```bash
npm run resize-textures
```
批量调整纹理图片尺寸为 2 的幂次方，避免 Three.js 自动调整导致的性能问题。

## 项目结构

```
portfolio-3d/
├── public/              # 静态资源
│   ├── ammo/            # Ammo.js 物理引擎文件
│   ├── css/             # 样式文件
│   ├── img/             # 图片资源
│   └── json/            # JSON 文件（字体等）
├── src/                 # 源代码
│   ├── config/          # 配置管理模块（TypeScript）
│   │   └── index.ts     # 统一配置管理（按功能模块分类）
│   ├── core/            # 核心模块（TypeScript）
│   │   ├── World.ts              # Three.js 核心对象管理（场景、相机、渲染器）
│   │   ├── CameraControl.ts      # 相机控制和交互
│   │   ├── PhysicsEngine.ts      # 物理引擎管理类
│   │   ├── InteractionManager.ts # 输入和交互管理（键盘、摇杆、鼠标、触摸）
│   │   ├── ResourceManager.ts    # 资源加载管理（纹理、字体、Ammo.js）
│   │   ├── GameLoop.ts           # 游戏主循环管理类
│   │   └── index.ts              # 统一导出
│   ├── objects/         # 对象创建模块（TypeScript）
│   │   ├── Ball.ts              # 玩家球体
│   │   ├── BeachBall.ts         # 沙滩球
│   │   ├── GridPlane.ts         # 网格平面
│   │   ├── BoundaryWalls.ts     # 边界墙
│   │   ├── BrickWalls.ts        # 砖墙
│   │   ├── LinkBoxes.ts         # 链接盒子（社交链接）
│   │   ├── Billboards.ts        # 广告牌（项目展示）
│   │   ├── SkillsSection.ts      # 技能展示区域（工作经历展示）
│   │   ├── Galaxy.ts             # 星系效果
│   │   ├── Glowing.ts            # 发光粒子
│   │   ├── Background.ts         # 背景粒子
│   │   ├── LensFlare.ts          # 镜头光晕
│   │   ├── Shapes.ts              # 形状工具函数
│   │   └── index.ts              # 统一导出
│   ├── utils/           # 工具函数模块（TypeScript）
│   │   ├── texture.ts   # 纹理工具函数
│   │   ├── math.ts      # 数学工具函数
│   │   ├── device.ts    # 设备检测
│   │   ├── camera.ts    # 相机工具函数
│   │   └── index.ts     # 统一导出
│   ├── shaders/         # GLSL 着色器文件
│   │   ├── vertex.glsl   # 顶点着色器
│   │   └── fragment.glsl # 片段着色器
│   ├── app.ts           # 主应用入口（TypeScript）
│   ├── global.d.ts      # 全局类型声明
│   └── vite-env.d.ts    # Vite 环境类型声明
├── docs/                # 文档目录
│   └── APP_WORKFLOW.md  # 应用工作流程文档
├── index.html           # HTML 入口文件
└── vite.config.ts       # Vite 配置文件
```

## 架构设计

### 核心概念

项目采用面向对象的设计模式，所有组件都通过类封装：

1. **依赖注入**：所有对象类通过构造函数接收 `world` 实例，通过 `world.physicsEngine` 和 `world.interactionManager` 访问依赖
2. **自动注册**：`PhysicsEngine` 和 `InteractionManager` 的构造函数会自动将实例注册到 `world` 实例
3. **统一模式**：所有对象类遵循统一的结构：
   - 构造函数接收 `world` 参数
   - `init()` 方法创建对象（在构造函数中调用）
   - `addWorld()` 方法添加到场景并注册物理属性
   - `update()` 方法更新动画（如果需要）

### 核心模块

- **World**：管理 Three.js 核心对象（场景、渲染器、相机），提供统一的访问接口
- **PhysicsEngine**：管理 Ammo.js 物理世界，处理物理模拟和刚体注册
- **InteractionManager**：处理所有用户输入（键盘、鼠标、触摸、摇杆）和窗口事件
- **ResourceManager**：统一管理资源加载（纹理、字体、Ammo.js），支持缓存和同步访问
- **GameLoop**：管理游戏主循环，分离更新逻辑和渲染逻辑

### 配置管理

所有配置集中在 `src/config/index.ts`，按功能模块分类：

- **核心游戏对象配置**：BALL_CONFIG、BEACH_BALL_CONFIG
- **场景环境配置**：GRID_PLANE_CONFIG、BOUNDARY_WALLS_CONFIG、BRICK_WALLS_CONFIG、AREA_BOUNDS
- **用户交互配置**：INPUT_CONFIG、LINK_BOXES_CONFIG
- **视觉效果配置**：BILLBOARDS_CONFIG、LENS_FLARE_CONFIG、GALAXY_CONFIG、PARTICLES_CONFIG
- **相机配置**：CAMERA_CONFIG
- **资源管理配置**：RESOURCE_CONFIG、DEFAULT_TEXTURE_OPTIONS

## 文档

- [应用工作流程文档](./docs/APP_WORKFLOW.md) - 详细说明应用的工作流程和架构设计

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
