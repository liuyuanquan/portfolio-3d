# 更新日志

本项目的所有重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/spec/v2.0.0.html)。

## [未发布]

## [1.4.4] - 2025-12-08

### 优化

- **工作经历展示优化**
  - 将工作经历文本细分为多个部分（时间、公司、职位），每个部分占据不同的格子数
  - 时间文本段占据 4.5 个格子，公司文本段占据 2.5 个格子，职位文本段占据 2 个格子
  - 所有文本段左边缘对齐到格子边界，确保视觉一致性
  - 优化文本位置计算逻辑，支持非整数格子数（如 4.5、2.5）

- **文本对齐优化**
  - 修复文本左边缘对齐问题，确保所有文本段的左边缘精确对齐到格子边界
  - 修改文本创建逻辑，不再使用居中对齐，而是左边缘对齐
  - 优化边界框计算，考虑文本旋转后的实际位置

- **布局调整**
  - 将 experiences 区域整体左移，对齐到第 24 个格子边界
  - 调整 label 的 centerX，使其居中显示在 experiences 区域
  - 更新 outline 高度从 0.01 增加到 1，提高可见性

- **内容更新**
  - 更新公司名称："滴滴" → "滴滴出行"，"看看" → "响巢看看"

### 变更

- `package.json` 版本号更新至 `1.4.4`
- `src/config/index.ts` 重构工作经历配置，支持文本分段和格子数配置
- `src/objects/SkillsSection.ts` 优化文本创建和对齐逻辑，支持非整数格子数
- `src/objects/SkillsSection.ts` 修复边界框计算，考虑文本旋转

## [1.4.3] - 2025-12-08

### 修复

- **移动端交互问题**
  - 修复预加载 overlay 遮挡 canvas 导致触摸事件无法传递的问题
  - 添加 `pointer-events: none` 到 `.preload-overlay.fade-out`，确保淡出时不再拦截事件
  - 明确设置 `#WEBGLcontainer` 和 `canvas` 的 `pointer-events: auto` 和 `z-index`，确保可以接收触摸事件
  - 在 JavaScript 中立即禁用 overlay 的 pointer-events，不等待 CSS 动画完成

### 优化

- **CSS 代码优化**
  - 删除未使用的样式规则（约 30 行），包括 `#info`、`#overlay`、`#notSupported`、`#joystick`、`.postload`、`.bottom-webgl-text-div`、`.start-page-text`、`.floyd-text`、`.start-page-content-div`、`#start-button`、`.yellow-text`、`#static-site-link`、`.loader__dot`、`.hidden` 等
  - 合并重复的 CSS 规则：
    - 合并全屏尺寸属性（`body`、`#WEBGLcontainer`、`canvas` 的 `width` 和 `height`）
    - 合并 `pointer-events` 和 `z-index` 属性（`#WEBGLcontainer` 和 `canvas`）
    - 统一 `box-sizing: border-box` 声明
    - 合并加载文本的通用样式（`.loading-text-div` 和 `.loading-resource-name`）
  - 简化动画属性，将 `animation-fill-mode` 合并到 `animation` 简写属性中
  - 添加注释分组，提高代码可读性和可维护性

### 变更

- `package.json` 版本号更新至 `1.4.3`
- `public/css/style.css` 优化，减少约 30 行重复代码
- `src/app.ts` 在 `finishLoading` 函数中立即禁用 overlay 的 pointer-events

## [1.4.2] - 2025-12-08

### 新增

- **移动端开发工具**
  - 开发环境自动加载 vconsole，方便移动端调试
  - 支持查看控制台日志、网络请求和系统信息

- **纹理尺寸优化工具**
  - 添加 `scripts/resize_textures_to_power_of_two.js` 脚本，批量调整纹理图片尺寸为 2 的幂次方
  - 新增 `npm run resize-textures` 命令，自动处理所有纹理图片
  - 开发环境自动检测非 2 的幂次方纹理并输出警告

- **World 类增强**
  - `World` 构造函数支持接收容器选择器参数，提高灵活性
  - Canvas 现在添加到 `WEBGLcontainer` 容器中，符合语义化结构

### 修复

- **移动端摇杆问题**
  - 修复移动端摇杆无法滑动的问题
  - 优化 z-index 层级，确保摇杆在最上层
  - 添加事件捕获阶段监听，确保触摸事件正确传递
  - 优化触摸事件处理，避免与 canvas 点击事件冲突

