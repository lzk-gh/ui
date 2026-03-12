---
title: Overlay 遮罩层
phone: overlay
---

# Overlay 遮罩层

用于在页面上方添加半透明遮罩，以突出某个区域、阻止背景交互或承载浮层内容。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <lk-overlay v-model="show" />
</template>
```

## 嵌入内容

默认插槽可直接承载浮层中的自定义内容。

```vue
<lk-overlay v-model="show">
  <view class="overlay-card" @click.stop>
    <text>这是内容区域</text>
  </view>
</lk-overlay>
```

## 自定义透明度与背景色

```vue
<template>
  <lk-overlay v-model="show" :opacity="0.8" />
  <lk-overlay v-model="show" background="rgba(15, 23, 42, 0.72)" />
</template>
```

## 关闭行为与滚动控制

```vue
<template>
  <lk-overlay v-model="show" :close-on-click="false" />
  <lk-overlay v-model="show" :lock-scroll="false" />
</template>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import OverlayDemo from '@/components/demos/overlay-demo.vue'
</script>

<template>
  <OverlayDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-overlay />
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| show | 是否显示，兼容旧写法 | `boolean` | `false` |
| modelValue | 是否显示（v-model） | `boolean` | `undefined` |
| zIndex | 层级 | `number` | `900` |
| opacity | 遮罩透明度 | `number` | `0.55` |
| background | 自定义背景色；传入后优先于 `opacity` | `string` | `''` |
| closeOnClick | 点击遮罩是否关闭 | `boolean` | `true` |
| lockScroll | 是否锁定背景滚动 | `boolean` | `true` |
| duration | 动画持续时间（毫秒） | `number` | `240` |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| click | 点击遮罩时触发 | `() => void` |
| update:show | 兼容旧写法的状态更新 | `(value: boolean) => void` |
| update:modelValue | v-model 状态更新 | `(value: boolean) => void` |
| after-enter | 入场动画结束 | `() => void` |
| after-leave | 离场动画结束 | `() => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 遮罩层中的内容 |

## 使用建议

::: tip
如果只是给 `popup`、`modal` 这类组件提供背景蒙层，优先让这些组件自行管理；只有在你需要自定义覆盖内容时再直接使用 `lk-overlay`。
:::
