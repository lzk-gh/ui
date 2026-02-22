---
title: Toast 轻提示
phone: toast
---

# Toast 轻提示

轻量级的全局通知提示，不打断用户流程，自动消失。

## 使用前准备

在应用入口页面放置 Toast 管理器：

```vue
<!-- App.vue 或根布局 -->
<template>
  <view>
    <router-view />
    <!-- Toast 渲染容器，放在最外层 -->
    <lk-toast-manager />
  </view>
</template>
```

## 基础用法

```vue
<script setup lang="ts">
import { toastStore } from '@/uni_modules/lucky-ui/components/lk-toast/toast-manager'

function showMsg() {
  toastStore.show('操作成功！')
}
</script>

<template>
  <lk-button @click="showMsg">显示 Toast</lk-button>
</template>
```

## 不同位置

```vue
<script setup lang="ts">
import { toastStore } from '@/uni_modules/lucky-ui'

function top() { toastStore.show({ message: '顶部提示', position: 'top' }) }
function center() { toastStore.show({ message: '居中提示', position: 'center' }) }
function bottom() { toastStore.show({ message: '底部提示', position: 'bottom' }) }
</script>

<template>
  <view class="demo-row">
    <lk-button @click="top">顶部</lk-button>
    <lk-button @click="center">居中</lk-button>
    <lk-button @click="bottom">底部</lk-button>
  </view>
</template>
```

## 自定义时长

```vue
<script setup lang="ts">
import { toastStore } from '@/uni_modules/lucky-ui'

function show1s() { toastStore.show({ message: '显示 1 秒', duration: 1000 }) }
function show4s() { toastStore.show({ message: '显示 4 秒', duration: 4000 }) }
function stay() { toastStore.show({ message: '不自动关闭', duration: 0 }) }
</script>

<template>
  <view class="demo-row">
    <lk-button @click="show1s">1 秒</lk-button>
    <lk-button @click="show4s">4 秒</lk-button>
    <lk-button @click="stay">不关闭</lk-button>
  </view>
</template>
```

## 动画效果

```vue
<script setup lang="ts">
import { toastStore } from '@/uni_modules/lucky-ui'
</script>

<template>
  <view class="demo-row">
    <lk-button @click="toastStore.show({ message: 'slide-up', transition: 'slide-up' })">
      SlideUp
    </lk-button>
    <lk-button @click="toastStore.show({ message: 'fade', transition: 'fade' })">
      Fade
    </lk-button>
    <lk-button @click="toastStore.show({ message: 'zoom', transition: 'zoom' })">
      Zoom
    </lk-button>
  </view>
</template>
```

## 手动关闭

```vue
<script setup lang="ts">
import { toastStore } from '@/uni_modules/lucky-ui'
import { ref } from 'vue'

const toastId = ref<number | null>(null)

function open() {
  toastId.value = toastStore.show({ message: '长时间 Toast，点击关闭', duration: 0 })
}

function close() {
  if (toastId.value !== null) {
    toastStore.close(toastId.value)
    toastId.value = null
  }
}
</script>

<template>
  <lk-button @click="open">打开</lk-button>
  <lk-button variant="outline" @click="close">关闭</lk-button>
</template>
```

## API

### toastStore 方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| show | 显示 Toast | `string \| ToastOptions` | `id: number` |
| close | 关闭指定 Toast（带退出动画） | `(id: number) => void` | — |
| clear | 关闭所有 Toast | `() => void` | — |

### ToastOptions

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| message | 提示内容 | `string` | — |
| duration | 自动关闭时长（ms），0 表示不关闭 | `number` | `2000` |
| position | 显示位置 | `top \| center \| bottom` | `center` |
| transition | 动画效果 | `slide-up \| fade \| zoom` | `slide-up` |

### LkToastManager 组件

无需传入 Props，直接放置在根节点即可（全局单例）。
