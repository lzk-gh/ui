---
title: Popup 弹出层
phone: popup
---

# Popup 弹出层

从屏幕四个方向弹出的浮层容器，适合抽屉菜单、选择面板、半屏表单等场景。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
</script>

<template>
  <lk-button @click="show = true">从底部弹出</lk-button>

  <lk-popup v-model="show" position="bottom">
    <view style="padding:48rpx; text-align:center">
      <view style="font-size:32rpx; font-weight:600">底部弹出内容</view>
      <lk-button block style="margin-top:32rpx" @click="show = false">关闭</lk-button>
    </view>
  </lk-popup>
</template>
```

## 四个方向

```vue
<script setup lang="ts">
import { ref } from 'vue'
const pos = ref<'top' | 'bottom' | 'left' | 'right' | ''>('')
</script>

<template>
  <view class="demo-grid-2">
    <lk-button @click="pos = 'top'">从顶部</lk-button>
    <lk-button @click="pos = 'bottom'">从底部</lk-button>
    <lk-button @click="pos = 'left'">从左侧</lk-button>
    <lk-button @click="pos = 'right'">从右侧</lk-button>
  </view>

  <lk-popup v-model="pos" :position="pos || 'bottom'" @close="pos = ''">
    <view style="padding:48rpx">弹出自 {{ pos }}</view>
  </lk-popup>
</template>
```

## 拖拽底部弹层

仅 `bottom` 模式支持拖拽，适合做移动端 Bottom Sheet。

```vue
<lk-popup v-model="show" position="bottom" round draggable title="拖拽示例" closable>
  <view style="padding: 32rpx">向上展开、向下关闭</view>
</lk-popup>
```

## 标题、关闭按钮与标题插槽

```vue
<lk-popup v-model="show" position="bottom" title="选择城市" closable>
  <template #title>
    <view style="display:flex;align-items:center;justify-content:center;gap:12rpx">
      <lk-icon name="star-fill" size="32" color="warning" />
      <text>自定义标题</text>
    </view>
  </template>
  <view style="padding: 32rpx">弹层内容</view>
</lk-popup>
```

## 动画配置

```vue
<lk-popup v-model="show" animation="scale">
  <view style="padding:32rpx">预设动画</view>
</lk-popup>

<lk-popup v-model="show" animation-type="fade-up" :duration="220" easing="ease-out">
  <view style="padding:32rpx">自定义动画</view>
</lk-popup>
```

## 圆角弹框

```vue
<template>
  <lk-popup v-model="show" position="bottom" round>
    <view style="padding:32rpx">
      <!-- 顶部拖动条 -->
      <view style="width:60rpx;height:8rpx;border-radius:4rpx;background:#e2e8f0;margin:0 auto 32rpx" />
      <view>圆角底部弹框内容</view>
    </view>
  </lk-popup>
</template>
```

## 禁止背景滚动

```vue
<template>
  <lk-popup v-model="show" position="bottom" lock-scroll>
    <!-- 当 Popup 打开时，背景页面不可滚动 -->
    <scroll-view style="height:600rpx" scroll-y>
      <view v-for="i in 30" :key="i">列表项 {{ i }}</view>
    </scroll-view>
  </lk-popup>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 是否显示（v-model） | `boolean` | `false` |
| zIndex | 弹层层级 | `number` | `1000` |
| position | 弹出位置 | `top \| bottom \| left \| right \| center` | `center` |
| round | 是否圆角 | `boolean` | `true` |
| radius | 圆角大小 | `string` | `24rpx` |
| draggable | 是否开启拖拽，仅底部模式有效 | `boolean` | `false` |
| title | 标题 | `string` | `''` |
| closable | 是否显示关闭图标 | `boolean` | `false` |
| closeIcon | 关闭图标名称 | `string` | `x-lg` |
| closeIconPosition | 关闭图标位置 | `top-right \| top-left` | `top-right` |
| overlay | 是否显示遮罩 | `boolean` | `true` |
| closeOnOverlay | 点击遮罩关闭 | `boolean` | `true` |
| closeOnClickOverlay | 点击遮罩关闭，兼容旧参数名 | `boolean` | `undefined` |
| lockScroll | 锁定背景滚动 | `boolean` | `true` |
| safeArea | 底部是否适配安全区 | `boolean` | `true` |
| height | 弹层高度 | `string \| number` | `''` |
| width | 弹层宽度 | `string \| number` | `''` |
| animation | 动画预设名称 | `keyof ANIMATION_PRESETS` | `undefined` |
| animationType | 动画类型 | `TransitionConfig['name']` | `undefined` |
| duration | 动画持续时间 | `number` | `undefined` |
| delay | 动画延迟 | `number` | `undefined` |
| easing | 动画缓动函数 | `TransitionConfig['easing']` | `undefined` |

### Events

| 事件名 | 说明 |
|--------|------|
| update:modelValue | 显示状态变化 |
| click-overlay | 点击遮罩 |
| click-close | 点击关闭图标 |
| after-enter | 入场动画结束 |
| after-leave | 离场动画结束 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| title | 自定义标题区域 |
| default | 弹出层内容 |

## 使用建议

::: tip
通用弹层容器优先使用 `lk-popup`；如果是标准确认弹窗，优先使用 `lk-modal`。
:::
