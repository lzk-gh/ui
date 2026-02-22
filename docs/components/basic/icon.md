---
title: Icon 图标
phone: icon
---

# Icon 图标

基于 Bootstrap Icons 封装的图标组件，支持颜色、尺寸等常用定制。

## 基础用法

```vue
<template>
  <view class="demo-row">
    <lk-icon name="house" />
    <lk-icon name="heart" />
    <lk-icon name="star" />
    <lk-icon name="bell" />
    <lk-icon name="person" />
  </view>
</template>
```

## 尺寸

通过 `size` 设置像素尺寸（单位 px，组件内部自动转 rpx）。

```vue
<template>
  <view class="demo-row">
    <lk-icon name="star" :size="16" />
    <lk-icon name="star" :size="24" />
    <lk-icon name="star" :size="32" />
    <lk-icon name="star" :size="48" />
  </view>
</template>
```

## 颜色

```vue
<template>
  <view class="demo-row">
    <lk-icon name="heart-fill" color="#ef4444" />
    <lk-icon name="patch-check-fill" color="#22c55e" />
    <lk-icon name="lightning-charge-fill" color="#f59e0b" />
    <lk-icon name="info-circle-fill" color="#3b82f6" />
    <lk-icon name="shield-fill" color="var(--lk-color-primary)" />
  </view>
</template>
```

## 与文字/按钮组合

```vue
<template>
  <view class="demo-col">
    <!-- 与文字组合 -->
    <view style="display:flex; align-items:center; gap:8rpx">
      <lk-icon name="geo-alt-fill" color="var(--lk-color-primary)" :size="18" />
      <text>北京市朝阳区</text>
    </view>

    <!-- 作为按钮前缀 -->
    <lk-button>
      <lk-icon name="upload" style="margin-right:8rpx" />
      上传图片
    </lk-button>

    <!-- 独立操作图标 -->
    <view class="demo-row">
      <lk-icon name="trash" color="#ef4444" :size="22" />
      <lk-icon name="pencil" color="var(--lk-color-primary)" :size="22" />
      <lk-icon name="share" color="#64748b" :size="22" />
    </view>
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 图标名称 | `string` | — |
| size | 图标尺寸（px） | `number \| string` | `24` |
| color | 图标颜色 | `string` | 继承文本色 |
| customClass | 额外类名 | `string` | `''` |
| customStyle | 额外样式 | `string \| object` | `''` |

::: tip 图标列表
所有图标名称请参考 [Bootstrap Icons](https://icons.getbootstrap.com/)，
使用图标名的**小写连字符**形式（如 `chevron-right`、`arrow-up-circle`）。
:::
