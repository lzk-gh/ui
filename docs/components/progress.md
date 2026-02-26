---
title: Progress 进度条
phone: progress
---

# Progress 进度条

展示任务的当前进度。

## 交互式调试

<PropsPlayground
  component="progress"
  :props-def="[
    { key: 'percentage', type: 'number', label: '百分比', default: 50 },
    { key: 'strokeWidth', type: 'number', label: '线宽', default: 12 },
    { key: 'showText', type: 'boolean', label: '显示文字', default: true },
    { key: 'textInside', type: 'boolean', label: '文字内嵌', default: false },
    { key: 'striped', type: 'boolean', label: '条纹', default: false },
    { key: 'animated', type: 'boolean', label: '动画', default: false },
  ]"
/>

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

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import ProgressDemo from '@/components/demos/progress-demo.vue'
</script>

<template>
  <ProgressDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-progress />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-progress/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
