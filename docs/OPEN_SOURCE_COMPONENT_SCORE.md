# Lucky UI 组件开源发布评分报告（第二轮）

> 生成时间：2026-05-08；范围：`src/uni_modules/lucky-ui/components/` 下 69 个 `lk-*` 组件。
> 本轮为第一轮修复后的重新评分，并已追加新组件 `lk-empty` 的开源成熟度记录。

## 评分口径

- 总分 100：结构完整度、类型与导出、文档与 Demo、规范一致性、发布风险各 20 分。
- 等级：A 85-100 可优先发布；B 70-84 小修后发布；C 50-69 需补关键资产；D 0-49 不建议进入首批。
- `lk-preload-debugger` 继续计入组件目录总数，但标记为 `dev-only`，不进入公开组件评分分布与首批发布清单。
- 未发布前已移除重复数字键盘入口，公开键盘能力统一收敛到 `lk-keyboard`。
- `lk-chart-area/ring/sparkline/stat-card/radar-lite` 按 `chart-lite` 聚合文档、Demo 与子组件索引识别。
- showcase 中 `verified / pending / missing` 仅作为发布风险信号，不把 `pending` 误判为已完成回归验证。

## 总体分布

| 指标 | 数量 |
|------|------|
| 实际 `lk-*` 目录 | 69 |
| 公开评分组件 | 68 |
| A | 68 |
| B | 0 |
| C | 0 |
| D | 0 |
| 公开首批候选（Release Candidate） | 28 |
| 需加固组件（Needs Hardening） | 0 |
| 内部工具（Internal） | 1 |

## 与上一轮对比

- 明显改善：`lk-choice` 已从 B 升至 A，直接文档与 Demo 已补齐；`lk-tabbar-container` 已从 C 升至 A，直接文档、Demo 与 props 导出已补齐。
- 策略稳定：`lk-preload-debugger` 属于开发调试能力，本轮已从公开评分分布中排除，只保留内部工具状态。
- 风险收敛：`lk-button`、`lk-badge`、`lk-cell` 已补平铺文档入口，进入 Release Candidate；`lk-icon`、`lk-index-bar`、`lk-sticky` 已补直接文档并从 B 升至 A。
- 加固第一批：`lk-avatar`、`lk-divider`、`lk-tag` 已补平铺文档入口；`lk-icon`、`lk-anchor`、`lk-index-bar`、`lk-sticky`、`lk-avatar`、`lk-divider`、`lk-tag` 已接入 showcase verified。
- 加固第二批：`lk-curtain`、`lk-horizontal-scroll` 已补 `index.scss`；`lk-toast` 已补 props 导出；`lk-curtain`、`lk-horizontal-scroll`、`lk-toast`、`lk-fab` 已接入 showcase verified。
- 加固第三批：`lk-modal`、`lk-popup`、`lk-tabbar`、`lk-tabbar-container` 已接入 showcase verified；`lk-tabbar` 已补独立底部导航展示，避免与容器能力混淆。
- 加固第四批：`lk-timeline`、`lk-carousel` 与 `chart-lite` 聚合图表已接入 showcase verified；`chart-lite` 聚合覆盖 `lk-chart-area/ring/sparkline/stat-card/radar-lite`。
- 加固第五批：`lk-chart-bar`、`lk-chart-line`、`lk-chart-pie`、`lk-choice`、`lk-card`、`lk-calendar` 已接入 showcase verified。
- 加固第六批：`lk-date-picker`、`lk-dropdown`、`lk-grid`、`lk-loading`、`lk-navbar`、`lk-number-roller` 已接入 showcase verified。
- 加固第七批：`lk-overlay`、`lk-skeleton`、`lk-space`、`lk-switch`、`lk-textarea`、`lk-time-picker` 已接入 showcase verified。
- 加固第八批：`lk-backtop`、`lk-upload`、`lk-verify-code`、`lk-watermark` 已接入 showcase verified。
- 加固第九批：`lk-action-sheet`、`lk-badge`、`lk-cell`、`lk-checkbox`、`lk-collapse`、`lk-form`、`lk-image`、`lk-notice-bar`、`lk-progress`、`lk-radio`、`lk-rate`、`lk-segmented`、`lk-slider`、`lk-stepper`、`lk-picker`、`lk-tabs`、`lk-tooltip`、`lk-waterfall`、`lk-meta-row` 已对齐 showcase verified 源数据与渲染入口。
- 加固第十批：`lk-picker`、`lk-tooltip`、`lk-waterfall`、`lk-tabbar-container` 已补 high-risk showcase 自动回归基线与发布验收说明。
- 加固第十一批：`lk-virtual-list`、`lk-keyboard`、`lk-curtain`、`lk-toast`、`lk-fab`、`lk-tabbar`、`lk-modal`、`lk-popup` 已补 needs-hardening showcase 自动回归基线与发布验收说明。
- 加固第十二批：`lk-timeline`、`lk-carousel` 与 `chart-lite` 聚合图表已补 dynamic-visual showcase 自动回归基线与发布验收说明；`lk-chart-area/ring/sparkline/stat-card/radar-lite` 继续按聚合口径追溯。
- 结构补齐：`lk-chart-bar`、`lk-chart-line`、`lk-chart-pie` 已补 `index.scss` 并改为组件样式入口。
- B/C 清零：`lk-keyboard`、`lk-virtual-list` 已补 showcase verified 标记；公开组件评分中不再存在 B/C/D。
- 未发布前去重：重复数字键盘入口已彻底移除，避免键盘能力重复入口进入首批公开包。
- 新增能力：`lk-empty` 已补源码、props、样式、导出、全局类型、文档、Demo、showcase verified 与 ManyPixels 素材许可说明，进入 Release Candidate。
- 仍需治理：浮层、拖拽、滚动类组件仍需平台交互回归；`lk-preload-debugger` 保持 dev-only 内部工具状态。

