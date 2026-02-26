---
title: Loading 加载
phone: loading
---

# Loading 加载

用于展示加载状态。

## 交互式调试

<PropsPlayground
  component="loading"
  :props-def="[
    { key: 'variant', type: 'enum', label: '类型', values: ['spinner', 'circular', 'dots'], default: 'spinner' },
    { key: 'size', type: 'string', label: '尺寸', default: '40' },
    { key: 'vertical', type: 'boolean', label: '垂直排列', default: false },
    { key: 'text', type: 'string', label: '文本', default: '' },
  ]"
/>

## 基础用法

```vue
<lk-loading />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import LoadingDemo from '@/components/demos/loading-demo.vue'
</script>

<template>
  <LoadingDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-loading />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-loading/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
