---
title: Segmented 分段器
phone: segmented
---

# Segmented 分段控制器

在多个选项间快速切换。

## 交互式调试

<PropsPlayground
  component="segmented"
  :props-def="[
    { key: 'size', type: 'enum', label: '尺寸', values: ['sm', 'md', 'lg'], default: 'md' },
    { key: 'animated', type: 'boolean', label: '动画', default: true },
  ]"
/>

## 基础用法

```vue
<lk-segmented :options="['A','B','C']" v-model="active" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import SegmentedDemo from '@/components/demos/segmented-demo.vue'
</script>

<template>
  <SegmentedDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-segmented />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-segmented/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