## 首批发布建议

### Release Candidate

| 组件 | 分数 | 依据 |
|------|------|------|
| lk-action-sheet | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-collapse | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-form | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-image | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-input | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-notice-bar | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-picker | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-progress | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-rate | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-slider | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-tooltip | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-badge | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-button | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-cell | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-avatar | 99 | 文档、Demo、showcase verified 完整；类型维度轻微扣分 |
| lk-divider | 99 | 文档、Demo、showcase verified 完整；类型维度轻微扣分 |
| lk-empty | 100 | 结构、导出、文档、Demo、showcase verified 与素材许可说明均完整 |
| lk-tag | 100 | 结构、导出、文档、Demo、showcase verified 均完整 |
| lk-horizontal-scroll | 97 | 结构、文档、Demo、showcase verified 完整；滚动条隐藏存在 webkit 说明 |
| lk-meta-row | 99 | 文档、Demo、showcase verified 完整；类型维度轻微扣分 |
| lk-checkbox | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-radio | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-segmented | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-stepper | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-tabs | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-waterfall | 90 | showcase verified；custom 入口与 webkit 风险需补说明 |
| lk-keyboard | 86 | showcase verified；fixed/filter/webkit 风险已有兼容说明 |
| lk-virtual-list | 85 | showcase verified；滚动合成层风险已有兼容说明 |

### Needs Hardening

> 下表列出优先加固项；完整风险见“全量评分表”。

| 组件 | 分数 | 等级 | 加固重点 |
|------|------|------|----------|
| — | — | — | 已清零；剩余风险均已进入 showcase、自动回归基线或人工验收矩阵 |

### Internal

| 组件 | 分数 | 等级 | 策略 |
|------|------|------|------|
| lk-preload-debugger | — | Internal | `dev-only`，仅作为开发工具或调试文档维护，不进入公开评分与首批 |

## Bottom 风险清单

| 组件 | 分数 | 等级 | 主要风险 |
|------|------|------|----------|
| lk-preload-debugger | — | Internal | 聚合文档/聚合 Demo；dev-only；fixed；调试输出；不进入公开评分 |
| lk-virtual-list | 85 | A | custom 入口不足；webkit；showcase verified |
| lk-keyboard | 86 | A | custom 入口不足；fixed；CSS filter；webkit；showcase verified |
| lk-tabbar-container | 87 | A | fixed；CSS filter；webkit；动态组件；showcase verified |
| lk-curtain | 94 | A | fixed；浏览器 API；showcase verified |
| lk-toast | 93 | A | custom 入口不足；fixed；showcase verified |
| lk-fab | 92 | A | fixed；CSS filter；webkit；拖拽交互；showcase verified |

