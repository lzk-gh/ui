---
title: ChartLite 轻量图表
phone: chart-lite
---

# ChartLite 轻量图表

一组移动端优先的轻量图表组件，适合健康、财务、运营看板等场景。组件使用 uni-app Canvas 2D 绘制，不依赖 ECharts，默认采用 Apple Health / Stocks 风格的柔和渐变与弱坐标视觉。

## 组件清单

- `LkChartStatCard`：指标卡，组合主数值、趋势标签与迷你趋势线。
- `LkChartSparkline`：迷你趋势线，适合嵌入卡片。
- `LkChartArea`：面积趋势图，适合股票、收入、活跃度等连续趋势。
- `LkChartRing`：环形进度 / 多段占比图，适合完成率、健康环、预算占比。
- `LkChartRadarLite`：轻量雷达图，适合能力模型、健康维度、评分分布。

## 子组件索引

| 子组件 | 适用场景 | 数据模型 | 主要能力 |
|--------|----------|----------|----------|
| `LkChartStatCard` | 经营指标、健康摘要、账户概览 | `LiteChartPoint[]` | 主数值、趋势标记、内嵌迷你趋势 |
| `LkChartSparkline` | 卡片内趋势线、列表行走势 | `LiteChartPoint[]` | 折线、面积渐变、末端高亮、触摸索引 |
| `LkChartArea` | 页面级连续趋势 | `LiteChartPoint[]` | 面积图、柔和网格、X 轴首尾标签、触摸提示 |
| `LkChartRing` | 完成率、预算占比、多段占比 | `value/max` 或 `RingChartSegment[]` | 单值环、多段环、中心文案 |
| `LkChartRadarLite` | 能力模型、维度评分、健康雷达 | `RadarLiteItem[]` | 多维雷达、层级网格、标签与顶点 |

### 选择建议

- 要在信息卡中展示“数值 + 趋势”，优先使用 `LkChartStatCard`。
- 要在已有卡片里嵌一条小趋势线，使用 `LkChartSparkline`。
- 要展示完整时间序列趋势，使用 `LkChartArea`。
- 要表达完成率或占比，使用 `LkChartRing`。
- 要比较多个维度分值，使用 `LkChartRadarLite`。

## 基础用法

```vue
<template>
  <lk-chart-stat-card
    title="今日步数"
    value="12,680"
    unit="steps"
    trend="up"
    trend-text="+18%"
    :data="steps"
  />

  <lk-chart-area :data="trend" :height="300" show-x-axis-label />

  <lk-chart-radar-lite :data="wellness" :height="320" />
</template>
```

## 数据格式

### 趋势数据

`LkChartSparkline`、`LkChartArea`、`LkChartStatCard` 使用相同的数据点：

```ts
interface LiteChartPoint {
  label?: string;
  value: number;
}
```

### 环图数据

```ts
interface RingChartSegment {
  label?: string;
  value: number;
  color?: string;
}
```

### 雷达图数据

```ts
interface RadarLiteItem {
  label: string;
  value: number;
  max?: number;
}
```

## API

### LkChartStatCard Props

| 参数        | 说明               | 类型                     | 默认值      |
| ----------- | ------------------ | ------------------------ | ----------- |
| title       | 指标标题           | `string`                 | `''`        |
| value       | 主数值             | `string / number`        | `''`        |
| unit        | 数值单位           | `string`                 | `''`        |
| description | 辅助描述           | `string`                 | `''`        |
| trend       | 趋势方向           | `'up' / 'down' / 'flat'` | `'flat'`    |
| trendText   | 趋势文案           | `string`                 | `''`        |
| data        | 迷你趋势数据       | `LiteChartPoint[]`       | `[]`        |
| showChart   | 是否显示迷你趋势图 | `boolean`                | `true`      |
| chartHeight | 图表高度           | `number / string`        | `112`       |
| color       | 图表主色           | `string`                 | `'primary'` |

### LkChartSparkline Props

