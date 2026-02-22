---
title: Form 表单
phone: form
---

# Form 表单

用于数据收集与校验。

## 基础用法

```vue
<lk-form :model="form" :rules="rules">
  <!-- items -->
</lk-form>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import FormDemo from '@/components/demos/form-demo.vue'
</script>

<template>
  <FormDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-form />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-form/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