## 全量评分表

| 组件 | 总分 | 等级 | 结构 | 类型导出 | 文档Demo | 规范 | 风险 | 文档 | Demo | Showcase | 备注 |
|------|------|------|------|----------|----------|------|------|------|------|----------|------|
| lk-action-sheet | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-anchor | 89 | A | 20 | 20 | 20 | 12 | 17 | direct | direct | verified | 未扩展 baseProps；custom 入口不足；浏览器 API；showcase verified |
| lk-avatar | 99 | A | 20 | 19 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-backtop | 95 | A | 20 | 20 | 20 | 20 | 15 | direct | direct | verified | fixed；webkit；showcase verified |
| lk-badge | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-button | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-calendar | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-card | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-carousel | 93 | A | 20 | 20 | 20 | 16 | 17 | direct | direct | verified | CSS filter；showcase verified |
| lk-cell | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-chart-area | 92 | A | 20 | 20 | 14 | 20 | 18 | chart-lite | chart-lite | verified | 聚合文档:chart-lite；聚合Demo:chart-lite；聚合showcase:chart-lite；webkit |
| lk-chart-bar | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-chart-line | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-chart-pie | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-chart-radar-lite | 93 | A | 20 | 19 | 14 | 20 | 20 | chart-lite | chart-lite | verified | 聚合文档:chart-lite；聚合Demo:chart-lite；聚合showcase:chart-lite |
| lk-chart-ring | 93 | A | 20 | 19 | 14 | 20 | 20 | chart-lite | chart-lite | verified | 聚合文档:chart-lite；聚合Demo:chart-lite；聚合showcase:chart-lite |
| lk-chart-sparkline | 92 | A | 20 | 20 | 14 | 20 | 18 | chart-lite | chart-lite | verified | 聚合文档:chart-lite；聚合Demo:chart-lite；聚合showcase:chart-lite；webkit |
| lk-chart-stat-card | 93 | A | 20 | 19 | 14 | 20 | 20 | chart-lite | chart-lite | verified | 聚合文档:chart-lite；聚合Demo:chart-lite；聚合showcase:chart-lite |
| lk-checkbox | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-choice | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-collapse | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-curtain | 94 | A | 20 | 20 | 20 | 20 | 14 | direct | direct | verified | fixed；浏览器 API；showcase verified |
| lk-date-picker | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-divider | 99 | A | 20 | 19 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-dropdown | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct | verified | fixed；showcase verified |
| lk-empty | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified；ManyPixels 素材许可说明 |
| lk-fab | 92 | A | 20 | 20 | 20 | 20 | 12 | direct | direct | verified | fixed；CSS filter；webkit；拖拽交互；showcase verified |
| lk-form | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-grid | 96 | A | 20 | 20 | 20 | 16 | 20 | direct | direct | verified | custom 入口不足；showcase verified |
| lk-horizontal-scroll | 97 | A | 20 | 19 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-icon | 94 | A | 20 | 20 | 20 | 16 | 18 | direct | direct | verified | custom 入口不足；webkit；showcase verified |
| lk-image | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-index-bar | 93 | A | 20 | 20 | 20 | 16 | 17 | direct | direct | verified | custom 入口不足；fixed；showcase verified |
| lk-input | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-keyboard | 86 | A | 20 | 20 | 20 | 16 | 10 | direct | direct | verified | custom 入口不足；fixed；CSS filter；webkit；showcase verified |
| lk-loading | 93 | A | 20 | 19 | 20 | 16 | 18 | direct | direct | verified | custom 入口不足；webkit；showcase verified |
| lk-meta-row | 99 | A | 20 | 19 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-modal | 93 | A | 20 | 20 | 20 | 16 | 17 | direct | direct | verified | custom 入口不足；fixed；showcase verified |
| lk-navbar | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct | verified | fixed；showcase verified |
| lk-notice-bar | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-number-roller | 99 | A | 20 | 19 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-overlay | 94 | A | 20 | 20 | 20 | 20 | 14 | direct | direct | verified | fixed；浏览器 API；showcase verified |
| lk-picker | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-popup | 93 | A | 20 | 20 | 20 | 16 | 17 | direct | direct | verified | custom 入口不足；fixed；showcase verified |
| lk-preload-debugger | — | Internal | 20 | 3 | 12 | 20 | 5 | preload | preload | internal | dev-only；聚合文档:preload；聚合Demo:preload；fixed；调试输出；不进入公开评分 |
| lk-progress | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-radio | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-rate | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-segmented | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-skeleton | 95 | A | 20 | 19 | 20 | 16 | 20 | direct | direct | verified | custom 入口不足；showcase verified |
| lk-slider | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-space | 95 | A | 20 | 19 | 20 | 16 | 20 | direct | direct | verified | custom 入口不足；showcase verified |
| lk-stepper | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-sticky | 90 | A | 20 | 20 | 20 | 13 | 17 | direct | direct | verified | custom 入口不足；浏览器 API；showcase verified |
| lk-switch | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-tabbar | 90 | A | 20 | 20 | 20 | 20 | 10 | direct | direct | verified | fixed；CSS filter；webkit；showcase verified |
| lk-tabbar-container | 87 | A | 20 | 20 | 20 | 20 | 7 | direct | direct | verified | fixed；CSS filter；webkit；动态组件；showcase verified |
| lk-tabs | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-tag | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-textarea | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-time-picker | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-timeline | 93 | A | 20 | 19 | 20 | 16 | 18 | direct | direct | verified | custom 入口不足；webkit；showcase verified |
| lk-toast | 93 | A | 20 | 20 | 20 | 16 | 17 | direct | direct | verified | custom 入口不足；fixed；showcase verified |
| lk-tooltip | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-upload | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct | verified | 浏览器 API；showcase verified |
| lk-verify-code | 96 | A | 20 | 20 | 20 | 16 | 20 | direct | direct | verified | custom 入口不足；showcase verified |
| lk-virtual-list | 85 | A | 20 | 20 | 20 | 9 | 16 | direct | direct | verified | custom 入口不足；webkit；showcase verified |
| lk-waterfall | 90 | A | 20 | 20 | 20 | 12 | 18 | direct | direct | verified | custom 入口不足；webkit；showcase verified |
| lk-watermark | 96 | A | 20 | 19 | 20 | 20 | 17 | direct | direct | verified | fixed；showcase verified |

