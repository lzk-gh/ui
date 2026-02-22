---
title: Navbar 导航栏
phone: navbar
---

# Navbar 导航栏

自定义顶部导航栏，适配 H5 安全区域和小程序状态栏高度。

## 基础用法

```vue
<template>
  <lk-navbar title="页面标题" />
</template>
```

## 带返回按钮

```vue
<template>
  <lk-navbar title="订单详情" back @back="handleBack" />
</template>

<script setup lang="ts">
function handleBack() {
  uni.navigateBack()
}
</script>
```

## 自定义左侧 / 右侧

```vue
<template>
  <lk-navbar title="Lucky UI">
    <template #left>
      <lk-button variant="text" size="sm" @click="goHome">
        <lk-icon name="house" :size="20" />
      </lk-button>
    </template>
    <template #right>
      <view style="display:flex; gap:16rpx">
        <lk-icon name="search" :size="22" @click="openSearch" />
        <lk-icon name="person-circle" :size="22" @click="goProfile" />
      </view>
    </template>
  </lk-navbar>
</template>
```

## 透明导航栏

```vue
<template>
  <!-- 适合有封面大图的页面 -->
  <lk-navbar title="详情" transparent dark back />

  <view class="cover-image" style="height:500rpx; background:#7c3aed" />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题文字 | `string` | `''` |
| back | 是否显示返回按钮 | `boolean` | `false` |
| transparent | 是否透明背景 | `boolean` | `false` |
| dark | 暗色文字（配合透明） | `boolean` | `false` |
| fixed | 是否固定在顶部 | `boolean` | `true` |
| border | 是否显示底部边框 | `boolean` | `true` |
| zIndex | 层级 | `number` | `100` |

### Events

| 事件名 | 说明 |
|--------|------|
| back | 点击返回按钮 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 标题区域自定义内容 |
| left | 左侧区域自定义 |
| right | 右侧区域自定义 |