- **纹理尺寸警告**
  - 修复 Three.js 纹理尺寸调整警告
  - 所有纹理图片已调整为 2 的幂次方尺寸，提升渲染性能

- **TypeScript 类型错误**
  - 修复 `World.ts` 中纹理 URL 获取的类型错误

### 优化

- **移动端体验优化**
  - 摇杆仅在资源加载完成后显示，避免干扰加载过程
  - 优化触摸事件处理，使用 passive 事件监听器提升性能
  - 添加 `finishLoading` 函数统一处理加载完成后的 UI 更新

- **代码结构优化**
  - 重构加载完成处理逻辑，封装为独立函数
  - 优化 CSS 样式，确保摇杆正确显示和交互

### 变更

- `package.json` 版本号更新至 `1.4.2`
- 添加 `sharp` 作为开发依赖，用于图片处理
- `World` 构造函数现在接收可选的容器选择器参数
- `calculate-resources` 命令保持不变

## [1.4.1] - 2025-12-08

### 新增

- **字体子集化功能**
  - 添加 `scripts/extract_used_chars.js` 脚本，自动从源代码中提取实际使用的字符
  - 支持字体子集化，减小字体文件大小
  - `calculate-resources` 命令现在会自动先提取字符，再计算资源大小

### 修复

- **字体字符缺失处理**
  - 修复 `createFloatingLabel` 函数中字体字符缺失导致的崩溃问题
  - 添加字符缺失检测和警告信息
  - 当字体中缺少字符时，自动过滤并继续渲染

### 优化

- **资源管理优化**
  - 优化 `calculate-resources` 命令，自动提取实际使用的字符
  - 更新资源大小配置，使用实际文件大小

### 变更

- `package.json` 版本号更新至 `1.4.1`
- `calculate-resources` 命令现在包含字符提取步骤
- `Shapes.ts` 添加字体字符缺失的错误处理

## [1.4.0] - 2025-01-XX

### 新增

- **资源大小精确计算**
  - 添加 Python 脚本 `scripts/calculate_resource_sizes.py` 自动计算资源文件大小
  - 资源管理器使用实际文件大小替代估算值，提供更准确的加载进度
  - 添加 `resource_sizes.json` 配置文件存储资源大小信息
  - 新增 `npm run calculate-resources` 命令用于更新资源大小

- **加载进度增强**
  - 加载进度显示当前正在加载的资源名称（字体、纹理、Ammo.js）
  - 进度显示基于实际字节数计算，更加准确
  - 优化进度更新逻辑，使用 requestAnimationFrame 确保流畅显示

- **物理效果优化**
  - 添加恢复系数（restitution）支持，实现物体反弹效果
  - 沙滩球支持多次反弹后逐渐停止
  - 调整重力值，优化掉落速度

### 优化

- **ResourceManager 重构**
  - 创建 `ResourceBytesTracker` 类统一管理资源字节跟踪
  - 提取资源加载通用方法，消除代码重复
  - 优化进度更新逻辑，简化 requestAnimationFrame 处理
  - 改进类型安全，使用 `AmmoType` 替代 `any`
  - 移除未使用的 `getAvailableFonts()` 方法

- **代码质量提升**
  - 提取常量（如 Ammo.js 估算大小）
  - 改进错误处理，确保资源加载失败时也能正确完成进度更新
  - 优化代码结构，提高可维护性和可读性

### 变更

- `package.json` 版本号更新至 `1.4.0`
- `ResourceManager.ts` 重构，使用实际资源大小
- `BEACH_BALL_CONFIG` 添加 `restitution` 配置（0.85）
- `GRID_PLANE_CONFIG` 添加 `restitution` 配置（0.7）
- `PhysicsEngine.ts` 添加恢复系数支持
- `index.html` 添加资源名称显示元素
- `style.css` 添加资源名称样式
- 重力值从 -50 调整为 -80

## [1.3.4] - 2025-12-08

### 新增

- **多字体支持**
  - ResourceManager 支持加载多个字体（SourceHanSerifSCVF_Regular、Roboto_Regular、LXGW WenKai_Regular）
  - 提供 `getFont(fontName?)` 方法，支持切换使用不同字体
  - 添加 `getAvailableFonts()` 方法获取所有可用字体列表

- **加载进度显示**
  - 添加基于资源数量的加载进度百分比显示
  - 实时更新加载进度，显示已加载资源数量
  - 在控制台实时打印加载进度和资源数量

