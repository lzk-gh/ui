---
title: Tooltip 文字提示
phone: tooltip
---

# Tooltip 文字提示

用于围绕一个触发元素显示轻量提示信息，支持 `hover`、`click`、手动控制和自定义内容。

## 基础用法

```vue
<lk-tooltip content="提示内容">
  <lk-button>悬停</lk-button>
</lk-tooltip>
```

## 点击触发

```vue
<lk-tooltip content="点击触发" trigger="click">
  <lk-button>点击看看</lk-button>
</lk-tooltip>
```

## 自定义内容

```vue
<lk-tooltip trigger="click">
  <lk-button>自定义内容</lk-button>
  <template #content>
    <view style="display:flex;align-items:center;gap:12rpx">
      <view style="width:20rpx;height:20rpx;border-radius:50%;background:#16a34a" />
      <text>支持复杂内容</text>
    </view>
  </template>
</lk-tooltip>
```

## 位置与宽度

```vue
<template>
  <lk-tooltip content="Top" placement="top"><lk-button>Top</lk-button></lk-tooltip>
  <lk-tooltip content="Bottom" placement="bottom" :width="260"><lk-button>Bottom</lk-button></lk-tooltip>
</template>
```

## 手动控制与常驻显示

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <lk-tooltip :model-value="open" trigger="manual" content="手动控制">
    <lk-button @click="open = !open">切换</lk-button>
  </lk-tooltip>

  <lk-tooltip content="我会一直显示" always>
    <lk-button>常驻</lk-button>
  </lk-tooltip>
</template>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import TooltipDemo from '@/components/demos/tooltip-demo.vue'
</script>

<template>
  <TooltipDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-tooltip />
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| content | 提示文本 | `string` | `''` |
| zIndex | 层级 | `number` | `600` |
| trigger | 触发方式 | `hover \| click \| manual` | `hover` |
| placement | 展示位置 | `top \| bottom \| left \| right` | `top` |
| modelValue | 手动控制显示状态 | `boolean` | `undefined` |
| disabled | 是否禁用 | `boolean` | `false` |
| always | 是否常驻显示 | `boolean` | `false` |
| defaultOpen | 初次挂载时是否默认展开一次 | `boolean` | `false` |
| offset | 与触发元素的间距（rpx） | `number` | `8` |
| width | 浮层宽度 | `number \| string` | `undefined` |
| showDelay | 显示延时（ms） | `number` | `80` |
| hideDelay | 隐藏延时（ms） | `number` | `80` |
| animation | 动画预设名称 | `keyof ANIMATION_PRESETS` | `undefined` |
| animationType | 动画类型 | `TransitionConfig['name']` | `undefined` |
| duration | 动画持续时间 | `number` | `180` |
| delay | 动画延迟 | `number` | `0` |
| easing | 缓动函数 | `TransitionConfig['easing']` | `ease-out` |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 显示状态变化 | `(value: boolean) => void` |
| show | 显示时触发 | `() => void` |
| hide | 隐藏时触发 | `() => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 触发器内容 |
| content | 自定义提示层内容 |

## 使用建议

::: tip
移动端优先使用 `click` 或 `manual`，桌面端才更适合 `hover`。
:::
