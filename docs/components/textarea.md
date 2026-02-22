---
title: Textarea 文本域
phone: textarea
---

# Textarea 文本域

多行文本输入。

## 基础用法

```vue
<lk-textarea v-model="text" placeholder="请输入" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import TextareaDemo from '@/components/demos/textarea-demo.vue'
</script>

<template>
  <TextareaDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-textarea />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-textarea/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
