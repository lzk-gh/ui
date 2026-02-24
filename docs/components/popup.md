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
| position | 弹出位置 | `top \| bottom \| left \| right \| center` | `center` |
| round | 是否圆角 | `boolean` | `false` |
| closeOnOverlay | 点击遮罩关闭 | `boolean` | `true` |
| lockScroll | 锁定背景滚动 | `boolean` | `true` |
| showOverlay | 是否显示遮罩 | `boolean` | `true` |
| zIndex | 层级 | `number` | `1000` |

### Events

| 事件名 | 说明 |
|--------|------|
| update:modelValue | 显示状态变化 |
| open | 弹出后 |
| close | 关闭后 |
| overlay-click | 点击遮罩 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 弹出层内容 |
