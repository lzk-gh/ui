---
title: Slider 滑块
phone: slider
---

# Slider 滑块

用于在连续或离散区间内拖拽选择数值，适合音量、进度、筛选区间、评分调节等场景。

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
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(30)
</script>

<template>
  <lk-slider v-model="value" :min="0" :max="100" />
</template>
```

## 显示当前值

```vue
<lk-slider v-model="value" show-value />
```

## 步长与刻度点

`showStops` 适合离散选择场景；当步数过多时，组件会自动隐藏刻度点以避免界面过密。

```vue
<lk-slider v-model="value" :min="10" :max="40" :step="5" show-stops show-value />
```

## 双滑块范围选择

范围模式下，`v-model` 绑定值为数组。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const range = ref([20, 60])
</script>

<template>
  <lk-slider v-model="range" range :max="100" show-value />
</template>
```

## 自定义样式

```vue
<lk-slider
  v-model="value"
  active-color="#ff4d4f"
  inactive-color="#ffe4e6"
  block-color="#ff4d4f"
  block-size="36rpx"
  bar-height="8rpx"
/>
```

## 与表单联动

传入 `prop` 后，滑块在拖拽结束时会触发表单字段变更校验。

```vue
<lk-slider v-model="form.score" prop="score" />
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

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 当前值；范围模式下为数组 | `number \| number[]` | `0` |
| range | 是否开启双滑块范围选择 | `boolean` | `false` |
| min | 最小值 | `number` | `0` |
| max | 最大值 | `number` | `100` |
| step | 步长 | `number` | `1` |
| showStops | 是否显示间断点 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| showValue | 是否显示当前值 | `boolean` | `false` |
| size | 尺寸 | `small \| default \| large` | `default` |
| activeColor | 激活条颜色 | `string` | `''` |
| inactiveColor | 背景轨道颜色 | `string` | `''` |
| blockSize | 滑块大小 | `string` | `''` |
| blockColor | 滑块颜色 | `string` | `''` |
| barHeight | 轨道高度 | `string` | `''` |
| prop | 表单字段名 | `string` | `''` |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 当前值变化 | `(value: number \| number[]) => void` |
| input | 拖动过程中的实时值 | `(value: number \| number[]) => void` |
| change | 拖动结束后的最终值 | `(value: number \| number[]) => void` |
| dragstart | 开始拖拽 | `() => void` |
| dragend | 结束拖拽 | `() => void` |

### Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| button | 自定义滑块按钮内容 | `{ value }` |

## 使用建议

::: tip
如果用于价格区间、年龄区间等筛选，优先使用 `range` 模式，并在业务层展示格式化后的说明文案。
:::

::: warning
范围模式下组件内部会自动排序最终值，因此提交给后端前不需要再手动保证 `[min, max]` 顺序。
:::
