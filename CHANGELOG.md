# 更新日志

本项目的所有重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/spec/v2.0.0.html)。

## [未发布]

## [1.2.13] - 2025-12-05

### 重构

- **统一物理体创建接口**
  - `Planes.ts` 改用 `addRigidPhysics` 函数，统一物理体创建逻辑
  - 扩展 `addRigidPhysics` 函数，支持 `friction` 参数设置摩擦系数
  - 移除 `Planes.ts` 中重复的物理体创建代码，提高代码复用性

### 修复

- 修复 `CHANGELOG.md` 中版本日期错误（2025-01-04 → 2025-12-04）

### 变更

- `package.json` 版本号更新至 `1.2.13`
- `src/objects/Planes.ts` 移除重复的物理体创建代码，改用 `addRigidPhysics`
- `src/objects/PhysicsHelpers.ts` 扩展 `addRigidPhysics` 支持 `friction` 参数
- `src/global.d.ts` 更新 `AddRigidPhysicsOptions` 接口，添加 `friction` 属性
- `CHANGELOG.md` 修复版本 1.2.9、1.2.10、1.2.11、1.2.12 的日期错误

## [1.2.12] - 2025-12-04

### 重构

- **PhysicsEngine 单例模式**
  - 将 `PhysicsEngine` 改为单例模式，使用 `getInstance()` 方法获取实例
  - 构造函数改为私有，防止外部直接实例化
  - 移除所有函数中的 `physicsEngine` 参数，统一使用单例访问

- **Balls.js 转换为 TypeScript**
  - 将 `src/objects/Balls.js` 迁移到 `src/objects/Balls.ts`
  - 添加完整的类型定义和接口
  - 优化代码结构，移除不必要的边界计算

- **属性访问封装**
  - 将 `PhysicsEngine` 的属性改为私有，通过 getter 方法访问
  - 添加 `getAmmo()`、`getPhysicsWorld()`、`getRigidBodies()`、`getTmpTrans()` 方法
  - 统一代码风格，提高封装性

- **代码注释优化**
  - 统一 `PhysicsEngine.ts` 的注释风格，与 `Planes.ts` 保持一致
  - 简化冗余注释，保持代码简洁明了
  - 添加代码块分隔符，提高可读性

### 变更

- `package.json` 版本号更新至 `1.2.12`
- `src/objects/Balls.js` 文件已删除
- `src/objects/Balls.ts` 文件已创建
- `src/core/PhysicsEngine.ts` 改为单例模式，属性访问改为 getter 方法
- `src/objects/Planes.ts` 移除 `physicsEngine` 参数
- `src/app.ts` 更新为使用 `PhysicsEngine.getInstance()` 获取单例

## [1.2.11] - 2025-12-04

### 重构

- **交互对象管理优化**
  - 将 `cursorHoverObjects` 从 `app.ts` 提取到 `cameraUtils.ts`，统一管理交互对象
  - 删除未使用的 `objectsWithLinks` 数组及其相关代码，简化代码结构
  - 删除独立的 `interactiveObjects.ts` 模块，减少不必要的抽象层

- **代码简化**
  - 将 `onRender` 函数内联为箭头函数，减少不必要的函数封装
  - 优化摇杆初始化逻辑，将代码移到 `start()` 函数内部，确保在游戏初始化完成后执行

### 优化

- **摇杆显示优化**
  - 使用 CSS 媒体查询 `@media (hover: none) and (pointer: coarse)` 自动显示/隐藏摇杆
  - 移除 JavaScript 中的 `visibility` 设置，由 CSS 统一管理显示逻辑
  - 删除无效的 `appDirections` 元素相关代码

### 变更

- `src/app.ts` 删除 `objectsWithLinks` 变量和 `onRender` 函数
- `src/app.ts` 摇杆初始化移到 `start()` 函数内部
- `src/objects/Boxes.js` 删除 `objectsWithLinks` 参数
- `src/resources/cameraUtils.ts` 添加 `cursorHoverObjects` 数组导出
- `src/resources/interactiveObjects.ts` 文件已删除
- `public/css/style.css` 添加触摸设备媒体查询，自动显示摇杆

## [1.2.10] - 2025-12-04

### 重构

- **主应用文件 TypeScript 迁移**
  - 将 `src/app.js` 迁移到 TypeScript（`src/app.ts`）
  - 添加完整的类型定义和接口
  - 优化代码结构，移除未使用的导入
  - 添加详细的函数注释和文档

