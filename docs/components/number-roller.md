---
title: NumberRoller 数字翻牌
phone: number-roller
---

# NumberRoller 数字翻牌

用于 NumberRoller 数字翻牌 的基础演示与配置说明。

## 基础用法

```vue
<template>
  <view class="demo-wrap">NumberRoller 数字翻牌 示例</view>
</template>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import NumberRollerDemo from '@/components/demos/number-roller-demo.vue'
</script>

<template>
  <NumberRollerDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-number-roller />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-number-roller/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