- **工作经历区域交互增强**
  - experiences 整体区域支持点击跳转到 PDF
  - 添加 experiences 区域的轮廓线显示（可配置）
  - 优化 experiences 区域盒子的尺寸计算，基于实际文字边界框

### 重构

- **SkillsSection 重构**
  - 将 label 结构改为与 PROJECTS_SECTION_CONFIG 一致的结构
  - 支持显示 name 和 role 两个文本，自动水平居中排列
  - labelBox 和 labelBoxOutline 基于实际文本边界框动态计算
  - 移除 experiencesBox 的物理属性，避免阻挡小球移动

- **配置清理**
  - 删除未使用的 `PROJECTS_SECTION_CONFIG` 配置对象
  - 删除 `PARTICLES_CONFIG.animation` 中未使用的配置项（lensFlare*、particleSystemRotationSpeed）
  - 删除 `SKILLS_SECTION_CONFIG.label.text.*.position.x`（x 位置通过 centerX 动态计算）
  - 将 PDF URL 移到配置文件中统一管理

- **ResourceManager 优化**
  - 移除未使用的 `loadFonts()` 和 `loadTextures()` 方法
  - 优化 `loadAll()` 方法，支持进度回调
  - 统一字体加载逻辑到 `loadAll()` 中

### 变更

- `package.json` 版本号更新至 `1.3.4`
- `RESOURCE_CONFIG` 添加 `fonts` 对象和 `defaultFont` 配置
- `SKILLS_SECTION_CONFIG` 重构，label 使用新的结构
- `SKILLS_SECTION_CONFIG.label` 添加 `url` 配置（PDF 链接）
- `SKILLS_SECTION_CONFIG.experiences` 改为对象结构，包含 `url`、`showOutline`、`outlineColor`、`items`
- `SkillsSection.ts` 重构，支持多文本显示和动态边界框计算
- `index.html` 更新加载文本为百分比显示
- 删除 `ProjectsSection.ts` 文件和相关配置

## [1.3.3] - 2025-12-08

### 新增

- **工作经历展示功能**

  - 将技能展示区域改为工作经历展示区域
  - 添加立体文字标签"工作经历"，支持点击交互
  - 添加多个工作经历文字标签，显示详细的工作经历信息
  - 为工作经历标签添加物理属性，使其可参与碰撞检测

- **区域检测优化**
  - 添加区域 4（工作经历区域）定义和检测逻辑
  - 优化区域检测边界条件，使用包含边界（`>=` 和 `<=`）提高检测灵敏度
  - 扩大工作经历区域范围，确保更好的触发效果

### 重构

- **SkillsSection 重构**
  - 将平面文字标签改为立体文字（使用 TextGeometry）
  - 添加可点击的透明盒子，支持点击交互
  - 重构配置结构，添加立体文字和盒子相关配置

### 变更

- `package.json` 版本号更新至 `1.3.3`
- `SKILLS_SECTION_CONFIG` 重构，添加立体文字和交互配置
- `AREA_BOUNDS` 添加 `area4`（工作经历区域）
- `CAMERA_CONFIG` 添加 `area4` 相机偏移配置
- `utils/camera.ts` 添加 `isInArea4` 函数
- `CameraControl.ts` 添加 area4 的相机跟随逻辑
- `SkillsSection.ts` 重构为立体文字和可点击交互

## [1.3.2] - 2025-12-08

### 文档

- **文档更新**
  - 更新 `README.md`，添加架构设计说明和最新项目结构
  - 更新 `docs/APP_WORKFLOW.md`，反映最新的代码架构和工作流程
  - 添加核心模块说明和配置管理说明
  - 更新项目结构图，移除过时的目录引用

### 变更

- `package.json` 版本号更新至 `1.3.2`
- `README.md` 添加架构设计部分，说明依赖注入、自动注册和统一模式
- `docs/APP_WORKFLOW.md` 全面更新，反映 TypeScript 和面向对象架构

## [1.3.1] - 2025-12-08

### 重构

- **代码架构优化**

  - 将 `ResourceManager` 从静态方法改为实例方法，导出 `resourceManager` 实例
  - 移除单例模式，简化代码结构
  - 所有对象类统一通过 `world` 实例访问 `physicsEngine` 和 `interactionManager`
  - 提取工具函数到 `utils/texture.ts`：`applyTextureOptions`、`createTextureOptions`、`getTexturePath`
  - 提取配置到 `config/index.ts`：`DEFAULT_TEXTURE_OPTIONS`、`BRICK_WALLS_CONFIG`、`KEY_MAP`
  - 提取类型定义到 `global.d.ts`：`TextureOptions`、`TextureLoadOptions`、`BrickData`、`BillboardItem`、`BillboardConfigItem`、`ParticleAttributes`

