---
title: Backtop 返回顶部
phone: backtop
---

# Backtop 返回顶部

当页面滚动到一定距离时，显示返回顶部按钮。

## 基础用法

```vue
<lk-backtop :right="16" :bottom="80" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import BacktopDemo from '@/components/demos/backtop-demo.vue'
</script>

<template>
  <BacktopDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-backtop />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-backtop/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
