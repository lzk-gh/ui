---
title: Sticky 粘性布局
phone: sticky
---

# Sticky 粘性布局

用于让筛选栏、分组标题或操作区在滚动时吸附到顶部。

## 基础用法

```vue
<template>
  <lk-sticky :offset-top="88">
    <view class="filter-bar">筛选条件</view>
  </lk-sticky>
</template>
```

## 容器内吸附

```vue
<template>
  <view id="list-container" class="list-container">
    <lk-sticky container="#list-container">
      <view class="section-title">今日订单</view>
    </lk-sticky>
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| offsetTop | 距离顶部偏移 | `number` | `0` |
| container | 限制吸附范围的容器选择器或对象 | `string / object` | `''` |
| customClass | 自定义类名 | `string / object / array` | — |
| customStyle | 自定义样式 | `string / object` | — |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 需要吸附的内容 |

## 兼容说明

`lk-sticky` 会读取节点尺寸与滚动位置。页面存在自定义导航栏、安全区或嵌套滚动容器时，需要显式设置 `offsetTop`，并在目标端校验吸附边界。

