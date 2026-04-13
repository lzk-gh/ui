# lucky-ui 样式优化 TODO 列表 (开源标准)

这份文档记录了 lucky-ui 为了达到开源级质量仍需进行的样式调整任务。

## 1. 系统性闭环 (Systemic Integrity) 🔴

### 核心任务
- [ ] **消除 fallback 硬编码**：
  - 目前许多组件使用 `var(--lk-color-text, #333)`。虽然有变量，但 fallback 的 `#333` 与设计令牌中的 `#090909` 不一致。
  - **建议**：批量将 `#333` 改为 `#090909`，`#999` 改为 `var(--lk-text-placeholder)` 等。
- [ ] **语义色阶全覆盖**：
  - 检查 `lk-verify-code` 等具有状态反馈的组件，确保它们引用 `var(--lk-color-success)` 而非 `#34c759`。
- [ ] **Z-Index 规范化**：
  - 普查所有组件，确保 `z-index` 值不直接写死数字，必须引用 `var(--lk-z-index-*)`。

## 2. 视觉一致性 (Visual Consistency) 🟠

### 交互反馈
- [ ] **应用标准 Mixins**：
  - [ ] `lk-list`/`lk-grid`：所有可点击项应用 `@include active-overlay`。
  - [ ] `lk-tag`：可关闭标签的图标应用 `@include active-opacity`。
  - [ ] `lk-switch`：滑块拨动增加 `var(--lk-transition-base)` 过渡。
- [ ] **圆角对齐**：
  - 确保所有大容器（Card, Modal）统一使用 `var(--lk-radius-lg)`。
  - 确保所有控件（Input, Button）统一使用 `var(--lk-radius-md)`。

## 3. 跨端适配 (Adaptive Excellence) 🟠

### 布局适配
- [ ] **安全区域全覆盖**：
  - [ ] `lk-tabbar-container`
  - [ ] `lk-action-sheet`
  - [ ] `lk-popup` (位位置为 bottom 时)
  - [ ] `lk-backtop` (偏移量需考虑安全区)
- [ ] **自动暗色模式**：
  - 在全局状态管理或 `App.vue` 中实现基于 `uni.getSystemInfo` 的自动主题切换。

## 4. 维护与文档 🟡

- [ ] **清理弃用变量**：在正式发布前删除 `component-vars.scss` 中的 `Deprecated` 兼容段落。
- [ ] **主题文档**：在文档中增加“设计令牌”章节，列出所有可覆盖的 CSS 变量。

---
*注：本列表由 Gemini CLI 自动生成，作为样式优化计划的指引。*
