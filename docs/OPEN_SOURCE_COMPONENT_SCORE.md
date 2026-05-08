# Lucky UI 组件开源发布评分报告

> 生成时间：2026-05-08；范围：`src/uni_modules/lucky-ui/components/` 下 69 个 `lk-*` 组件。

## 评分口径

- 总分 100：结构完整度、类型与导出、文档与 Demo、规范一致性、发布风险各 20 分。
- 等级：A 85-100 可优先发布；B 70-84 小修后发布；C 50-69 需补关键资产；D 0-49 不建议进入首批。
- `chart-area/ring/sparkline/stat-card/radar-lite` 按 `chart-lite` 聚合文档与 Demo 识别；`preload-debugger` 按调试能力降权；`number-keyboard` 按 legacy 降权。
- 本报告仅评组件级发布成熟度，不覆盖 npm 包元信息、README、LICENSE、CHANGELOG、CI 发布流水线。

## 总体分布

| 等级 | 数量 |
|------|------|
| A | 63 |
| B | 4 |
| C | 2 |

## Top 可发布清单

| 组件 | 分数 | 等级 | 主要备注 |
|------|------|------|----------|
| lk-card | 100 | A |  |
| lk-action-sheet | 99 | A | 缺回归覆盖 |
| lk-badge | 99 | A | 缺回归覆盖 |
| lk-cell | 99 | A | 缺回归覆盖 |
| lk-checkbox | 99 | A | 缺回归覆盖 |
| lk-collapse | 99 | A | 缺回归覆盖 |
| lk-form | 99 | A | 缺回归覆盖 |
| lk-image | 99 | A | 缺回归覆盖 |
| lk-notice-bar | 99 | A | 缺回归覆盖 |
| lk-progress | 99 | A | 缺回归覆盖 |
| lk-radio | 99 | A | 缺回归覆盖 |
| lk-rate | 99 | A | 缺回归覆盖 |
| lk-segmented | 99 | A | 缺回归覆盖 |
| lk-slider | 99 | A | 缺回归覆盖 |
| lk-stepper | 99 | A | 缺回归覆盖 |

## Bottom 高风险清单

| 组件 | 分数 | 等级 | 主要备注 |
|------|------|------|----------|
| lk-tabbar-container | 51 | C | 缺Demo；缺index.scss；fixed 定位；CSS filter；动态组件；缺回归覆盖 |
| lk-preload-debugger | 62 | C | 聚合文档:preload；聚合Demo:preload；缺index.scss；未扩展baseProps；custom入口不足；fixed 定位；debug-only；缺回归覆盖 |
| lk-number-keyboard | 71 | B | 缺文档；缺props导出；custom入口不足；legacy；缺回归覆盖 |
| lk-choice | 79 | B | 缺文档；缺Demo；缺回归覆盖 |
| lk-watermark | 80 | B | 缺文档；缺全局类型；fixed 定位；缺回归覆盖 |
| lk-index-bar | 84 | B | 缺文档；custom入口不足；fixed 定位；缺回归覆盖 |
| lk-sticky | 86 | A | 缺文档；custom入口不足；缺回归覆盖 |
| lk-horizontal-scroll | 88 | A | 缺index.scss；webkit 私有属性；缺回归覆盖 |
| lk-virtual-list | 88 | A | custom入口不足；webkit 私有属性；缺回归覆盖 |
| lk-waterfall | 89 | A | custom入口不足 |
| lk-keyboard | 90 | A | custom入口不足；fixed 定位；CSS filter；缺回归覆盖 |
| lk-anchor | 91 | A | 未扩展baseProps；custom入口不足；缺回归覆盖 |
| lk-chart-radar-lite | 91 | A | 聚合文档:chart-lite；聚合Demo:chart-lite；chart-lite-doc；缺回归覆盖 |
| lk-chart-ring | 91 | A | 聚合文档:chart-lite；聚合Demo:chart-lite；chart-lite-doc；缺回归覆盖 |
| lk-chart-stat-card | 91 | A | 聚合文档:chart-lite；聚合Demo:chart-lite；chart-lite-doc；缺回归覆盖 |

## 全量评分表