| 参数              | 说明               | 类型               | 默认值      |
| ----------------- | ------------------ | ------------------ | ----------- |
| data              | 趋势数据           | `LiteChartPoint[]` | `[]`        |
| height            | 容器高度           | `number / string`  | `120`       |
| padding           | 内边距，单位 rpx   | `number`           | `12`        |
| lineWidth         | 线宽，单位 rpx     | `number`           | `5`         |
| color             | 图表主色           | `string`           | `'primary'` |
| area              | 是否显示面积渐变   | `boolean`          | `true`      |
| showEndPoint      | 是否显示末端高亮点 | `boolean`          | `true`      |
| tooltip           | 是否启用触摸高亮   | `boolean`          | `true`      |
| animationDuration | 动画时长，单位 ms  | `number`           | `560`       |

### LkChartArea Props

| 参数              | 说明                  | 类型               | 默认值      |
| ----------------- | --------------------- | ------------------ | ----------- |
| data              | 趋势数据              | `LiteChartPoint[]` | `[]`        |
| height            | 容器高度              | `number / string`  | `300`       |
| padding           | 内边距，单位 rpx      | `number`           | `28`        |
| lineWidth         | 线宽，单位 rpx        | `number`           | `5`         |
| color             | 图表主色              | `string`           | `'primary'` |
| showGrid          | 是否显示柔和网格线    | `boolean`          | `true`      |
| showXAxisLabel    | 是否显示 X 轴首尾标签 | `boolean`          | `false`     |
| tooltip           | 是否显示触摸提示      | `boolean`          | `true`      |
| defaultIndex      | 默认高亮索引          | `number`           | `-1`        |
| animationDuration | 动画时长，单位 ms     | `number`           | `700`       |

### LkChartRing Props

| 参数              | 说明                                 | 类型                 | 默认值 |
| ----------------- | ------------------------------------ | -------------------- | ------ |
| value             | 单值模式当前值                       | `number`             | `0`    |
| max               | 单值模式最大值                       | `number`             | `100`  |
| segments          | 多段占比数据，传入后优先于 value/max | `RingChartSegment[]` | `[]`   |
| height            | 容器高度                             | `number / string`    | `240`  |
| strokeWidth       | 圆环厚度，单位 rpx                   | `number`             | `24`   |
| padding           | 内边距，单位 rpx                     | `number`             | `20`   |
| showTrack         | 是否显示底轨                         | `boolean`            | `true` |
| title             | 中心主标题                           | `string`             | `''`   |
| subtitle          | 中心副标题                           | `string`             | `''`   |
| showCenter        | 是否显示中心文字                     | `boolean`            | `true` |
| animationDuration | 动画时长，单位 ms                    | `number`             | `700`  |

### LkChartRadarLite Props

| 参数              | 说明              | 类型              | 默认值      |
| ----------------- | ----------------- | ----------------- | ----------- |
| data              | 雷达图维度数据    | `RadarLiteItem[]` | `[]`        |
| height            | 容器高度          | `number / string` | `320`       |
| padding           | 内边距，单位 rpx  | `number`          | `42`        |
| levels            | 网格层级          | `number`          | `4`         |
| max               | 默认最大值        | `number`          | `100`       |
| color             | 图表主色          | `string`          | `'primary'` |
| showLabel         | 是否显示维度标签  | `boolean`         | `true`      |
| showPoint         | 是否显示顶点      | `boolean`         | `true`      |
| animationDuration | 动画时长，单位 ms | `number`          | `680`       |

## Events

| 组件               | 事件名        | 说明           | 回调参数          |
| ------------------ | ------------- | -------------- | ----------------- |
| `LkChartSparkline` | `hoverChange` | 触摸高亮点变化 | `(index: number)` |
| `LkChartArea`      | `hoverChange` | 触摸高亮点变化 | `(index: number)` |

## 注意事项

> [!WARNING]
> ⚠️可能存在平台差异：图表基于 Canvas 2D 绘制，H5 与小程序在字体度量、抗锯齿、渐变渲染上可能存在细微差异。

> [!TIP]
> 数字类型高度会按 rpx 处理；如果需要固定 CSS 高度，可以传入字符串，例如 `height="180px"`。
