---
title: Card 卡片
phone: card
---

# Card 卡片

将信息聚合在卡片容器中展示。

## 交互式调试

<PropsPlayground
  component="card"
  :props-def="[
    { key: 'title', type: 'string', label: '标题', default: '卡片标题' },
    { key: 'subTitle', type: 'string', label: '副标题', default: '' },
    { key: 'shadow', type: 'enum', label: '阴影', values: ['none', 'never', 'sm', 'md', 'base', 'lg'], default: 'sm' },
    { key: 'border', type: 'boolean', label: '边框', default: false },
    { key: 'hoverable', type: 'boolean', label: '悬浮效果', default: false },
    { key: 'transparent', type: 'boolean', label: '透明', default: false },
  ]"
  slot-content="卡片内容示例"
/>

## 基础用法

```vue
<lk-card title="标题">内容</lk-card>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import CardDemo from '@/components/demos/card-demo.vue'
</script>

<template>
  <CardDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-card />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-card/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
