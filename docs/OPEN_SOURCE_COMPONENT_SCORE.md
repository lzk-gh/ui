# Lucky UI 组件开源发布评分报告（第二轮）

> 生成时间：2026-05-08；范围：`src/uni_modules/lucky-ui/components/` 下 69 个 `lk-*` 组件。
> 本轮为第一轮修复后的重新评分，只更新审计报告与发布规划，不修改组件源码、API、props、事件或导出。

## 评分口径

- 总分 100：结构完整度、类型与导出、文档与 Demo、规范一致性、发布风险各 20 分。
- 等级：A 85-100 可优先发布；B 70-84 小修后发布；C 50-69 需补关键资产；D 0-49 不建议进入首批。
- `lk-preload-debugger` 继续计入组件目录总数，但标记为 `dev-only`，不进入公开首批发布清单。
- `lk-number-keyboard` 标记为 `legacy`，文档已明确新项目优先使用 `lk-keyboard`，本轮只保留发布策略风险扣分。
- `lk-chart-area/ring/sparkline/stat-card/radar-lite` 按 `chart-lite` 聚合文档、Demo 与子组件索引识别。
- showcase 中 `verified / pending / missing` 仅作为发布风险信号，不把 `pending` 误判为已完成回归验证。

## 总体分布

| 指标 | 数量 |
|------|------|
| 实际 `lk-*` 目录 | 69 |
| A | 65 |
| B | 3 |
| C | 1 |
| D | 0 |
| 公开首批候选（Release Candidate） | 21 |
| 需加固组件（Needs Hardening） | 46 |
| 暂缓/内部组件（Hold / Internal） | 2 |

## 与上一轮对比

- 明显改善：`lk-choice` 已从 B 升至 A，直接文档与 Demo 已补齐；`lk-tabbar-container` 已从 C 升至 A，直接文档、Demo 与 props 导出已补齐。
- 策略稳定：`lk-preload-debugger` 仍为 C，但这是预期结果；它属于开发调试能力，应从公开首批组件中排除。
- 风险收敛：`lk-button`、`lk-badge`、`lk-cell` 已补平铺文档入口，进入 Release Candidate；`lk-icon`、`lk-index-bar`、`lk-sticky` 已补直接文档并从 B 升至 A。
- 结构补齐：`lk-chart-bar`、`lk-chart-line`、`lk-chart-pie` 已补 `index.scss` 并改为组件样式入口。
- 仍需补齐：`lk-avatar`、`lk-divider`、`lk-tag` 仍缺直接文档；`lk-preload-debugger` 保持 dev-only；`lk-keyboard`、`lk-virtual-list`、`lk-number-keyboard` 仍需 showcase 或交互回归。

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
| lk-meta-row | 99 | 文档、Demo、showcase verified 完整；类型维度轻微扣分 |
| lk-checkbox | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-radio | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-segmented | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-stepper | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-tabs | 98 | showcase verified；存在 webkit 风险，发布前需平台说明 |
| lk-waterfall | 90 | showcase verified；custom 入口与 webkit 风险需补说明 |

### Needs Hardening

> 下表列出优先加固项；完整风险见“全量评分表”。

| 组件 | 分数 | 等级 | 加固重点 |
|------|------|------|----------|
| lk-virtual-list | 83 | B | custom 入口不足；webkit 风险；缺 showcase |
| lk-keyboard | 84 | B | fixed/filter/webkit 风险；需与 legacy 键盘关系继续收敛 |
| lk-tabbar-container | 85 | A | fixed/filter/webkit/动态组件风险；小程序需使用插槽降级 |
| lk-sticky | 86 | A | custom 入口不足；浏览器 API 风险；缺 showcase |
| lk-index-bar | 89 | A | custom 入口不足；fixed 风险；缺 showcase |
| lk-icon | 90 | A | custom 入口不足；webkit 风险；缺 showcase |
| lk-anchor | 85 | A | 未扩展 baseProps；浏览器 API 风险；缺 showcase |
| lk-avatar | 85 | A | 缺直接文档；缺 showcase |
| lk-curtain | 85 | A | 缺 `index.scss`；fixed 与浏览器 API 风险 |
| lk-divider | 85 | A | 缺直接文档；缺 showcase |
| lk-tag | 86 | A | 缺直接文档；缺 showcase |
| lk-toast | 86 | A | props 导出、custom 入口、fixed 风险需复核 |
| lk-fab | 88 | A | fixed/filter/webkit 风险；缺 showcase |
| lk-horizontal-scroll | 88 | A | 缺 `index.scss`；webkit 风险；缺 showcase |
| lk-tabbar | 88 | A | fixed/filter/webkit 风险；缺 showcase |
| lk-modal | 89 | A | custom 入口与 fixed 风险；缺 showcase |
| lk-popup | 89 | A | custom 入口与 fixed 风险；缺 showcase |
| lk-timeline | 89 | A | custom 入口与 webkit 风险；缺 showcase |
| lk-carousel | 89 | A | CSS filter 风险；缺 showcase |
| lk-chart-area | 88 | A | 依赖 chart-lite 聚合文档；webkit 风险；缺 showcase |
| lk-chart-sparkline | 88 | A | 依赖 chart-lite 聚合文档；webkit 风险；缺 showcase |
| lk-chart-radar-lite | 89 | A | 依赖 chart-lite 聚合文档；缺 showcase |
| lk-chart-ring | 89 | A | 依赖 chart-lite 聚合文档；缺 showcase |
| lk-chart-stat-card | 89 | A | 依赖 chart-lite 聚合文档；缺 showcase |

