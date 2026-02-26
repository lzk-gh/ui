---
title: Stepper 步进器
phone: stepper
---

# Stepper 步进器

通过加减按钮调整数值。

## 交互式调试

<PropsPlayground
  component="stepper"
  :props-def="[
    { key: 'size', type: 'enum', label: '尺寸', values: ['sm', 'md', 'lg'], default: 'md' },
    { key: 'min', type: 'number', label: '最小值', default: 1 },
    { key: 'max', type: 'number', label: '最大值', default: 99 },
    { key: 'step', type: 'number', label: '步长', default: 1 },
    { key: 'disabled', type: 'boolean', label: '禁用', default: false },
    { key: 'integer', type: 'boolean', label: '仅整数', default: false },
    { key: 'disableInput', type: 'boolean', label: '禁用输入', default: false },
  ]"
/>

## 基础用法

```vue
<lk-stepper v-model="count" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import StepperDemo from '@/components/demos/stepper-demo.vue'
</script>

<template>
  <StepperDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-stepper />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-stepper/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
