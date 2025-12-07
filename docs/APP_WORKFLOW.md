# 应用工作流程文档

本文档详细说明了 `src/app.ts` 的完整工作流程，包括初始化、资源加载、场景创建、事件处理和游戏循环等各个阶段。

## 目录

- [概述](#概述)
- [初始化流程](#初始化流程)
- [资源加载流程](#资源加载流程)
- [场景创建流程](#场景创建流程)
- [事件处理流程](#事件处理流程)
- [游戏循环流程](#游戏循环流程)
- [模块依赖关系](#模块依赖关系)
- [关键类和方法说明](#关键类和方法说明)

## 概述

`app.ts` 是整个应用的入口文件，负责协调各个模块的工作。应用使用 Ammo.js 物理引擎和 Three.js 3D 渲染库，创建一个交互式的 3D 作品集网站。

### 核心特性

- **物理引擎**：使用 Ammo.js 实现真实的物理模拟
- **3D 渲染**：使用 Three.js 渲染 3D 场景
- **交互控制**：支持键盘和触摸屏控制
- **资源管理**：统一管理纹理、字体和 Ammo.js 资源
- **游戏循环**：使用 `GameLoop` 类管理更新和渲染循环
- **面向对象架构**：所有组件都采用类封装，通过依赖注入实现模块化

## 初始化流程

### 1. 模块导入

应用首先导入所有必要的模块：

```typescript
// 核心库
import { WEBGL } from "three/examples/jsm/WebGL.js";

// 核心模块（统一导出）
import { World, GameLoop, PhysicsEngine, InteractionManager, resourceManager } from "./core";

// 对象模块（统一导出）
import {
	GridPlane,
	Ball,
	BeachBall,
	Galaxy,
	Glowing,
	Background,
	LensFlare,
	SkillsSection,
	LinkBoxes,
	ProjectsSection,
	Billboards,
	BrickWalls,
	BoundaryWalls,
} from "./objects";
```

### 2. WebGL 可用性检查

在开始之前，应用检查浏览器是否支持 WebGL：

```typescript
if (!WEBGL.isWebGLAvailable()) {
	alert("Your browser does not support WebGL. Please update your browser to the latest version.");
	location.href = "https://github.com/liuyuanquan/portfolio-3d";
	return;
}
```

### 3. 资源加载

使用 `ResourceManager` 实例加载所有资源：

```typescript
await resourceManager.loadAll();
```

这会并行加载：

- 字体文件（Roboto_Regular.json）
- 预加载的纹理资源
- Ammo.js 物理引擎库

### 4. 预加载界面处理

资源加载完成后，隐藏预加载元素：

```typescript
document.querySelectorAll(".preload, .fadeOutDiv").forEach((element) => {
	const el = element as HTMLElement;
	if (el.classList.contains("preload")) {
		el.style.display = "none";
	} else if (el.classList.contains("fadeOutDiv")) {
		el.classList.add("fade-out");
	}
});
```

## 场景创建流程

### 1. 创建 World 实例

`World` 类负责管理 Three.js 的核心对象：

```typescript
const world = new World();
```

`World` 构造函数会：

- 创建 Three.js 场景（`scene`）
- 创建 WebGL 渲染器（`renderer`）
- 创建 `CameraControl` 实例（包含透视相机）
- 配置光照系统（半球光、方向光）
- 设置阴影和渲染参数

### 2. 创建 InteractionManager 实例

`InteractionManager` 负责处理所有用户输入：

```typescript
const interactionManager = new InteractionManager(world);
interactionManager.init();
```

构造函数会自动将实例注册到 `world.interactionManager`。

`init()` 方法会：

- 注册键盘事件监听器（WASD、方向键）
- 初始化虚拟摇杆（触摸设备）
- 设置鼠标/触摸事件监听器
- 设置窗口大小变化监听器

### 3. 创建 PhysicsEngine 实例

`PhysicsEngine` 负责管理物理世界：

```typescript
const physicsEngine = new PhysicsEngine(world);
physicsEngine.init();
```

构造函数会自动将实例注册到 `world.physicsEngine`，并从 `ResourceManager` 获取 Ammo.js 实例。

`init()` 方法会：

- 创建碰撞配置
- 创建碰撞调度器
- 创建物理世界
- 设置重力参数

### 4. 创建 3D 对象

所有对象类都采用统一的模式：

- 构造函数接收 `world` 参数
- 在构造函数中调用 `init()` 创建对象
- 通过 `addWorld()` 方法添加到场景并注册物理属性

#### 基础对象

- **GridPlane**：网格平面和地面
- **Ball**：玩家控制的球体
- **BeachBall**：装饰性沙滩球
- **BoundaryWalls**：场景边界墙

#### 交互对象

- **LinkBoxes**：社交链接盒子（GitHub、掘金、QQ 邮箱）
- **Billboards**：项目展示广告牌
- **ProjectsSection**：项目展示区域（3D 文字）

#### 视觉效果

- **Galaxy**：背景星系粒子效果
- **Glowing**：前景发光粒子
- **Background**：背景粒子系统
- **LensFlare**：镜头光晕效果
- **SkillsSection**：技能展示区域
- **BrickWalls**：装饰性砖墙

所有对象通过 `world.physicsEngine` 和 `world.interactionManager` 访问物理引擎和交互管理器。

## 事件处理流程

### 1. 键盘事件

`InteractionManager` 处理键盘输入：

- **W / 上箭头**：前进
- **S / 下箭头**：后退
- **A / 左箭头**：左移
- **D / 右箭头**：右移

事件处理更新 `interactionManager.moveDirection` 对象的状态。

### 2. 触摸设备支持

如果检测到触摸设备：

- 自动显示虚拟摇杆（通过 CSS 媒体查询）
- 摇杆控制更新 `interactionManager.moveDirection` 对象
- 窗口失去焦点时自动重置移动方向

### 3. 鼠标/触摸交互

`InteractionManager` 设置事件监听器，调用 `CameraControl` 的方法：

- **点击事件**（`launchClickPosition`）：

  - 使用光线投射检测点击的对象
  - 如果对象有 `userData.URL`，在新窗口打开链接

- **悬停事件**（`launchHover`）：
  - 使用光线投射检测鼠标悬停
  - 更新鼠标样式（pointer / default）

### 4. 窗口大小变化

`InteractionManager` 处理窗口大小变化：

- 更新相机宽高比
- 更新投影矩阵
- 更新渲染器尺寸

## 游戏循环流程

### 1. GameLoop 初始化

创建 `GameLoop` 实例：

```typescript
const gameLoop = new GameLoop({
	onUpdate: (deltaTime: number, clock: THREE.Clock) => {
		// 更新逻辑
	},
	onRender: () => {
		// 渲染逻辑
	},
});
```

### 2. 更新循环（onUpdate）

每帧调用，执行以下操作：

#### 球体移动控制

```typescript
ball.update();
```

`Ball.update()` 方法：

- 从 `world.interactionManager.moveDirection` 读取移动方向
- 根据球体是否在地面上决定 Y 轴移动
- 创建物理冲量向量
- 应用冲量到球体的物理刚体

#### 物理引擎更新

```typescript
physicsEngine.update(deltaTime);
```

包括：

- 更新物理世界（`stepSimulation`）
- 同步物理计算结果到 Three.js 对象的位置和旋转

#### 动画更新

```typescript
galaxy.update(clock);
glowing.update(clock);
background.update();
lensFlare.update();
```

更新各种粒子系统和视觉效果。

#### 相机跟随

```typescript
world.cameraControl.rotateCamera(ball.ballObject);
```

根据球体位置调整相机：

- 检测球体所在的区域（使用 `AREA_BOUNDS` 配置）
- 根据区域计算目标相机位置
- 使用线性插值（lerp）平滑移动相机
- 相机始终看向球体位置

### 3. 渲染循环（onRender）

每帧调用，渲染场景：

```typescript
world.render();
```

`World.render()` 方法内部调用：

```typescript
this.renderer.render(this.scene, this.cameraControl.camera);
```

### 4. 游戏循环启动

```typescript
gameLoop.start();
```

开始执行更新和渲染循环。

## 模块依赖关系

```
app.ts
├── core/
│   ├── World.ts              # 场景、渲染器、相机管理
│   │   └── CameraControl.ts  # 相机控制和交互
│   ├── PhysicsEngine.ts      # 物理引擎管理
│   ├── InteractionManager.ts # 输入和交互管理
│   ├── ResourceManager.ts    # 资源加载管理
│   └── GameLoop.ts          # 游戏循环管理
├── objects/
│   ├── Ball.ts              # 玩家球体
│   ├── BeachBall.ts         # 沙滩球
│   ├── GridPlane.ts         # 网格平面
│   ├── BoundaryWalls.ts     # 边界墙
│   ├── LinkBoxes.ts         # 链接盒子
│   ├── Billboards.ts        # 广告牌
│   ├── ProjectsSection.ts   # 项目展示区域
│   ├── SkillsSection.ts     # 技能展示区域
│   ├── BrickWalls.ts        # 砖墙
│   ├── Galaxy.ts            # 星系效果
│   ├── Glowing.ts           # 发光粒子
│   ├── Background.ts        # 背景粒子
│   └── LensFlare.ts         # 镜头光晕
├── config/
│   └── index.ts             # 统一配置管理
├── utils/
│   ├── texture.ts           # 纹理工具函数
│   ├── math.ts              # 数学工具函数
│   ├── device.ts            # 设备检测
│   └── camera.ts            # 相机工具函数
└── global.d.ts              # 全局类型定义
```

## 关键类和方法说明

### World 类

管理 Three.js 核心对象：

- **属性**：

  - `scene: THREE.Scene` - Three.js 场景
  - `renderer: THREE.WebGLRenderer` - WebGL 渲染器
  - `cameraControl: CameraControl` - 相机控制实例
  - `physicsEngine: PhysicsEngine` - 物理引擎实例（自动注册）
  - `interactionManager: InteractionManager` - 交互管理器实例（自动注册）
  - `cursorHoverObjects: THREE.Object3D[]` - 可交互对象数组

- **方法**：
  - `render()` - 渲染场景

### InteractionManager 类

处理所有用户输入：

- **属性**：

  - `moveDirection: MoveDirection` - 当前移动方向状态

- **方法**：
  - `init()` - 初始化所有事件监听器
  - `setupKeyboardListeners()` - 设置键盘事件
  - `setupJoystick()` - 初始化虚拟摇杆
  - `setupEventListeners()` - 设置鼠标/触摸/窗口事件

### PhysicsEngine 类

管理物理世界：

- **方法**：
  - `init()` - 初始化物理世界
  - `update(deltaTime)` - 更新物理模拟
  - `addRigidPhysics()` - 添加刚体物理
  - `getAmmo()` - 获取 Ammo.js 实例

### ResourceManager 类

统一管理资源加载：

- **方法**：
  - `loadAll()` - 加载所有资源（字体、纹理、Ammo.js）
  - `loadTexture()` - 加载纹理（带缓存）
  - `getFont()` - 获取已加载的字体
  - `getAmmo()` - 获取已加载的 Ammo.js

### Ball 类

玩家控制的球体：

- **属性**：

  - `ballObject: THREE.Mesh` - 球体网格对象

- **方法**：
  - `addWorld()` - 添加到场景并注册物理属性
  - `update()` - 更新球体移动（根据输入方向）

### CameraControl 类

相机控制和交互：

- **属性**：

  - `camera: THREE.PerspectiveCamera` - 透视相机
  - `pickPosition: { x: number; y: number }` - 点击位置

- **方法**：
  - `rotateCamera()` - 相机跟随球体
  - `launchClickPosition()` - 处理点击交互
  - `launchHover()` - 处理鼠标悬停

## 执行时序图

```
应用启动
    │
    ├─→ WebGL 检查
    │   ├─→ 不支持 → 显示错误并跳转
    │   └─→ 支持 → 继续
    │
    ├─→ 资源加载（ResourceManager.loadAll）
    │   ├─→ 加载字体
    │   ├─→ 加载纹理
    │   └─→ 加载 Ammo.js
    │
    ├─→ 隐藏预加载界面
    │
    ├─→ 创建 World 实例
    │   ├─→ 创建场景
    │   ├─→ 创建渲染器
    │   └─→ 创建 CameraControl（包含相机）
    │
    ├─→ 创建 InteractionManager 实例
    │   └─→ 初始化事件监听器
    │
    ├─→ 创建 PhysicsEngine 实例
    │   └─→ 初始化物理世界
    │
    ├─→ 创建所有 3D 对象
    │   ├─→ GridPlane
    │   ├─→ Galaxy
    │   ├─→ Glowing
    │   ├─→ Background
    │   ├─→ LensFlare
    │   ├─→ Ball
    │   ├─→ BeachBall
    │   ├─→ SkillsSection
    │   ├─→ LinkBoxes
    │   ├─→ ProjectsSection
    │   ├─→ Billboards
    │   ├─→ BrickWalls
    │   └─→ BoundaryWalls
    │
    ├─→ 创建 GameLoop 实例
    │
    └─→ 启动游戏循环
        ├─→ onUpdate() - 每帧更新
        │   ├─→ ball.update() - 更新球体移动
        │   ├─→ physicsEngine.update() - 更新物理引擎
        │   ├─→ galaxy.update() - 更新星系动画
        │   ├─→ glowing.update() - 更新发光粒子
        │   ├─→ background.update() - 更新背景粒子
        │   ├─→ lensFlare.update() - 更新光晕
        │   └─→ cameraControl.rotateCamera() - 相机跟随
        │
        └─→ onRender() - 每帧渲染
            └─→ world.render() - 渲染场景
```

## 配置说明

应用使用统一的配置文件 `src/config/index.ts` 管理所有参数，按功能模块分类：

### 核心游戏对象配置

- **BALL_CONFIG**：玩家球体配置（位置、半径、质量、移动参数等）
- **BEACH_BALL_CONFIG**：沙滩球配置

### 场景环境配置

- **GRID_PLANE_CONFIG**：网格平面配置
- **GRID_PLANE_CONFIG_COMPUTED**：计算后的网格平面配置
- **BOUNDARY_WALLS_CONFIG**：边界墙配置
- **BRICK_WALLS_CONFIG**：砖墙配置
- **AREA_BOUNDS**：区域边界定义

### 用户交互配置

- **INPUT_CONFIG**：输入控制配置（虚拟摇杆参数）
- **LINK_BOXES_CONFIG**：链接盒子配置

### 视觉效果配置

- **BILLBOARDS_CONFIG**：广告牌配置
- **LENS_FLARE_CONFIG**：镜头光晕配置
- **GALAXY_CONFIG**：星系配置
- **PARTICLES_CONFIG**：粒子系统配置
- **GAMEPLAY_CONFIG**：游戏玩法配置

### 相机配置

- **CAMERA_CONFIG**：相机配置（视野、位置、区域偏移、插值速度等）

### 资源管理配置

- **RESOURCE_CONFIG**：资源管理器配置（BASE URL、字体路径、预加载纹理列表）
- **DEFAULT_TEXTURE_OPTIONS**：默认纹理选项

## 类型定义

全局类型定义在 `src/global.d.ts` 中：

- **AmmoType**：Ammo.js 类型
- **AmmoPhysicsWorld**：物理世界接口
- **AddRigidPhysicsOptions**：添加刚体物理选项
- **TextureLoadOptions**：纹理加载选项（可选参数）
- **TextureOptions**：纹理选项（完整参数）
- **MoveDirection**：移动方向接口
- **BrickData**：砖块数据接口
- **BillboardItem**：广告牌项接口
- **BillboardConfigItem**：广告牌配置项类型
- **ParticleAttributes**：粒子属性接口
- **GameLoopOptions**：游戏循环配置选项

## 注意事项

1. **依赖注入**：所有对象类通过构造函数接收 `world` 实例，通过 `world.physicsEngine` 和 `world.interactionManager` 访问依赖

2. **自动注册**：`PhysicsEngine` 和 `InteractionManager` 的构造函数会自动将实例注册到 `world` 实例

3. **资源管理**：所有资源通过 `ResourceManager` 实例（`resourceManager`）统一管理，支持缓存和同步访问

4. **统一模式**：所有对象类遵循统一的结构：

   - 构造函数接收 `world` 参数
   - `init()` 方法创建对象（在构造函数中调用）
   - `addWorld()` 方法添加到场景并注册物理属性
   - `update()` 方法更新动画（如果需要）

5. **配置集中管理**：所有配置集中在 `config/index.ts`，按功能模块分类，便于维护

6. **类型安全**：使用 TypeScript 提供完整的类型支持，全局类型定义在 `global.d.ts`

## 扩展建议

1. **错误处理**：添加更完善的错误处理和日志记录
2. **性能监控**：使用性能统计工具监控性能，必要时优化渲染
3. **配置热更新**：考虑支持运行时修改配置
4. **状态管理**：对于更复杂的应用，可以考虑引入状态管理库
5. **代码分割**：对于大型应用，可以考虑使用动态导入进行代码分割
6. **测试**：添加单元测试和集成测试，确保代码质量