### Hold / Internal

| 组件 | 分数 | 等级 | 策略 |
|------|------|------|------|
| lk-preload-debugger | 60 | C | `dev-only`，仅作为开发工具或调试文档维护，不进入公开首批 |
| lk-number-keyboard | 84 | B | `legacy`，公开文档保留迁移说明，新项目默认使用 `lk-keyboard` |

## Bottom 风险清单

| 组件 | 分数 | 等级 | 主要风险 |
|------|------|------|----------|
| lk-preload-debugger | 60 | C | 聚合文档/聚合 Demo；dev-only；fixed；调试输出；缺 showcase |
| lk-virtual-list | 83 | B | custom 入口不足；webkit；缺 showcase |
| lk-keyboard | 84 | B | custom 入口不足；fixed；CSS filter；webkit；缺 showcase |
| lk-number-keyboard | 84 | B | legacy；custom 入口不足；缺 showcase |
| lk-tabbar-container | 85 | A | fixed；CSS filter；webkit；动态组件；缺 showcase |
| lk-anchor | 85 | A | 未扩展 baseProps；custom 入口不足；浏览器 API；缺 showcase |
| lk-curtain | 85 | A | 缺 `index.scss`；fixed；浏览器 API；缺 showcase |
| lk-sticky | 86 | A | custom 入口不足；浏览器 API；缺 showcase |

## 全量评分表