- **类型声明文件重组**
  - 将 Ammo.js 类型声明从 `vite-env.d.ts` 提取到 `src/global.d.ts`
  - 统一管理全局类型声明，提高代码组织性

### 优化

- **HTML 优化**
  - 将所有 meta 标签内容改为英文，提升国际化支持
  - 优化 meta 标签格式，改为单行展示，提高可读性
  - 删除不必要的 `id="document-body"`，改用 `document.body`
  - 删除 `referrer` meta 标签（使用浏览器默认策略）
  - 将 `lang` 属性从 `zh-CN` 改为 `en`，与内容语言一致

- **代码优化**
  - 修复所有 TypeScript 类型错误
  - 优化 DOM 元素访问方式，使用类型断言提高类型安全
  - 统一代码风格和命名规范

### 变更

- `src/app.js` → `src/app.ts`（主应用文件 TypeScript 迁移）
- `src/ammo.d.ts` → `src/global.d.ts`（类型声明文件重组）
- `index.html` 所有 meta 标签内容改为英文
- `src/resources/cameraUtils.ts` 更新为使用 `document.body` 替代 `getElementById`

## [1.2.9] - 2025-12-04

### 重构

- **资源模块 TypeScript 迁移和代码重组**
  - 将 `src/resources/` 目录下的所有文件从 JavaScript 迁移到 TypeScript
  - `surfaces.js` → `surfaces.ts`，添加完整的类型定义和详细注释
  - `world.js` → `world.ts`，添加完整的类型定义和详细注释
  - `utils.js` → `utils.ts`，添加完整的类型定义和详细注释
  - 提取数学工具函数到 `src/utils/math.ts`，提供 `getRandomArbitrary`、`getRandomInt`、`clamp` 等通用函数

- **项目结构优化**
  - 将 `resources/textures.ts` 移动到 `config/resources.ts`（资源路径配置）
  - 将 `resources/utils.ts` 中的相机配置提取到 `config/camera.ts`
  - 将 `resources/utils.ts` 重命名为 `resources/cameraUtils.ts`（避免与 `utils` 目录名称冲突）
  - 所有配置现在统一在 `config/` 目录管理

### 优化

- 提取魔法数字为配置常量，提高代码可维护性
- 统一代码风格和命名规范
- 改进代码结构和组织方式
- 添加详细的 JSDoc 注释

### 变更

- `src/resources/` 目录现在完全使用 TypeScript
- `src/config/` 目录新增 `resources.ts` 和 `camera.ts` 配置文件
- `src/utils/` 目录新增 `math.ts` 数学工具函数模块
- 所有资源管理模块现在都提供完整的类型支持和详细的文档注释

## [1.2.8] - 2025-12-04

### 重构

- **核心模块 TypeScript 迁移**
  - 将 `src/core/` 目录下的所有文件从 JavaScript 迁移到 TypeScript
  - `PhysicsEngine.js` → `PhysicsEngine.ts`
    - 添加完整的类型定义和接口
    - 为 Ammo.js 添加类型定义（使用 `any` 类型，因为 Ammo.js 是全局 UMD 模块）
    - 添加详细的代码注释，说明物理引擎的工作原理
    - 改进类型安全性，所有方法都有明确的参数和返回值类型
  - `GameLoop.js` → `GameLoop.ts`
    - 添加完整的类型定义和接口
    - 为 Three.js 类型添加类型定义（`THREE.Clock`、`THREE.ShaderMaterial` 等）
    - 添加详细的代码注释，说明游戏循环的工作流程
    - 改进类型安全性，所有方法都有明确的参数和返回值类型
  - 所有核心模块现在都提供完整的类型支持和详细的文档注释

### 变更

- `src/core/` 目录现在完全使用 TypeScript
- 所有类和方法都有完整的类型定义
- 添加了详细的代码注释，提高代码可读性和可维护性
- 改进了类型安全性，减少运行时错误

## [1.2.7] - 2025-12-04

### 重构

- **配置模块 TypeScript 迁移**
  - 将 `src/config/` 目录下的所有文件从 JavaScript 迁移到 TypeScript
  - `gameplay.js` → `gameplay.ts`，使用 `as const` + `typeof` 简化类型定义
  - `objects.js` → `objects.ts`，自动推导类型
  - `physics.js` → `physics.ts`，自动推导类型
  - `positions.js` → `positions.ts`，自动推导类型
  - `scene.js` → `scene.ts`，自动推导类型
  - `index.js` → `index.ts`，统一导出接口和类型
  - 所有配置文件现在都提供完整的类型支持

