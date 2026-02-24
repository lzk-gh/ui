---
title: Skeleton 骨架屏
phone: skeleton
---

# Skeleton 骨架屏

用于页面加载时的占位内容。

## 基础用法

```vue
<lk-skeleton :rows="3" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import SkeletonDemo from '@/components/demos/skeleton-demo.vue'
</script>

<template>
  <SkeletonDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-skeleton />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-skeleton/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
