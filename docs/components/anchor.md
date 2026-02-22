---
title: Anchor 锚点导航
phone: anchor
---

# Anchor 锚点导航

用于“侧边分类 + 右侧内容滚动”的锚点联动场景，支持亮/暗主题自动适配。

## 基础用法（ScrollView 联动）

- 右侧内容用 `scroll-view` 承载，并给它一个 `id`（例如 `anchor-content`）
- `LkAnchor` 传入 `target-container="#anchor-content"`，用于在小程序端正确测量各 section 的相对位置
- 在右侧 `@scroll` 中把 `scrollTop` 传给 `anchorRef.onScroll(scrollTop)`

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import AnchorDemo from '@/components/demos/anchor-demo.vue'
</script>

<template>
  <AnchorDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-anchor />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-anchor/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
