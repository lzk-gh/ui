---
title: Image 图片
phone: image
---

# Image 图片

图片展示组件，支持占位与加载失败。

## 交互式调试

<PropsPlayground
  component="image"
  :props-def="[
    { key: 'src', type: 'string', label: '图片地址', default: 'https://picsum.photos/200' },
    { key: 'width', type: 'string', label: '宽度', default: '200rpx' },
    { key: 'height', type: 'string', label: '高度', default: '200rpx' },
    { key: 'fit', type: 'enum', label: '适应模式', values: ['cover', 'contain', 'fill', 'none', 'scale-down'], default: 'cover' },
    { key: 'lazy', type: 'boolean', label: '懒加载', default: false },
    { key: 'preview', type: 'boolean', label: '预览', default: false },
    { key: 'showLoading', type: 'boolean', label: '加载占位', default: true },
    { key: 'showError', type: 'boolean', label: '错误占位', default: true },
  ]"
/>

## 基础用法

```vue
<lk-image src="https://example.com/demo.jpg" />
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import ImageDemo from '@/components/demos/image-demo.vue'
</script>

<template>
  <ImageDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-image />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-image/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