- **配置管理优化**

  - 重新组织 `config/index.ts`，按功能模块分类（核心游戏对象、场景环境、用户交互、视觉效果、相机、资源管理）
  - 统一配置注释风格，提高可读性
  - 将 `DEFAULT_TEXTURE_OPTIONS` 从 `utils/texture.ts` 移动到 `config/index.ts`

- **代码清理**
  - 移除 `ResourceManager` 中未使用的方法和属性
  - 优化 `InteractionManager` 代码结构，提取事件处理方法
  - 统一代码格式和缩进

### 变更

- `package.json` 版本号更新至 `1.3.1`
- `ResourceManager` 改为实例方法，导出 `resourceManager` 实例
- `World` 类添加 `physicsEngine` 和 `interactionManager` 属性
- `PhysicsEngine` 和 `InteractionManager` 构造函数自动注册到 `World` 实例
- 所有对象类构造函数简化，只需接收 `world` 参数
- `utils/texture.ts` 新增纹理相关工具函数
- `config/index.ts` 重新组织，添加详细分类和注释

## [1.3.0] - 2025-12-06

### 优化

- **代码优化**
  - 优化 `app.ts` 中的 DOM 操作，合并查询并移除冗余样式
  - 优化 `app.ts` 中的导入语句，使用聚合导出简化导入结构
  - 移除 `global.d.ts` 中未使用的 `CreateBoxOptions` 接口
  - 优化 `config/index.ts`，删除未使用的配置常量

### 变更

- `package.json` 版本号更新至 `1.3.0`

## [1.2.17] - 2025-12-06

### 重构

- **核心模块重组**

  - 将 `World.ts` 从 `resources` 目录移动到 `core` 目录，与 `PhysicsEngine.ts` 并列
  - 将 `cameraUtils.ts` 从 `resources` 目录移动到 `core` 目录，重命名为 `CameraControl.ts`
  - 将 `input.ts` 重命名为 `InputManager.ts`，统一核心模块命名规范
  - 所有核心模块现在使用首字母大写的命名规范

- **物理引擎优化**

  - 将 `addRigidPhysics` 函数从 `utils/physics.ts` 移动到 `PhysicsEngine.ts` 作为实例方法
  - 简化 `PhysicsEngine.ts` 注释，只保留关键信息
  - 优化 `addRigidPhysics` 实现，直接使用 `this.Ammo` 和 `this.STATE`

- **相机控制优化**

  - 将 `CAMERA_CONFIG` 内置到 `CameraControl.ts`，移除对外部配置的依赖
  - 简化 `CameraControl.ts` 注释，只保留关键信息
  - 从 `config/index.ts` 中移除 `CAMERA_CONFIG` 和 `CameraConfig` 类型

- **代码优化**
  - 简化多个核心文件的注释，移除冗余说明
  - 优化 `PhysicsEngine.ts` 中的代码，减少不必要的函数调用和对象创建

### 变更

- `package.json` 版本号更新至 `1.2.17`
- `src/resources/World.ts` → `src/core/World.ts`
- `src/resources/cameraUtils.ts` → `src/core/CameraControl.ts`
- `src/core/input.ts` → `src/core/InputManager.ts`
- `src/utils/physics.ts` 删除，`addRigidPhysics` 移至 `PhysicsEngine.ts`
- `src/config/index.ts` 移除 `CAMERA_CONFIG` 和 `CameraConfig` 类型
- 更新所有相关文件的导入路径

## [1.2.16] - 2025-12-06

### 重构

- **项目展示区域优化**

  - 将 `createProjectsSection` 单独抽取到 `ProjectsSection.ts` 文件
  - 将 `loadFloydText` 和 `loadEngineerText` 函数合并为 `loadTexts`，实现并排显示
  - 调整文本位置，使两个文本整体在盒子中水平居中显示
  - 将 `TEXT_CONFIG` 内置到 `ProjectsSection.ts`，移除对 `OBJECTS_CONFIG` 的依赖

- **字体加载器简化**

  - 简化 `fontLoader.ts`，只提供 `onLoad` 回调函数，让用户完全自定义文本创建逻辑
  - 移除所有默认的硬编码逻辑和配置选项
  - 重命名接口为 `FontLoaderOptions`，回调函数名为 `onLoad`

