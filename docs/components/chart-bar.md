---
title: ChartBar 柱状图
phone: chart-bar
---

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

