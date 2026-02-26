---
title: Slider 滑块
phone: slider
---

# Slider 滑块

用于在数值区间内进行选择。

## 交互式调试

<PropsPlayground
  component="slider"
  :props-def="[
    { key: 'min', type: 'number', label: '最小值', default: 0 },
    { key: 'max', type: 'number', label: '最大值', default: 100 },
    { key: 'step', type: 'number', label: '步长', default: 1 },
    { key: 'disabled', type: 'boolean', label: '禁用', default: false },
    { key: 'showValue', type: 'boolean', label: '显示值', default: false },
    { key: 'showStops', type: 'boolean', label: '显示刻度', default: false },
  ]"
/>

## 基础用法

```vue
<lk-slider v-model="val" :min="0" :max="100" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import SliderDemo from '@/components/demos/slider-demo.vue'
</script>

<template>
  <SliderDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-slider />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-slider/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
