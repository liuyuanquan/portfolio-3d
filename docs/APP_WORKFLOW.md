# 应用工作流程文档

本文档详细说明了 `src/app.js` 的完整工作流程，包括初始化、资源加载、场景创建、事件处理和游戏循环等各个阶段。

## 目录

- [概述](#概述)
- [初始化流程](#初始化流程)
- [资源加载流程](#资源加载流程)
- [场景创建流程](#场景创建流程)
- [事件处理流程](#事件处理流程)
- [游戏循环流程](#游戏循环流程)
- [模块依赖关系](#模块依赖关系)
- [关键函数说明](#关键函数说明)

## 概述

`app.js` 是整个应用的入口文件，负责协调各个模块的工作。应用使用 Ammo.js 物理引擎和 Three.js 3D 渲染库，创建一个交互式的 3D 作品集网站。

### 核心特性

- **物理引擎**：使用 Ammo.js 实现真实的物理模拟
- **3D 渲染**：使用 Three.js 渲染 3D 场景
- **交互控制**：支持键盘和触摸屏控制
- **资源管理**：统一管理纹理、模型等资源
- **游戏循环**：使用 `GameLoop` 类管理更新和渲染循环

## 初始化流程

### 1. 模块导入

应用首先导入所有必要的模块：

```javascript
// 核心库
import * as THREE from "three";
import { WEBGL } from "three/examples/jsm/WebGL.js";

// 配置模块
import { ... } from "./config/resources";      // 资源路径配置
import { ... } from "./config";                // 游戏配置

// 资源管理模块
import { ... } from "./resources/world";        // 场景、相机、渲染器
import { ... } from "./resources/surfaces";     // 表面和文本创建
import { ... } from "./resources/cameraUtils";  // 相机控制工具
import { ... } from "./resources/eventHandlers"; // 事件处理
import { ... } from "./resources/preload";      // 预加载管理

// 核心模块
import { PhysicsEngine } from "./core/PhysicsEngine";
import { GameLoop } from "./core/GameLoop";

// 对象创建模块
import { ... } from "./objects";                // 3D 对象创建函数
```

### 2. WebGL 可用性检查

在开始之前，应用检查浏览器是否支持 WebGL：

```javascript
if (WEBGL.isWebGLAvailable()) {
	start();
} else {
	alert("Your browser does not support WebGL...");
	location.href = "https://github.com/liuyuanquan/portfolio-3d";
}
```

### 3. Ammo.js 初始化

应用通过全局 `Ammo()` 函数初始化物理引擎：

```javascript
Ammo().then((Ammo) => {
	// 所有应用逻辑都在这个回调中执行
	// Ammo 是物理引擎的命名空间对象
});
```

## 资源加载流程

### 1. LoadingManager 配置

使用 Three.js 的 `LoadingManager` 跟踪资源加载进度：

```javascript
manager.onStart = function (item, loaded, total) {
	// 资源开始加载时触发
};

manager.onLoad = function () {
	// 所有资源加载完成时触发
	// 隐藏预加载界面，显示开始按钮
	// 自动点击开始按钮（延迟 0ms）
};

manager.onError = function (url) {
	// 资源加载错误时触发
};
```

### 2. 预加载界面管理

- **preloadDivs**：显示加载动画和 "Loading..." 文本
- **postloadDivs**：显示开始按钮和标题文本
- **fadeOutDivs**：用于淡出动画的元素

### 3. 开始按钮事件

用户点击开始按钮后：

1. 淡出预加载界面（添加 `fade-out` class）
2. 750ms 后隐藏预加载遮罩层
3. 注册点击事件监听器（`launchClickPosition`）
4. 创建海滩球对象
5. 1 秒后注册鼠标移动事件监听器（`launchHover`）

## 场景创建流程

### 1. 创建世界场景

调用 `createWorld()` 函数：

- 创建 Three.js 场景（`scene`）
- 创建透视相机（`camera`）
- 创建 WebGL 渲染器（`renderer`）
- 配置光照系统（半球光、方向光）
- 创建性能统计对象（`stats`）

### 2. 创建物理世界

调用 `createPhysicsWorld()` 函数：

- 使用 `PhysicsEngine` 创建物理世界
- 设置重力参数（从 `PHYSICS_CONFIG` 读取）

### 3. 创建 3D 对象

按顺序创建各种 3D 对象：

#### 基础对象

- **网格平面**：`createGridPlane()` - 地面
- **球体**：`createBallObj()` - 玩家控制的球
- **墙壁**：`createWallX()` / `createWallZ()` - 场景边界

#### 交互对象

- **广告牌**：`createBillboard()` / `createBillboardRotated()` - 项目展示
- **盒子**：`createBox()` - 社交链接（GitHub、Twitter、Email、Writing）
- **文字**：`floydWords()` - 3D 文字对象

#### 视觉效果

- **文本平面**：`createTextOnPlane()` - 项目说明文本
- **浮动标签**：`floatingLabel()` - 标签文本
- **技能区域**：`allSkillsSection()` - 技能展示区域
- **镜头光晕**：`createLensFlare()` - 光晕效果
- **粒子系统**：`addParticles()` - 背景粒子
- **发光粒子**：`glowingParticles()` - 前景发光粒子
- **星系**：`generateGalaxy()` - 星系效果
- **砖墙**：`wallOfBricks()` - 装饰性砖墙
- **三角形**：`createTriangle()` - 装饰性三角形

### 4. 注册交互对象

将所有可点击的对象添加到 `cursorHoverObjects` 数组：

```javascript
cursorHoverObjects.push(billboard1.sign);
cursorHoverObjects.push(githubBox);
// ...
```

## 事件处理流程

### 1. 键盘事件

通过 `setupEventHandlers()` 注册键盘事件：

- **W / 上箭头**：前进
- **S / 下箭头**：后退
- **A / 左箭头**：左移
- **D / 右箭头**：右移

事件处理更新 `moveDirection` 对象的状态。

### 2. 触摸设备支持

如果检测到触摸设备：

- 显示虚拟摇杆（`createJoystick()`）
- 更新提示文本
- 摇杆控制更新 `moveDirection` 对象

### 3. 鼠标交互

- **点击事件**（`launchClickPosition`）：

  - 使用光线投射检测点击的对象
  - 如果对象有 `userData.URL`，在新窗口打开链接

- **悬停事件**（`launchHover`）：
  - 使用光线投射检测鼠标悬停
  - 更新鼠标样式（pointer / default）

## 游戏循环流程

### 1. GameLoop 初始化

创建 `GameLoop` 实例：

```javascript
gameLoop = new GameLoop({
	onUpdate, // 更新函数
	onRender, // 渲染函数
	stats, // 性能统计
	clock, // 主时钟
	galaxyClock, // 星系时钟
	galaxyMaterial, // 星系材质
});
```

### 2. 更新循环（onUpdate）

每帧调用，执行以下操作：

#### 球体移动控制

```javascript
if (!isTouchscreenDevice()) {
	if (document.hasFocus()) {
		moveBall(); // 键盘控制
	} else {
		// 窗口失去焦点时重置移动方向
	}
} else {
	moveBall(); // 触摸控制
}
```

#### 物理引擎更新

```javascript
updatePhysics(deltaTime);
```

包括：

- 更新物理世界（`physicsEngine.update()`）
- 检查球体是否掉落（低于阈值时重新创建）
- 更新相机位置（`rotateCamera()`）

#### 粒子系统更新

```javascript
moveParticles();
```

包括：

- 旋转背景粒子系统
- 移动镜头光晕
- 更新发光粒子动画

### 3. 渲染循环（onRender）

每帧调用，渲染场景：

```javascript
renderer.render(scene, camera);
```

### 4. 游戏循环启动

```javascript
gameLoop.start();
```

开始执行更新和渲染循环。

## 模块依赖关系

```
app.js
├── config/
│   ├── resources.ts      # 资源路径配置
│   ├── camera.ts         # 相机配置
│   └── index.ts          # 统一导出
├── core/
│   ├── PhysicsEngine.ts  # 物理引擎管理
│   └── GameLoop.ts       # 游戏循环管理
├── resources/
│   ├── world.ts          # 场景、相机、渲染器
│   ├── surfaces.ts       # 表面和文本创建
│   ├── cameraUtils.ts    # 相机控制工具
│   ├── eventHandlers.ts  # 事件处理
│   └── preload.ts        # 预加载管理
└── objects/
    ├── Balls.js          # 球体对象
    ├── Boxes.js          # 盒子对象
    ├── Billboards.js     # 广告牌对象
    ├── Walls.js          # 墙壁对象
    └── ...               # 其他对象
```

## 关键函数说明

### moveBall()

控制球体的移动：

1. 获取移动方向（从 `moveDirection` 读取）
2. 根据球体是否在地面上决定 Y 轴移动
3. 创建物理冲量向量
4. 应用冲量到球体的物理刚体

### updatePhysics(deltaTime)

更新物理引擎逻辑：

1. 调用 `physicsEngine.update()` 更新物理世界
2. 检查球体是否掉落（低于 `ballFallThreshold`）
3. 如果掉落，移除旧球体并创建新球体
4. 更新相机位置（跟随球体）

### rotateCamera(ballObject)

根据球体位置调整相机：

1. 检测球体所在的区域（使用 `AREA_BOUNDS` 配置）
2. 根据区域计算目标相机位置
3. 使用线性插值（lerp）平滑移动相机
4. 相机始终看向球体位置

### start()

初始化并启动应用：

1. 创建世界场景
2. 创建物理世界
3. 创建所有 3D 对象
4. 注册事件处理器
5. 创建并启动游戏循环

## 执行时序图

```
应用启动
    │
    ├─→ WebGL 检查
    │   ├─→ 不支持 → 显示错误并跳转
    │   └─→ 支持 → 继续
    │
    ├─→ Ammo.js 初始化
    │   └─→ 创建 PhysicsEngine 实例
    │
    ├─→ 资源加载（LoadingManager）
    │   ├─→ onStart: 显示加载动画
    │   ├─→ onLoad: 隐藏加载界面，显示开始按钮
    │   └─→ 自动点击开始按钮
    │
    ├─→ 开始按钮点击
    │   ├─→ 淡出预加载界面
    │   ├─→ 注册点击事件
    │   └─→ 创建海滩球
    │
    ├─→ start() 函数执行
    │   ├─→ createWorld() - 创建场景
    │   ├─→ createPhysicsWorld() - 创建物理世界
    │   ├─→ 创建所有 3D 对象
    │   ├─→ setupEventHandlers() - 注册事件
    │   └─→ gameLoop.start() - 启动游戏循环
    │
    └─→ 游戏循环运行
        ├─→ onUpdate() - 每帧更新
        │   ├─→ moveBall() - 更新球体移动
        │   ├─→ updatePhysics() - 更新物理引擎
        │   └─→ moveParticles() - 更新粒子
        │
        └─→ onRender() - 每帧渲染
            └─→ renderer.render() - 渲染场景
```

## 配置说明

应用使用多个配置文件来管理参数：

- **PHYSICS_CONFIG**：物理引擎配置（重力等）
- **SCENE_CONFIG**：场景配置（背景色、光照等）
- **OBJECTS_CONFIG**：对象默认配置（大小、材质等）
- **GAMEPLAY_CONFIG**：游戏玩法配置（移动速度、阈值等）
- **POSITIONS_CONFIG**：对象位置配置
- **CAMERA_CONFIG**：相机配置（区域偏移、插值速度等）
- **resources.ts**：资源路径配置

## 注意事项

1. **异步加载**：Ammo.js 是异步加载的，所有逻辑都在 `Ammo().then()` 回调中执行

2. **资源加载**：使用 `LoadingManager` 跟踪资源加载，确保所有资源加载完成后再显示开始按钮

3. **焦点管理**：桌面端在窗口失去焦点时会停止球体移动，避免后台运行

4. **性能优化**：使用 `GameLoop` 统一管理更新和渲染，避免重复渲染

5. **内存管理**：球体掉落时会正确移除旧的物理刚体和 3D 对象，避免内存泄漏

## 扩展建议

1. **错误处理**：添加更完善的错误处理和日志记录
2. **性能监控**：使用 `stats` 对象监控性能，必要时优化渲染
3. **配置热更新**：考虑支持运行时修改配置
4. **状态管理**：对于更复杂的应用，可以考虑引入状态管理库
5. **代码分割**：对于大型应用，可以考虑使用动态导入进行代码分割
