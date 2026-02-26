---
title: Notice Bar 通知栏
phone: notice-bar
---

# Notice Bar 通知栏

滚动播放的通知信息。

## 交互式调试

<PropsPlayground
  component="notice-bar"
  :props-def="[
    { key: 'text', type: 'string', label: '通知内容', default: '这是一条通知信息' },
    { key: 'scrollable', type: 'boolean', label: '滚动', default: false },
    { key: 'closeable', type: 'boolean', label: '可关闭', default: false },
    { key: 'icon', type: 'string', label: '图标', default: '' },
    { key: 'noBackground', type: 'boolean', label: '无背景', default: false },
  ]"
/>

## 基础用法

```vue
<lk-notice-bar text="这是一条通知" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import NoticeBarDemo from '@/components/demos/notice-bar-demo.vue'
</script>

<template>
  <NoticeBarDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-notice-bar />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-notice-bar/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