| 组件 | 总分 | 等级 | 结构 | 类型导出 | 文档Demo | 规范 | 风险 | 文档 | Demo | 备注 |
|------|------|------|------|----------|----------|------|------|------|------|------|
| lk-card | 100 | A | 20 | 20 | 20 | 20 | 20 | direct | direct |  |
| lk-action-sheet | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-badge | 99 | A | 20 | 20 | 20 | 20 | 19 | direct-basic | direct | 缺回归覆盖 |
| lk-cell | 99 | A | 20 | 20 | 20 | 20 | 19 | direct-basic | direct | 缺回归覆盖 |
| lk-checkbox | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-collapse | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-form | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-image | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-notice-bar | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-progress | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-radio | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-rate | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-segmented | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-slider | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-stepper | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-switch | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-tag | 99 | A | 20 | 20 | 20 | 20 | 19 | direct-basic | direct | 缺回归覆盖 |
| lk-textarea | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-time-picker | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-upload | 99 | A | 20 | 20 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-backtop | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct | fixed 定位；缺回归覆盖 |
| lk-button | 97 | A | 20 | 20 | 20 | 20 | 17 | direct-basic | direct |  |
| lk-dropdown | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct | fixed 定位；缺回归覆盖 |
| lk-input | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct |  |
| lk-meta-row | 97 | A | 20 | 17 | 20 | 20 | 20 | direct | direct |  |
| lk-navbar | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct | fixed 定位；缺回归覆盖 |
| lk-overlay | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct | fixed 定位；缺回归覆盖 |
| lk-picker | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct |  |
| lk-tooltip | 97 | A | 20 | 20 | 20 | 20 | 17 | direct | direct |  |
| lk-avatar | 96 | A | 20 | 17 | 20 | 20 | 19 | direct-basic | direct | 缺回归覆盖 |
| lk-date-picker | 96 | A | 20 | 20 | 20 | 20 | 16 | direct | direct | webkit 私有属性；缺回归覆盖 |
| lk-divider | 96 | A | 20 | 17 | 20 | 20 | 19 | direct-basic | direct | 缺回归覆盖 |
| lk-number-roller | 96 | A | 20 | 17 | 20 | 20 | 19 | direct | direct | 缺回归覆盖 |
| lk-grid | 95 | A | 20 | 20 | 20 | 16 | 19 | direct | direct | custom入口不足；缺回归覆盖 |
| lk-icon | 95 | A | 20 | 20 | 20 | 16 | 19 | direct-basic | direct | custom入口不足；缺回归覆盖 |
| lk-verify-code | 95 | A | 20 | 20 | 20 | 16 | 19 | direct | direct | custom入口不足；缺回归覆盖 |
| lk-calendar | 94 | A | 20 | 20 | 18 | 20 | 16 | direct | direct | webkit 私有属性；缺回归覆盖 |
| lk-chart-area | 94 | A | 20 | 20 | 15 | 20 | 19 | chart-lite | chart-lite | 聚合文档:chart-lite；聚合Demo:chart-lite；chart-lite-doc；缺回归覆盖 |
| lk-chart-bar | 94 | A | 15 | 20 | 20 | 20 | 19 | direct | direct | 缺index.scss；缺回归覆盖 |
| lk-chart-line | 94 | A | 15 | 20 | 20 | 20 | 19 | direct | direct | 缺index.scss；缺回归覆盖 |
| lk-chart-pie | 94 | A | 15 | 20 | 20 | 20 | 19 | direct | direct | 缺index.scss；缺回归覆盖 |
| lk-chart-sparkline | 94 | A | 20 | 20 | 15 | 20 | 19 | chart-lite | chart-lite | 聚合文档:chart-lite；聚合Demo:chart-lite；chart-lite-doc；缺回归覆盖 |
| lk-fab | 94 | A | 20 | 20 | 20 | 20 | 14 | direct | direct | fixed 定位；CSS filter；缺回归覆盖 |
| lk-tabbar | 94 | A | 20 | 20 | 20 | 20 | 14 | direct | direct | fixed 定位；CSS filter；缺回归覆盖 |
| lk-tabs | 94 | A | 20 | 20 | 20 | 20 | 14 | direct | direct | webkit 私有属性 |
| lk-toast | 94 | A | 20 | 20 | 20 | 16 | 18 | direct | direct | custom入口不足；fixed 定位 |
| lk-loading | 93 | A | 20 | 17 | 20 | 16 | 20 | direct | direct | custom入口不足 |
| lk-modal | 93 | A | 20 | 20 | 20 | 16 | 17 | direct | direct | custom入口不足；fixed 定位；缺回归覆盖 |
| lk-popup | 93 | A | 20 | 20 | 20 | 16 | 17 | direct | direct | custom入口不足；fixed 定位；缺回归覆盖 |
| lk-timeline | 93 | A | 20 | 20 | 20 | 16 | 17 | direct | direct | custom入口不足；webkit 私有属性 |
| lk-carousel | 92 | A | 20 | 20 | 20 | 16 | 16 | direct | direct | CSS filter；缺回归覆盖 |
| lk-curtain | 92 | A | 15 | 20 | 20 | 20 | 17 | direct | direct | 缺index.scss；fixed 定位；缺回归覆盖 |
| lk-skeleton | 92 | A | 20 | 17 | 20 | 16 | 19 | direct | direct | custom入口不足；缺回归覆盖 |
| lk-space | 92 | A | 20 | 17 | 20 | 16 | 19 | direct | direct | custom入口不足；缺回归覆盖 |
| lk-anchor | 91 | A | 20 | 20 | 20 | 12 | 19 | direct | direct | 未扩展baseProps；custom入口不足；缺回归覆盖 |
| lk-chart-radar-lite | 91 | A | 20 | 17 | 15 | 20 | 19 | chart-lite | chart-lite | 聚合文档:chart-lite；聚合Demo:chart-lite；chart-lite-doc；缺回归覆盖 |
| lk-chart-ring | 91 | A | 20 | 17 | 15 | 20 | 19 | chart-lite | chart-lite | 聚合文档:chart-lite；聚合Demo:chart-lite；chart-lite-doc；缺回归覆盖 |
| lk-chart-stat-card | 91 | A | 20 | 17 | 15 | 20 | 19 | chart-lite | chart-lite | 聚合文档:chart-lite；聚合Demo:chart-lite；chart-lite-doc；缺回归覆盖 |
| lk-keyboard | 90 | A | 20 | 20 | 20 | 16 | 14 | direct | direct | custom入口不足；fixed 定位；CSS filter；缺回归覆盖 |
| lk-waterfall | 89 | A | 20 | 20 | 20 | 12 | 17 | direct | direct | custom入口不足 |
| lk-horizontal-scroll | 88 | A | 15 | 17 | 20 | 20 | 16 | direct | direct | 缺index.scss；webkit 私有属性；缺回归覆盖 |
| lk-virtual-list | 88 | A | 20 | 20 | 20 | 12 | 16 | direct | direct | custom入口不足；webkit 私有属性；缺回归覆盖 |
| lk-sticky | 86 | A | 20 | 20 | 11 | 16 | 19 | missing | direct | 缺文档；custom入口不足；缺回归覆盖 |
| lk-index-bar | 84 | B | 20 | 20 | 11 | 16 | 17 | missing | direct | 缺文档；custom入口不足；fixed 定位；缺回归覆盖 |
| lk-watermark | 80 | B | 20 | 12 | 11 | 20 | 17 | missing | direct | 缺文档；缺全局类型；fixed 定位；缺回归覆盖 |
| lk-choice | 79 | B | 20 | 20 | 0 | 20 | 19 | missing | missing | 缺文档；缺Demo；缺回归覆盖 |
| lk-number-keyboard | 71 | B | 20 | 16 | 11 | 13 | 11 | missing | direct | 缺文档；缺props导出；custom入口不足；legacy；缺回归覆盖 |
| lk-preload-debugger | 62 | C | 15 | 17 | 15 | 8 | 7 | preload | preload | 聚合文档:preload；聚合Demo:preload；缺index.scss；未扩展baseProps；custom入口不足；fixed 定位；debug-only；缺回归覆盖 |
| lk-tabbar-container | 51 | C | 10 | 16 | 9 | 7 | 9 | direct | missing | 缺Demo；缺index.scss；fixed 定位；CSS filter；动态组件；缺回归覆盖 |

