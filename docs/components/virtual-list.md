---
title: Virtual List 虚拟列表
phone: virtual-list
---

# Virtual List 虚拟列表

在长列表中按需渲染可视区域，提升性能。

## 基础用法

```vue
<lk-virtual-list :items="items" :item-height="60">
  <template #default="{ item }">{{ item }}</template>
</lk-virtual-list>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import VirtualListDemo from '@/components/demos/virtual-list-demo.vue'
</script>

<template>
  <VirtualListDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-virtual-list />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-virtual-list/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
