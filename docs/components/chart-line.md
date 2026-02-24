---
title: ChartLine 折线图
phone: chart-line
---

# ChartLine 折线图

高性能折线图组件，使用平滑贝塞尔曲线（Catmull-Rom 转 Bezier）绘制折线，支持 DPR 防模糊、RAF 进入动画与触摸 Tooltip。

## 基础用法

```vue
<lk-chart-line :data="data" :height="360" />
```

## Props

- `data`: `{ label?: string; value: number }[]`
- `height`: `number | string`（默认 `320`，数字按 `rpx` 处理）
- `padding`: `number`（默认 `24`，rpx）
- `lineWidth`: `number`（默认 `6`，rpx）
- `animationDuration`: `number`（默认 `700`，ms）
- `tooltip`: `boolean`（默认 `true`）

## Events

- `hoverChange(index)`：触摸高亮点变化（无高亮时为 `-1`）