- **配置清理**
  - 从 `OBJECTS_CONFIG` 中移除无用的 `text` 配置（已内置到 `ProjectsSection.ts`）
  - 只保留 `triangle` 配置（`Shapes.js` 仍在使用）

### 变更

- `package.json` 版本号更新至 `1.2.16`
- `src/objects/ProjectsSection.ts` 新增文件，包含项目展示区域相关功能
- `src/objects/Boxes.ts` 提取 `createFloatingLabel` 函数，使用新的 `fontLoader` 接口
- `src/utils/fontLoader.ts` 简化接口，只提供回调函数
- `src/config/objects.ts` 移除 `text` 配置，只保留 `triangle` 配置
- `src/objects/index.js` 更新导出，`createProjectsSection` 从 `ProjectsSection` 导出

## [1.2.15] - 2025-12-06

### 修复

- **广告牌点击交互修复**
  - 修复广告牌点击无法跳转的问题
  - `launchClickPosition` 函数改为使用 `cursorHoverObjects` 而不是 `scene.children` 进行光线投射检测
  - 与 `launchHover` 函数保持一致，只检测可交互对象，避免被其他对象遮挡

### 重构

- **广告牌模块优化**
  - 将 `loadedTexture` 重命名为 `signMaterial`，更准确地反映其作为广告牌面板材质的用途
  - 添加项目截图占位图配置，使用 `PLACEHOLDER_IMAGE` 常量统一管理
  - 创建精美的占位图 `project-placeholder.png`，包含渐变背景、相机图标和装饰元素

### 变更

- `package.json` 版本号更新至 `1.2.15`
- `src/resources/cameraUtils.ts` 修复点击检测逻辑，使用 `cursorHoverObjects` 替代 `scene.children`
- `src/objects/Billboards.ts` 重命名变量，添加占位图配置
- `public/img/project-placeholder.png` 新增项目截图占位图

## [1.2.14] - 2025-12-05

### 重构

- **优化配置管理**

  - 删除 `OBJECTS_CONFIG` 中已迁移的配置项（`plane`、`wall`、`brick`）
  - 配置已分别迁移到 `Planes.ts`、`Walls.ts` 的本地配置常量中
  - `createBoundaryWalls` 从 `Planes.ts` 导入 `PLANE_CONFIG`，避免间接引用

- **代码清理**
  - 删除 `global.d.ts` 中未使用的类型定义（`CreateGridPlaneOptions`、`WallOfBricksOptions`、`CreateBoundaryWallsOptions`）
  - `createWall` 函数改为内部函数，不再导出
  - `createBoundaryWalls` 函数移除返回值，改为 `void` 类型
  - `stoneTexture` 直接内嵌到 `BRICK_WALL_CONFIG` 中，移除外部导入

### 变更

- `package.json` 版本号更新至 `1.2.14`
- `src/config/objects.ts` 删除已迁移的配置项
- `src/global.d.ts` 删除未使用的类型定义，更新注释引用
- `src/objects/Walls.ts` 优化配置管理，移除不必要的导出
- `src/objects/Planes.ts` 导出 `PLANE_CONFIG` 供其他模块使用
- `src/app.ts` 启用 `wallOfBricks()` 函数调用

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

## [1.0.0] - 2025-12-01

### 新增

- **初始版本发布**
  - 使用 Three.js 和 Ammo.js 构建的交互式 3D 作品集网站
  - 展示 GitHub 开源项目、工作经历和 Three.js 3D 效果

- **核心功能**
  - 3D 物理引擎集成，使用 Ammo.js 实现实时物理模拟
  - 玩家控制的球体移动系统，支持键盘和触摸屏控制
  - 物理碰撞检测和交互，包括边界墙、砖墙等场景元素
  - 相机跟随系统，自动跟随玩家球体移动

- **视觉效果**
  - 3D 场景渲染，包括网格地面、广告牌、链接盒子等
  - 粒子系统：星系效果、发光粒子、背景粒子
  - 镜头光晕效果
  - 阴影和光照系统

- **交互功能**
  - 光线投射交互，支持点击和触摸操作
  - 虚拟摇杆（移动端）
  - 键盘控制（桌面端）
  - 区域检测和相机切换

- **技术特性**
  - 桌面和移动端响应式设计
  - FPS 追踪器用于性能监控
  - 资源管理器统一管理纹理、字体和物理引擎资源
  - 面向对象架构，采用 TypeScript 和依赖注入模式