### 优化

- **用户体验优化**
  - 页面加载完成后自动点击开始按钮，无需手动点击
  - 改进启动流程，提供更流畅的体验

- **代码清理**
  - 删除未使用的 `skip-link` 元素（无障碍访问功能）
  - 删除未使用的 `tooltip` 元素和相关 CSS 样式
  - 清理无用代码，减少 DOM 元素

### 变更

- `src/config/` 目录现在完全使用 TypeScript
- 所有配置常量使用 `as const` 确保类型安全和不可变性
- 通过 `typeof` 自动推导类型，减少重复代码
- `index.html` 移除未使用的元素
- `public/css/style.css` 移除 tooltip 样式

## [1.2.6] - 2025-12-04

### 优化

- **着色器代码格式化**
  - 格式化 `src/shaders/vertex.glsl` 和 `src/shaders/fragment.glsl`
  - 添加详细的代码注释，说明每个部分的功能
  - 统一代码格式和缩进风格
  - 改进代码可读性和可维护性

### 变更

- `vertex.glsl`：添加文件头注释和详细的功能说明
- `fragment.glsl`：添加文件头注释，优化注释掉的代码说明
- 两个着色器文件现在都有清晰的代码结构和注释

## [1.2.5] - 2025-12-04

### 重构

- **工具函数模块 TypeScript 迁移**
  - 将 `src/utils/` 目录下的文件从 JavaScript 迁移到 TypeScript
  - `textureLoader.js` → `textureLoader.ts`，添加完整的类型定义
  - `index.js` → `index.ts`，统一导出接口
  - 添加 `tsconfig.json` 配置文件，支持渐进式 TypeScript 迁移

### 优化

- **使用 Three.js 官方 WebGL 检测工具**
  - 移除自定义的 `isWebGLAvailable` 函数
  - 使用 `three/examples/jsm/WebGL.js` 中的 `WEBGL.isWebGLAvailable()`
  - 删除 `src/utils/webgl.ts`，统一使用 Three.js 官方工具

- **纹理加载函数优化**
  - 提取 `applyTextureOptions` 辅助函数，消除代码重复
  - 改进代码结构，提高可维护性
  - 保持向后兼容，功能不变

### 变更

- `src/app.js` 使用 `WEBGL.isWebGLAvailable()` 替代自定义实现
- `src/utils/index.ts` 移除 `isWebGLAvailable` 导出
- 工具函数现在使用 TypeScript，提供更好的类型安全

## [1.2.4] - 2025-12-04

### 重构

- **工具函数模块化**
  - 创建 `src/utils/webgl.js`，将 WebGL 检测功能从 `src/WebGL.js` 迁移
  - 创建 `src/utils/index.js`，统一导出所有工具函数
  - 删除 `src/WebGL.js`，统一工具函数管理
  - 更新 `src/app.js` 导入路径，使用统一的工具函数导出接口
  - 改进代码组织结构，工具函数集中管理

### 变更

- `isWebGLAvailable` 函数从 `WEBGL.isWebGLAvailable()` 改为直接导入 `isWebGLAvailable`
- 工具函数统一从 `src/utils` 导入，提高代码一致性

## [1.2.3] - 2025-12-04

### 重构

- **第四阶段：主循环优化**
  - 创建 `GameLoop` 类，封装渲染循环逻辑
  - 分离更新逻辑和渲染逻辑（`onUpdate` 和 `onRender`）
  - 统一管理动画更新、物理更新、粒子更新
  - 自动处理 FPS 统计和星系材质时间更新
  - 支持启动/停止控制，便于后续扩展（暂停/恢复、帧率限制等）
  - 改进代码组织结构，职责分离更清晰

### 优化

- 优化 `moveBall` 函数，添加空值检查，提高代码健壮性
- 改进函数注释，提高代码可读性

### 变更

- 将渲染循环从 `renderFrame` 函数重构为 `GameLoop` 类
- 更新逻辑和渲染逻辑分离，便于维护和扩展
- 所有更新逻辑集中在 `onUpdate` 回调中
- 所有渲染逻辑集中在 `onRender` 回调中

## [1.2.2] - 2025-12-04

### 重构

