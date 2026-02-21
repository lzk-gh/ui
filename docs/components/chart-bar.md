# ChartBar 柱状图

高性能柱状图组件，使用 uni-app 原生 Canvas 2D（`type="2d"`）渲染，支持 DPR 防模糊、RAF 丝滑进入动画与触摸 Tooltip。

## 基础用法

```vue
<lk-chart-bar :data="data" :height="360" />
```

## Props

- `data`: `{ label?: string; value: number; color?: string }[]`
- `height`: `number | string`（默认 `320`，数字按 `rpx` 处理）
- `padding`: `number`（默认 `24`，rpx）
- `barRadius`: `number`（默认 `16`，rpx）
- `maxBarWidth`: `number`（默认 `40`，rpx；0 表示自动）
- `animationDuration`: `number`（默认 `600`，ms）
- `tooltip`: `boolean`（默认 `true`）

## Events

- `hoverChange(index)`：触摸高亮项变化（无高亮时为 `-1`）

## 注意事项

- 组件会自动读取父容器宽高，建议通过 `height` 或父容器样式明确高度。
- 小程序中 Canvas 为原生层，Tooltip 采用“绘制在 Canvas 内”的方式避免层级问题。

## 规范示例（推荐）

> 该章节结构参考 Naive UI / Ant Design 的文档组织方式，建议所有组件示例至少覆盖以下维度。

- 运行示例参考：`src/components/demos/chart-bar-demo.vue`

### 基础用法

- 展示组件最小可用示例（MVP）。
- 建议同时给出默认值与常见场景说明。

### 变体（Variants）

- 覆盖常见视觉/语义变体（如 primary / success / warning / danger）。
- 如无变体能力，可说明“不适用”。

### 尺寸（Size）

- 覆盖 `sm / md / lg` 或对应尺寸能力。
- 如组件不支持尺寸，说明由容器或样式变量控制。

### 状态（States）

- 至少覆盖 `disabled`、加载态、错误态、空态中的适用项。
- 涉及交互时，补充事件触发与边界行为。

## API

- 建议按 `Props`、`Events`、`Slots`、`Expose` 分节说明。
- 推荐使用表格统一字段：`参数`、`说明`、`类型`、`默认值`。
