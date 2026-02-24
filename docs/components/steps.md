---
title: Steps 步骤条
phone: steps
---

# Steps 步骤条

展示任务的进展步骤。

## 基础用法

```vue
<lk-steps :active="1" :items="['创建','校验','完成']" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import StepsDemo from '@/components/demos/steps-demo.vue'
</script>

<template>
  <StepsDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-steps />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-steps/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
