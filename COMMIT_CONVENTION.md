# Commit Message Convention

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，以确保提交信息清晰、一致且易于理解。

**注意：本项目使用中文提交信息，type 使用英文，subject 和 body 使用中文。**

## 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型 (Type)

提交类型必须是以下之一：

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档变更
- **style**: 代码格式变更（不影响代码运行的变动，如格式化、分号等）
- **refactor**: 代码重构（既不是新增功能，也不是修复 bug）
- **perf**: 性能优化
- **test**: 添加或修改测试
- **build**: 构建系统或外部依赖的变更（如 webpack、npm 等）
- **ci**: CI 配置文件和脚本的变更
- **chore**: 其他变更（不涉及 src 或 test 的修改）
- **revert**: 回滚之前的提交

### 作用域 (Scope)

可选，表示提交影响的范围。例如：

- `config`: 配置文件
- `deps`: 依赖更新
- `assets`: 资源文件
- `ui`: 用户界面
- `physics`: 物理引擎相关
- `shader`: 着色器相关
- `build`: 构建相关

### 主题 (Subject)

- **使用中文描述**
- 使用祈使句，现在时态（如 "添加" 而不是 "添加了" 或 "添加中"）
- 结尾不加句号
- 不超过 72 个字符

### 正文 (Body)

可选，用于详细描述：

- **使用中文描述**
- 使用祈使句，现在时态
- 说明代码变更的动机，以及与之前行为的对比

### 页脚 (Footer)

可选，用于：

- **Breaking Changes**: 以 `BREAKING CHANGE:` 开头，描述不兼容的变更
- **Issue References**: 引用相关 issue，如 `Closes #123`

## 示例

### 简单提交

```
feat: 添加移动设备摇杆控制
```

```
fix: 修复物理碰撞检测问题
```

```
docs: 更新 README 中的 Vite 迁移说明
```

### 带作用域的提交

```
feat(physics): 添加重力调整控制
```

```
fix(shader): 修正片段着色器光照计算
```

```
refactor(build): 从 Webpack 迁移到 Vite
```

### 带正文的提交

```
feat(ui): 添加加载屏幕动画

实现平滑的淡入动画效果，提升资源加载时的用户体验。

Closes #42
```

### 带破坏性变更的提交

```
feat(api): 更改 Ammo.js 导入方式

BREAKING CHANGE: Ammo.js 现在通过全局 script 标签导入，
而不是 ES 模块导入。请相应更新你的代码。
```

### 多行提交

```
fix(physics): 修复球体穿过地板的问题

碰撞检测未正确初始化地面平面，导致球体在某些情况下
会穿过地板。

- 添加适当的碰撞边距
- 在创建对象前初始化物理世界
- 添加碰撞事件的调试日志
```

## 提交信息检查

建议使用以下工具来确保提交信息符合规范：

- [commitlint](https://commitlint.js.org/) - 自动检查提交信息
- [husky](https://typicode.github.io/husky/) - Git hooks 管理

## 最佳实践

1. **提交频率**: 小而频繁的提交比大而少的提交更好
2. **单一职责**: 每个提交应该只做一件事
3. **描述清晰**: 提交信息应该清楚地说明做了什么和为什么这样做
4. **使用中文**: 本项目使用中文提交信息，type 使用英文，subject 和 body 使用中文
5. **引用 Issue**: 如果提交解决了某个 issue，在页脚中引用它

## 参考

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Commitizen](http://commitizen.github.io/cz-cli/)