- **第三阶段：配置管理**
  - 创建 `src/config/` 目录，统一管理所有配置常量
  - 创建 `physics.js` - 物理引擎配置（重力、摩擦、质量等）
  - 创建 `scene.js` - 场景配置（相机、光照、渲染器等）
  - 创建 `objects.js` - 对象默认配置（位置、大小、颜色等）
  - 创建 `gameplay.js` - 游戏玩法配置（移动速度、粒子系统等）
  - 创建 `positions.js` - 场景对象位置配置
  - 创建 `index.js` - 统一导出接口
  - 提取所有魔法数字和硬编码值到配置文件
  - 改进代码可维护性，配置与逻辑分离

### 优化

- **纹理加载优化**
  - 创建 `src/utils/textureLoader.js` 统一纹理加载函数
  - 消除 WebGL 纹理大小调整警告
  - 统一纹理参数配置（mipmap、过滤模式等）
  - 优化纹理加载性能

### 修复

- 修复了 ShaderMaterial 警告：移除了不支持的 `size` 和 `sizeAttenuation` 属性
- 修复了重复变量声明错误（`boxConfig`、`billboardConfig`、`beachBallConfig`）
- 修复了纹理加载警告，通过统一配置避免 WebGL 自动调整纹理大小

### 变更

- 所有模块现在从 `src/config` 导入配置常量
- 更新了所有对象创建函数以使用配置中的默认值
- 更新了物理引擎、场景设置、游戏玩法等所有配置项
- 改进了代码组织结构，配置集中管理，便于调整和维护

## [1.2.1] - 2025-12-04

### 重构

- **第二阶段：分离对象创建逻辑**
  - 创建 `src/objects/` 目录，按类型组织对象创建函数
  - 创建 `Balls.js` - 球体对象（主球、沙滩球）
  - 创建 `Boxes.js` - 盒子对象（链接盒子、文字盒子）
  - 创建 `Billboards.js` - 广告牌对象（水平、垂直）
  - 创建 `Walls.js` - 墙壁对象（X 轴、Z 轴、砖墙）
  - 创建 `Planes.js` - 平面对象（网格平面）
  - 创建 `Shapes.js` - 形状对象（三角形等）
  - 创建 `Text.js` - 3D 文字对象（Floyd 文字、工程师文字）
  - 创建 `PhysicsHelpers.js` - 物理辅助函数
  - 创建 `index.js` - 统一导出接口
  - 改进代码组织结构，职责分离更清晰，提高代码可维护性和可扩展性

### 修复

- 修复了 `addRigidPhysics` 函数调用错误（缺少 Ammo 和 physicsEngine 参数）
- 修复了 Three.js 警告：将 `renderer.gammaInput` 和 `renderer.gammaOutput` 替换为 `renderer.outputEncoding`
- 修复了循环依赖问题（`Billboards.js` 和 `Boxes.js` 不再直接导入 `cursorHoverObjects`）
- 修复了所有对象创建函数的调用，确保正确传递参数

### 变更

- 将所有对象创建函数从 `app.js` 提取到 `src/objects/` 目录
- 统一函数签名，所有创建函数接受 `Ammo`、`physicsEngine` 和 `options` 参数
- 更新所有函数调用以使用新的模块化接口
- 添加了完整的 JSDoc 注释，提高代码可读性

## [1.2.0] - 2025-12-03

### 重构

- **第一阶段：分离物理引擎逻辑**
  - 创建 `PhysicsEngine` 类，封装 Ammo.js 物理世界的创建和管理
  - 统一刚体管理接口（`addRigidBody`、`removeRigidBody`）
  - 简化物理更新逻辑，自动同步 Three.js 对象位置和旋转
  - 提供资源清理方法（`dispose`）
  - 改进代码组织结构，职责分离更清晰

### 变更

- 将物理引擎相关代码从 `app.js` 提取到 `src/core/PhysicsEngine.js`
- 移除 `app.js` 中的全局变量（`rigidBodies`、`physicsWorld`、`tmpTrans`）
- 使用类封装替代函数式编程，提高代码可维护性

## [1.1.2] - 2025-12-03

### 修复

- 修复了生产环境资源路径问题，使用 `import.meta.env.BASE_URL` 动态获取 base 路径
- 修复了 README 中的图片路径，使用 GitHub raw URL 确保正确显示
- 修复了 index.html 中 Open Graph 和 Twitter 图片 URL（blob → raw）
- 更新 favicon 为项目 logo（logo.png）

### 变更

- 更新所有图片和 JSON 文件路径，支持 GitHub Pages 子路径部署
- 优化资源路径处理，确保开发和生产环境都能正常工作

## [1.1.1] - 2025-12-03

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
