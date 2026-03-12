---
title: Loading 加载
phone: loading
---

# Loading 加载

用于表达“数据处理中”“页面加载中”“请求提交中”等等待状态。

## 交互式调试

<PropsPlayground
  component="loading"
  :props-def="[
    { key: 'type', type: 'enum', label: '类型', values: ['spinner', 'dots', 'bounce', 'wave', 'ring', 'ellipsis', 'text', 'bar'], default: 'spinner' },
    { key: 'size', type: 'string', label: '尺寸', default: '40' },
    { key: 'vertical', type: 'boolean', label: '垂直排列', default: false },
    { key: 'text', type: 'string', label: '文本', default: '' },
  ]"
/>

## 基础用法

```vue
<lk-loading />
```

## 搭配文案

建议在用户需要等待超过 1 秒的场景下，配合 `text` 明确告知当前状态。

```vue
<lk-loading text="提交中..." />
```

## 尺寸与颜色

```vue
<template>
  <lk-loading size="60" color="#7c3aed" />
  <lk-loading size="30" color="#f97316" />
</template>
```

## 垂直布局

适合空状态占位、全页加载或卡片加载态。

```vue
<lk-loading type="ring" text="加载中..." vertical />
```

## 扩展动画类型

当前组件提供两套入口：

- `variant`：声明式基础类型，适合常规场景。
- `type`：兼容旧版与扩展动画，适合需要更多视觉样式的场景。

```vue
<template>
  <lk-loading type="bounce" text="弹跳加载" />
  <lk-loading type="wave" text="波浪加载" />
  <lk-loading type="ellipsis" text="处理中" />
  <lk-loading type="text" text="Loading..." />
</template>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import LoadingDemo from '@/components/demos/loading-demo.vue'
</script>

<template>
  <LoadingDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-loading />
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| size | 图标尺寸，数字或纯数字字符串按 `rpx` 处理 | `string \| number` | `'40'` |
| color | 加载图标颜色 | `string` | `var(--lk-color-primary)` |
| variant | 基础动画类型，推荐用于常规场景 | `spinner \| circular \| dots` | `spinner` |
| type | 扩展动画类型；传入时优先级高于 `variant` | `string` | `''` |
| vertical | 是否垂直排列图标与文本 | `boolean` | `false` |
| text | 加载文案 | `string` | `''` |

### 推荐的 `type` 值

| 值 | 说明 |
|----|------|
| spinner | 转圈样式 |
| dots | 三点闪烁 |
| bar | 横向条形 |
| bounce | 弹跳小球 |
| wave | 波浪柱状 |
| ring | 环形旋转 |
| ellipsis | 省略号 |
| text | 文字闪烁 |

### Events

无

### Slots

无

## 使用建议

::: tip
业务页内局部加载建议使用较小尺寸；全屏加载或空状态建议配合 `vertical` 与 `text` 提升可理解性。
:::

::: warning
如果同时传入 `type` 和 `variant`，最终以 `type` 为准。
:::