## 下一轮修复优先级

1. 先处理 C/D 级：补文档、补 Demo、补 `index.scss`、补全导出与全局类型。
2. 将 `lk-preload-debugger` 从公开组件清单中拆出，作为开发工具或调试文档维护。
3. 明确 `lk-number-keyboard` 与 `lk-keyboard` 的发布关系：保留 legacy 说明或合并能力后下线旧入口。
4. 为 `chart-lite` 子组件补独立索引说明，避免用户只能从聚合页推断 API。
5. 对 Top 清单补最小回归测试或 showcase 标记，把发布风险分从“静态合格”推进到“可持续验证”。

## 本轮修复记录

- 已补 `lk-tabbar-container`、`lk-preload-debugger` 的 `index.scss`，并为两者补 `defineOptions`。
- 已将 `LkPreloadDebugger` 从 `components/index.ts` 和 `components.d.ts` 移出，保留直接源码导入作为开发调试工具。
- 已补 `LkNumberKeyboard` props 导出，并新增 legacy 文档，明确新项目优先使用 `LkKeyboard`。
- 已新增 `Choice`、`Watermark`、`NumberKeyboard` 文档，并将 `Choice`、`TabbarContainer` Demo 接入组件详情页。
- 已为 `chart-lite` 页面补子组件索引和选型建议。
- 已为 Top 清单中的高成熟组件补 showcase 标记，区分视觉回归与交互/浮层类回归风险。

## 抽查追溯

- 高分抽查：`lk-button`、`lk-input`、`lk-tabs`、`lk-timeline`、`lk-waterfall` 均可追溯到源码、文档、Demo 或 showcase/测试项。
- 低分抽查：`lk-preload-debugger`、`lk-choice`、`lk-tabbar-container`、`lk-chart-radar-lite`、`lk-chart-stat-card` 的低分原因均来自缺直接文档/Demo、调试/legacy 标注、样式或类型资产不足。
- 组件总数校验：实际 `lk-*` 目录数 69，报告行数 69。
