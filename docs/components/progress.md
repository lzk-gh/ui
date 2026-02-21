---
title: Progress 进度条
---

# Progress 进度条

展示任务的当前进度。

## 属性 (Props)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| percentage | 进度百分比 | `number` | `0` |
| stroke-width | 进度条高度 (rpx) | `number` | `12` |
| striped | 是否显示条纹 | `boolean` | `false` |
| animated | 是否显示动画条纹 | `boolean` | `false` |
| show-text | 是否显示进度文字 | `boolean` | `true` |
| text-inside | 进度文字是否内显 | `boolean` | `false` |
| color | 进度条颜色 | `string` | - |
| track-color | 轨道颜色 | `string` | - |
| status | 状态 (`success`, `warning`, `error`) | `string` | - |

## 基础用法

展示基本的线性进度条。

```vue
<lk-progress :percentage="50" />
```

## 条纹效果

可以通过 `striped` 属性设置条纹效果，通过 `animated` 属性设置动画效果。

```vue
<lk-progress :percentage="50" striped animated />
```

## 自定义高度与颜色

```vue
<lk-progress :percentage="50" :stroke-width="24" color="#f56c6c" />
```

参考 Demo：
- https://github.com/lzk-gh/ui/blob/main/src/components/demos/progress-demo.vue

## 规范示例（推荐）

> 该章节结构参考 Naive UI / Ant Design 的文档组织方式，建议所有组件示例至少覆盖以下维度。

- 运行示例参考：`src/components/demos/progress-demo.vue`

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
