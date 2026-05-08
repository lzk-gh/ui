---
title: IndexBar 索引栏
phone: index-bar
---

# IndexBar 索引栏

用于通讯录、城市选择等按字母或分组索引快速定位的长列表场景。

## 基础用法

```vue
<template>
  <lk-index-bar @select="onSelect" @change="onChange">
    <lk-index-anchor index="A" title="A" />
    <lk-cell title="Amsterdam" />
    <lk-cell title="Athens" />

    <lk-index-anchor index="B" title="B" />
    <lk-cell title="Berlin" />
  </lk-index-bar>
</template>
```

## API

### IndexBar Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| indexList | 索引列表 | `string[]` | `A-Z` |
| sticky | 是否开启吸顶 | `boolean` | `true` |
| stickyOffsetTop | 吸顶顶部偏移 | `number` | `0` |
| scrollTarget | 滚动容器选择器 | `string` | `''` |
| scrollTop | 当前滚动高度 | `number` | `0` |
| showIndicator | 是否显示大字母提示 | `boolean` | `true` |
| highlightColor | 高亮颜色 | `string` | `''` |
| customClass | 自定义类名 | `string / object / array` | — |
| customStyle | 自定义样式 | `string / object` | — |

### IndexAnchor Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| index | 索引字符 | `string` | 必填 |
| title | 锚点标题 | `string` | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| select | 点击索引时触发 | `(index: string)` |
| change | 激活索引变化 | `(index: string)` |

## 兼容说明

组件依赖 `uni.createSelectorQuery()` 读取锚点位置；自定义滚动容器时应传入稳定的 `scrollTarget` 或同步 `scrollTop`。fixed/吸顶布局在不同端安全区表现不同，发布前需在 H5、App 与目标小程序端分别复核。