| 组件 | 总分 | 等级 | 结构 | 类型导出 | 文档Demo | 规范 | 风险 | 文档 | Demo | Showcase | 备注 |
|------|------|------|------|----------|----------|------|------|------|------|----------|------|
| lk-action-sheet | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-anchor | 85 | A | 20 | 20 | 18 | 12 | 15 | direct | direct | missing | 未扩展 baseProps；custom 入口不足；浏览器 API；缺 showcase |
| lk-avatar | 85 | A | 20 | 19 | 8 | 20 | 18 | missing | direct | missing | 缺文档；缺 showcase |
| lk-backtop | 91 | A | 20 | 20 | 18 | 20 | 13 | direct | direct | missing | fixed；webkit；缺 showcase |
| lk-badge | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-button | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-calendar | 94 | A | 20 | 20 | 18 | 20 | 16 | direct | direct | missing | webkit；缺 showcase |
| lk-card | 96 | A | 20 | 20 | 18 | 20 | 18 | direct | direct | missing | 缺 showcase |
| lk-carousel | 89 | A | 20 | 20 | 18 | 16 | 15 | direct | direct | missing | CSS filter；缺 showcase |
| lk-cell | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified | showcase verified |
| lk-chart-area | 88 | A | 20 | 20 | 12 | 20 | 16 | chart-lite | chart-lite | missing | 聚合文档:chart-lite；聚合Demo:chart-lite；webkit；缺 showcase |
| lk-chart-bar | 96 | A | 20 | 20 | 18 | 20 | 18 | direct | direct | missing | 缺 showcase |
| lk-chart-line | 96 | A | 20 | 20 | 18 | 20 | 18 | direct | direct | missing | 缺 showcase |
| lk-chart-pie | 96 | A | 20 | 20 | 18 | 20 | 18 | direct | direct | missing | 缺 showcase |
| lk-chart-radar-lite | 89 | A | 20 | 19 | 12 | 20 | 18 | chart-lite | chart-lite | missing | 聚合文档:chart-lite；聚合Demo:chart-lite；缺 showcase |
| lk-chart-ring | 89 | A | 20 | 19 | 12 | 20 | 18 | chart-lite | chart-lite | missing | 聚合文档:chart-lite；聚合Demo:chart-lite；缺 showcase |
| lk-chart-sparkline | 88 | A | 20 | 20 | 12 | 20 | 16 | chart-lite | chart-lite | missing | 聚合文档:chart-lite；聚合Demo:chart-lite；webkit；缺 showcase |
| lk-chart-stat-card | 89 | A | 20 | 19 | 12 | 20 | 18 | chart-lite | chart-lite | missing | 聚合文档:chart-lite；聚合Demo:chart-lite；缺 showcase |
| lk-checkbox | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-choice | 96 | A | 20 | 20 | 18 | 20 | 18 | direct | direct | missing | 缺 showcase |
| lk-collapse | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-curtain | 85 | A | 15 | 20 | 18 | 20 | 12 | direct | direct | missing | 缺 `index.scss`；fixed；浏览器 API；缺 showcase |
| lk-date-picker | 94 | A | 20 | 20 | 18 | 20 | 16 | direct | direct | missing | webkit；缺 showcase |
| lk-divider | 85 | A | 20 | 19 | 8 | 20 | 18 | missing | direct | missing | 缺文档；缺 showcase |
| lk-dropdown | 93 | A | 20 | 20 | 18 | 20 | 15 | direct | direct | missing | fixed；缺 showcase |
| lk-fab | 88 | A | 20 | 20 | 18 | 20 | 10 | direct | direct | missing | fixed；CSS filter；webkit；缺 showcase |
| lk-form | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-grid | 92 | A | 20 | 20 | 18 | 16 | 18 | direct | direct | missing | custom 入口不足；缺 showcase |
| lk-horizontal-scroll | 88 | A | 15 | 19 | 18 | 20 | 16 | direct | direct | missing | 缺 `index.scss`；webkit；缺 showcase |
| lk-icon | 90 | A | 20 | 20 | 18 | 16 | 16 | direct | direct | missing | custom 入口不足；webkit；缺 showcase |
| lk-image | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-index-bar | 89 | A | 20 | 20 | 18 | 16 | 15 | direct | direct | missing | custom 入口不足；fixed；缺 showcase |
| lk-input | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-keyboard | 84 | B | 20 | 20 | 18 | 16 | 10 | direct | direct | missing | custom 入口不足；fixed；CSS filter；webkit；缺 showcase |
| lk-loading | 89 | A | 20 | 19 | 18 | 16 | 16 | direct | direct | missing | custom 入口不足；webkit；缺 showcase |
| lk-meta-row | 99 | A | 20 | 19 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-modal | 89 | A | 20 | 20 | 18 | 16 | 15 | direct | direct | missing | custom 入口不足；fixed；缺 showcase |
| lk-navbar | 93 | A | 20 | 20 | 18 | 20 | 15 | direct | direct | missing | fixed；缺 showcase |
| lk-notice-bar | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-number-keyboard | 84 | B | 20 | 20 | 18 | 13 | 13 | direct | direct | missing | legacy；custom 入口不足；缺 showcase |
| lk-number-roller | 95 | A | 20 | 19 | 18 | 20 | 18 | direct | direct | missing | 缺 showcase |
| lk-overlay | 90 | A | 20 | 20 | 18 | 20 | 12 | direct | direct | missing | fixed；浏览器 API；缺 showcase |
| lk-picker | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-popup | 89 | A | 20 | 20 | 18 | 16 | 15 | direct | direct | missing | custom 入口不足；fixed；缺 showcase |
| lk-preload-debugger | 60 | C | 20 | 3 | 12 | 20 | 5 | preload | preload | missing | dev-only；聚合文档:preload；聚合Demo:preload；fixed；调试输出；缺 showcase |
| lk-progress | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-radio | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-rate | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-segmented | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-skeleton | 91 | A | 20 | 19 | 18 | 16 | 18 | direct | direct | missing | custom 入口不足；缺 showcase |
| lk-slider | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-space | 91 | A | 20 | 19 | 18 | 16 | 18 | direct | direct | missing | custom 入口不足；缺 showcase |
| lk-stepper | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-sticky | 86 | A | 20 | 20 | 18 | 13 | 15 | direct | direct | missing | custom 入口不足；浏览器 API；缺 showcase |
| lk-switch | 94 | A | 20 | 20 | 18 | 20 | 16 | direct | direct | missing | webkit；缺 showcase |
| lk-tabbar | 88 | A | 20 | 20 | 18 | 20 | 10 | direct | direct | missing | fixed；CSS filter；webkit；缺 showcase |
| lk-tabbar-container | 85 | A | 20 | 20 | 18 | 20 | 7 | direct | direct | missing | fixed；CSS filter；webkit；动态组件；缺 showcase |
| lk-tabs | 98 | A | 20 | 20 | 20 | 20 | 18 | direct | direct | verified | webkit；showcase verified |
| lk-tag | 86 | A | 20 | 20 | 8 | 20 | 18 | missing | direct | missing | 缺文档；缺 showcase |
| lk-textarea | 96 | A | 20 | 20 | 18 | 20 | 18 | direct | direct | missing | 缺 showcase |
| lk-time-picker | 96 | A | 20 | 20 | 18 | 20 | 18 | direct | direct | missing | 缺 showcase |
| lk-timeline | 89 | A | 20 | 19 | 18 | 16 | 16 | direct | direct | missing | custom 入口不足；webkit；缺 showcase |
| lk-toast | 86 | A | 20 | 17 | 18 | 16 | 15 | direct | direct | missing | props 导出扣分；custom 入口不足；fixed；缺 showcase |
| lk-tooltip | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct | verified |  |
| lk-upload | 93 | A | 20 | 20 | 18 | 20 | 15 | direct | direct | missing | 浏览器 API；缺 showcase |
| lk-verify-code | 92 | A | 20 | 20 | 18 | 16 | 18 | direct | direct | missing | custom 入口不足；缺 showcase |
| lk-virtual-list | 83 | B | 20 | 20 | 18 | 9 | 16 | direct | direct | missing | custom 入口不足；webkit；缺 showcase |
| lk-waterfall | 90 | A | 20 | 20 | 20 | 12 | 18 | direct | direct | verified | custom 入口不足；webkit；showcase verified |
| lk-watermark | 92 | A | 20 | 19 | 18 | 20 | 15 | direct | direct | missing | fixed；缺 showcase |