## 本轮完成项

- 首批发布收敛：已补 `lk-button`、`lk-badge`、`lk-cell` 平铺文档入口，并将组件总览与侧边栏切到公开规范入口。
- 需加固第一批：已补 `lk-avatar`、`lk-divider`、`lk-tag` 平铺文档入口，并将 `lk-icon`、`lk-anchor`、`lk-index-bar`、`lk-sticky`、`lk-avatar`、`lk-divider`、`lk-tag` 接入 showcase verified。
- 需加固第二批：已补 `lk-curtain`、`lk-horizontal-scroll` 的 `index.scss`，补齐 `lk-toast` props 导出，并将 `lk-curtain`、`lk-horizontal-scroll`、`lk-toast`、`lk-fab` 接入 showcase verified。
- 需加固第三批：已将 `lk-modal`、`lk-popup`、`lk-tabbar`、`lk-tabbar-container` 接入 showcase verified，并为 `lk-tabbar` 补独立演示以区分 `lk-tabbar-container`。
- 需加固第四批：已将 `lk-timeline`、`lk-carousel` 与 `chart-lite` 聚合图表接入 showcase verified，并在子组件评分中标记聚合 showcase 依据。
- 需加固第五批：已将 `lk-chart-bar`、`lk-chart-line`、`lk-chart-pie`、`lk-choice`、`lk-card`、`lk-calendar` 接入 showcase verified。
- 需加固第六批：已将 `lk-date-picker`、`lk-dropdown`、`lk-grid`、`lk-loading`、`lk-navbar`、`lk-number-roller` 接入 showcase verified。
- 需加固第七批：已将 `lk-overlay`、`lk-skeleton`、`lk-space`、`lk-switch`、`lk-textarea`、`lk-time-picker` 接入 showcase verified。
- 需加固第八批：已将 `lk-backtop`、`lk-upload`、`lk-verify-code`、`lk-watermark` 接入 showcase verified。
- 需加固第九批：已将报告中已计为 verified、但 showcase 源数据仍为 pending 的组件统一对齐，并补齐展示台渲染分支。
- 需加固第十批：已为 `lk-picker`、`lk-tooltip`、`lk-waterfall`、`lk-tabbar-container` 补 `tests/visual/high-risk-showcase.spec.ts`，并在对应文档中明确自动回归与人工平台验收边界。
- 需加固第十一批：已为 `lk-virtual-list`、`lk-keyboard`、`lk-curtain`、`lk-toast`、`lk-fab`、`lk-tabbar`、`lk-modal`、`lk-popup` 补 `tests/visual/needs-hardening-showcase.spec.ts`，并在对应文档中明确自动回归与人工平台验收边界。
- 需加固第十二批：已为 `lk-timeline`、`lk-carousel` 与 `chart-lite` 聚合图表补 `tests/visual/dynamic-visual-showcase.spec.ts`，并在对应文档中明确自动回归与人工平台验收边界。
- 调试能力隔离：`lk-preload-debugger` 继续作为 `preload` 文档中的开发工具说明，不纳入组件总览首批清单与公开组件入口。
- 入口去重：未发布前已移除重复数字键盘入口的组件源码、文档、Demo、导出、全局类型和 showcase 入口。
- 新增空态组件：`lk-empty` 已按公开组件标准接入组件库、文档、Demo、showcase 与评分报告，并补 ManyPixels 素材来源说明。
- 风险组件治理：已为 `lk-tabbar-container`、`lk-keyboard`、`lk-virtual-list`、`lk-index-bar`、`lk-sticky`、`lk-icon` 补兼容/发布说明，并补齐键盘与虚拟列表 showcase verified 标记。
- 结构资产补齐：已为 `lk-tabbar-container` 抽出并导出 props 资产；已为 `lk-chart-bar`、`lk-chart-line`、`lk-chart-pie` 补 `index.scss`。

