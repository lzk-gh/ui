---
title: Button 按钮
phone: button
---

# Button 按钮

用于触发操作的按钮，支持多种变体、尺寸与形状。

## 交互式调试

<PropsPlayground
  component="button"
  :props-def="[
    { key: 'variant', type: 'enum', label: '按钮变体', values: ['solid', 'outline', 'text', 'soft'], default: 'solid' },
    { key: 'size', type: 'enum', label: '按钮尺寸', values: ['sm', 'md', 'lg'], default: 'md' },
    { key: 'shape', type: 'enum', label: '按钮形状', values: ['default', 'square', 'round', 'circle'], default: 'default' },
    { key: 'loading', type: 'boolean', label: '加载状态', default: false },
    { key: 'disabled', type: 'boolean', label: '禁用状态', default: false },
    { key: 'block', type: 'boolean', label: '块级按钮', default: false },
  ]"
  slot-content="按钮文字"
/>

## 基础用法

```vue
<template>
  <view class="demo-row">
    <lk-button>默认按钮</lk-button>
    <lk-button variant="outline">描边按钮</lk-button>
    <lk-button variant="soft">柔和按钮</lk-button>
    <lk-button variant="text">文字按钮</lk-button>
  </view>
</template>
```

## 尺寸

```vue
<template>
  <view class="demo-row">
    <lk-button size="sm">小</lk-button>
    <lk-button size="md">中（默认）</lk-button>
    <lk-button size="lg">大</lk-button>
  </view>
  <lk-button block size="lg" shape="round" style="margin-top:24rpx">
    块级胶囊按钮
  </lk-button>
</template>
```

## 形状

```vue
<template>
  <view class="demo-row">
    <lk-button shape="default">默认圆角</lk-button>
    <lk-button shape="square">直角</lk-button>
    <lk-button shape="round">胶囊</lk-button>
    <lk-button shape="circle">
      <lk-icon name="plus" />
    </lk-button>
  </view>
</template>
```

## 加载与禁用

```vue
<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(false)
function submit() {
  loading.value = true
  setTimeout(() => { loading.value = false }, 2000)
}
</script>

<template>
  <view class="demo-row">
    <lk-button :loading="loading" @click="submit">
      {{ loading ? '提交中...' : '点击提交' }}
    </lk-button>
    <lk-button disabled>已禁用</lk-button>
  </view>
</template>
```

## 图标按钮

```vue
<template>
  <view class="demo-row">
    <lk-button>
      <lk-icon name="search" style="margin-right:8rpx" />
      搜索
    </lk-button>
    <lk-button variant="outline">
      <lk-icon name="download" style="margin-right:8rpx" />
      下载
    </lk-button>
    <lk-button shape="circle" variant="soft">
      <lk-icon name="heart" />
    </lk-button>
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| variant | 按钮变体 | `solid \| outline \| soft \| text` | `solid` |
| size | 按钮尺寸 | `sm \| md \| lg` | `md` |
| shape | 按钮形状 | `default \| square \| round \| circle` | `default` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| block | 是否块级 | `boolean` | `false` |
| icon | 图标名称 | `string` | `''` |
| nativeType | 原生类型 | `button \| submit \| reset` | `button` |
| customClass | 额外类名 | `string` | `''` |
| customStyle | 额外样式 | `string \| object` | `''` |

### Events

| 事件名 | 说明 |
|--------|------|
| click | 非禁用/非加载状态下的点击 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 按钮内容 |
