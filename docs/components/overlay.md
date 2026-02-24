---
title: Overlay 遮罩层
phone: overlay
---

# Overlay 遮罩层

用于突出内容或阻止用户操作的半透明蒙层。

## 基础用法

```vue
<lk-overlay v-model:show="show" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import OverlayDemo from '@/components/demos/overlay-demo.vue'
</script>

<template>
  <OverlayDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-overlay />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-overlay/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
