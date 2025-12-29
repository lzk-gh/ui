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
    <lk-button variant="outline">描边按钮</lk-button>
    <lk-button variant="soft">柔和按钮</lk-button>
    <lk-button variant="text">文字按钮</lk-button>
  </view>
</template>
```

## 按钮尺寸

```vue
<view class="demo-row">
  <lk-button size="sm">小</lk-button>
  <lk-button size="md">中</lk-button>
  <lk-button size="lg">大</lk-button>
</view>
```

## 按钮形状

```vue
<view class="demo-row">
  <lk-button shape="default">默认</lk-button>
  <lk-button shape="square">方形</lk-button>
  <lk-button shape="round">胶囊</lk-button>
  <lk-button shape="circle">圆</lk-button>
</view>
```

## Props

- variant: 按钮变体，可选 `solid | outline | soft | text`
- size: 按钮大小，可选 `sm | md | lg`
- shape: 按钮形状，可选 `default | square | round | circle`
- disabled: 是否禁用，`boolean`
- loading: 是否加载中，`boolean`
- block: 是否为块级按钮，`boolean`
- icon: 图标类名，`string`