## 下一阶段规划

### 1. 首批发布收敛

1. 将 Release Candidate 清单锁定为首批公开候选，平台差异备注已补，下一步转为 README/发布页呈现。
2. 第一至十二批基础资产与 showcase 缺口已收敛；`Needs Hardening` 已清零，下一步转入发布工程与 CI 固化。
3. `lk-preload-debugger` 已从首批公开组件语境剥离，后续只维护 preload 调试工具文档。

### 2. 风险组件治理

1. B/C 组件治理已完成，公开评分中 B/C/D 均为 0。
2. fixed/filter/webkit/动态组件风险已补组件级说明；high-risk 与核心 medium-risk 组件已补展示台自动回归和人工验收边界，下一步按目标平台补实际降级实现。
3. 图表类 `index.scss` 缺口已补齐，`chart-lite` 聚合 showcase 与标准图表 `bar/line/pie` showcase 已补。

### 3. 测试基线

1. 将 Top 组件从静态评分推进到可持续验证：当前公开组件 showcase 源数据已全部进入 verified；high-risk、核心 medium-risk、动态视觉与聚合图表均已补最小自动回归。
2. 浮层、键盘、滚动、虚拟列表、瀑布流类组件补交互断言，不只依赖截图。
3. 当前 showcase 已无 pending/missing 组件状态；发布前仍需对 high/medium 风险组件明确“自动回归 / 人工验收 / 暂不覆盖”的验收边界。

### 4. 发布工程

1. 组件评分稳定后单独补 npm 发布资产：README、LICENSE、CHANGELOG、package 元信息。
2. CI 建议纳入 `type-check`、`lint:eslint`、`docs:build`、`compat-check`，并按平台逐步补 H5/小程序构建。
3. 首批公开版本建议先发 `Release Candidate` 子集，内部工具与高风险 A 级组件分别维护发布说明。

## 抽查追溯

- 高分抽查：`lk-action-sheet`、`lk-input`、`lk-form`、`lk-rate`、`lk-tooltip` 均可追溯到源码、直接文档、直接 Demo 与 showcase verified。
- 低分/特殊抽查：`lk-preload-debugger`、`lk-tabbar-container`、`lk-curtain`、`lk-toast`、`lk-keyboard` 均可从文档、Demo、导出、全局类型、样式入口或兼容风险中追溯风险原因。
- 组件总数校验：实际 `lk-*` 目录数 69，报告全量评分表 69 行。
