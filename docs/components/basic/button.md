---
title: Button 按钮
---

# Button 按钮

用于触发操作的按钮。

## 基础用法

```vue
<template>
  <view class="demo-row">
    <lk-button>默认按钮</lk-button>
    <lk-button type="primary">主要按钮</lk-button>
    <lk-button type="success">成功按钮</lk-button>
    <lk-button type="warning">警告按钮</lk-button>
    <lk-button type="danger">危险按钮</lk-button>
  </view>
  
</template>
```

## 禁用状态

```vue
<lk-button disabled>禁用按钮</lk-button>
```

## 加载状态

```vue
<lk-button loading>加载中</lk-button>
```

## 按钮尺寸

```vue
<view class="demo-row">
  <lk-button size="small">小</lk-button>
  <lk-button>中</lk-button>
  <lk-button size="large">大</lk-button>
</view>
```

## 事件

```vue
<lk-button @click="onClick">点我</lk-button>

<script setup lang="ts">
function onClick() {
  // TODO: 处理点击
}
</script>
```

## Props（节选）

- type: 按钮类型，可选 `default | primary | success | warning | danger`
- size: 按钮大小，可选 `small | medium | large`
- disabled: 是否禁用，`boolean`
- loading: 是否加载中，`boolean`