## 本轮完成项

- 首批发布收敛：已补 `lk-button`、`lk-badge`、`lk-cell` 平铺文档入口，并将组件总览与侧边栏切到公开规范入口。
- 调试能力隔离：`lk-preload-debugger` 继续作为 `preload` 文档中的开发工具说明，不纳入组件总览首批清单与公开组件入口。
- Legacy 策略：`lk-number-keyboard` 文档已补迁移矩阵，明确新项目使用 `lk-keyboard`。
- 风险组件治理：已为 `lk-tabbar-container`、`lk-keyboard`、`lk-number-keyboard`、`lk-virtual-list`、`lk-index-bar`、`lk-sticky`、`lk-icon` 补兼容/发布说明。
- 结构资产补齐：已为 `lk-tabbar-container` 抽出并导出 props 资产；已为 `lk-chart-bar`、`lk-chart-line`、`lk-chart-pie` 补 `index.scss`。

## 下一阶段规划

### 1. 首批发布收敛

1. 将 Release Candidate 清单锁定为首批公开候选，平台差异备注已补，下一步转为 README/发布页呈现。
2. 继续补齐仍缺平铺直接文档的基础组件：`lk-avatar`、`lk-divider`、`lk-tag`。
3. `lk-preload-debugger` 已从首批公开组件语境剥离，后续只维护 preload 调试工具文档。

### 2. 风险组件治理

1. B/C 组件首轮治理已完成，当前剩余 B 级集中在 `lk-keyboard`、`lk-number-keyboard`、`lk-virtual-list`。
2. fixed/filter/webkit/动态组件风险已补组件级说明，下一步按目标平台补实际降级实现或交互回归。
3. 图表类 `index.scss` 缺口已补齐，后续继续强化 `chart-lite` 子组件 showcase。

### 3. 测试基线

1. 将 Top 组件从静态评分推进到可持续验证：优先补视觉稳定的 showcase verified 用例。
2. 浮层、键盘、滚动、虚拟列表、瀑布流类组件补交互断言，不只依赖截图。
3. `showcase pending/missing` 不作为发布通过证据；发布前至少需要明确“已验证 / 暂不验证 / 需人工验收”的状态。

### 4. 发布工程

1. 组件评分稳定后单独补 npm 发布资产：README、LICENSE、CHANGELOG、package 元信息。
2. CI 建议纳入 `type-check`、`lint:eslint`、`docs:build`、`compat-check`，并按平台逐步补 H5/小程序构建。
3. 首批公开版本建议先发 `Release Candidate` 子集，B/C 组件作为后续 minor 版本或内部工具继续治理。

## 抽查追溯

- 高分抽查：`lk-action-sheet`、`lk-input`、`lk-form`、`lk-rate`、`lk-tooltip` 均可追溯到源码、直接文档、直接 Demo 与 showcase verified。
- 低分/特殊抽查：`lk-preload-debugger`、`lk-tabbar-container`、`lk-sticky`、`lk-index-bar`、`lk-number-keyboard` 均可从文档、Demo、导出、全局类型或兼容风险中追溯扣分原因。
- 组件总数校验：实际 `lk-*` 目录数 69，报告全量评分表 69 行。
