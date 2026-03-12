---
title: Backtop 返回顶部
phone: backtop
---

# Backtop 返回顶部

当页面或容器滚动到一定距离后，显示悬浮返回顶部按钮。支持页面滚动模式和受控容器滚动模式。

## 基础用法

```vue
<lk-backtop />
```

默认监听页面滚动，滚动高度超过 `visibilityHeight` 后显示按钮。

## 自定义位置与样式

```vue
<lk-backtop
  right="40rpx"
  bottom="160rpx"
  shape="round"
  size="lg"
/>
```

## 容器内受控模式

当页面主体不是整页滚动，而是内部 `scroll-view` 滚动时，需要关闭页面滚动监听，改由外部传入 `scrollTop`。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const innerTop = ref(0)

function onScroll(e) {
  innerTop.value = e.detail.scrollTop
}
</script>

<template>
  <scroll-view scroll-y :scroll-top="innerTop" style="height: 500rpx" @scroll="onScroll">
    <view style="height: 2000rpx"></view>
  </scroll-view>

  <lk-backtop
    :use-page-scroll="false"
    :scroll-top="innerTop"
    @to-top="innerTop = 0"
  />
</template>
```

## 自定义按钮内容

```vue
<lk-backtop text="TOP">
  <lk-icon name="arrow-up-circle-fill" size="40" color="var(--lk-color-text-inverse)" />
</lk-backtop>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import BacktopDemo from '@/components/demos/backtop-demo.vue'
</script>

<template>
  <BacktopDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-backtop />
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| zIndex | 层级 | `number` | `400` |
| visibilityHeight | 滚动超过该值后显示按钮 | `number` | `200` |
| right | 距离右侧偏移 | `string \| number` | `'32rpx'` |
| bottom | 距离底部偏移 | `string \| number` | `'80rpx'` |
| duration | 回顶动画时长，单位 ms | `number` | `300` |
| shape | 按钮形状 | `circle \| square \| round` | `circle` |
| size | 按钮尺寸 | `sm \| md \| lg` | `md` |
| icon | 图标名称 | `string` | `'arrow-up'` |
| text | 按钮文字 | `string` | `''` |
| usePageScroll | 是否监听页面滚动 | `boolean` | `true` |
| scrollTop | 当前滚动位置；受控模式下使用 | `number` | `0` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击按钮时触发 | `()` |
| to-top | 执行回顶操作时触发；受控模式下用于外部同步滚动归零 | `()` |
| change:visible | 按钮显示状态变化时触发 | `(visible: boolean)` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义按钮内容 |

## 使用建议

::: tip
如果你的页面主体是 `scroll-view`，请务必设置 `usePageScroll="false"`，并把容器的滚动值同步到 `scrollTop`。
:::
