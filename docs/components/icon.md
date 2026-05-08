---
title: Icon 图标
phone: icon
---

# Icon 图标

基于 Lucky UI 图标字体的图标组件，用于在按钮、导航、状态提示和列表中渲染统一图标。

## 基础用法

```vue
<template>
  <lk-icon name="house" />
  <lk-icon name="search" size="40" />
  <lk-icon name="check-circle-fill" color="success" />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 图标名称 | `string` | 必填 |
| color | 图标颜色，支持语义色或 CSS 颜色值 | `string` | `''` |
| size | 图标尺寸 | `string / number` | `''` |
| customClass | 自定义类名 | `string / object / array` | — |
| customStyle | 自定义样式 | `string / object` | — |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击图标时触发 | `(event: Event)` |

## 兼容说明

图标依赖字体资源与 `-webkit-font-smoothing` 等渲染优化。App 端或低版本 WebView 中需确认字体资源路径可访问，避免出现方块字或锯齿差异。

