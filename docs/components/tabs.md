---
title: Tabs 选项卡
phone: tabs
---

# Tabs 选项卡

用于在同一内容区域切换多个内容面板，适合频道页、详情页分区、订单状态筛选等高频导航场景。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('home')
</script>

<template>
  <lk-tabs v-model="tab">
    <lk-tab-pane name="home" label="首页">
      <view style="padding:32rpx">首页内容</view>
    </lk-tab-pane>
    <lk-tab-pane name="goods" label="商品">
      <view style="padding:32rpx">商品内容</view>
    </lk-tab-pane>
    <lk-tab-pane name="mine" label="我的">
      <view style="padding:32rpx">我的内容</view>
    </lk-tab-pane>
  </lk-tabs>
</template>
```

## 风格类型

```vue
<lk-tabs v-model="tab" type="line">...</lk-tabs>
<lk-tabs v-model="tab" type="card">...</lk-tabs>
<lk-tabs v-model="tab" type="pill">...</lk-tabs>
```

## 禁用标签

```vue
<lk-tabs v-model="tab" @click-disabled="handleDisabled">
  <lk-tab-pane name="available" label="可用" />
  <lk-tab-pane name="disabled" label="禁用" disabled />
</lk-tabs>
```

## 滑动切换

```vue
<lk-tabs v-model="tab" swipeable @swipe-change="handleSwipe">
  <lk-tab-pane name="recommend" label="推荐">推荐内容</lk-tab-pane>
  <lk-tab-pane name="hot" label="热门">热门内容</lk-tab-pane>
  <lk-tab-pane name="latest" label="最新">最新内容</lk-tab-pane>
</lk-tabs>
```

## 自定义标签区

```vue
<lk-tabs v-model="tab" :stretch="false">
  <template #prefix>
    <lk-icon name="chevron-left" />
  </template>

  <template #tab="{ item, active }">
    <view :style="{ color: active ? 'var(--lk-color-primary)' : '#64748b' }">
      {{ item.label }}
    </view>
  </template>

  <lk-tab-pane name="home" label="首页">首页内容</lk-tab-pane>
  <lk-tab-pane name="chat" label="消息">消息内容</lk-tab-pane>

  <template #suffix>
    <lk-icon name="three-dots" />
  </template>
</lk-tabs>
```

## API

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 当前选中 `TabPane.name`，支持 `v-model` | `string \| number` | `''` |
| lazy | 是否开启内容懒渲染 | `boolean` | `true` |
| type | 风格类型 | `line \| card \| pill` | `line` |
| stretch | 标签是否自动拉伸；超过 5 项时会自然滚动 | `boolean` | `true` |
| swipeable | 内容区域是否支持左右滑动切换 | `boolean` | `true` |
| showIndicator | 是否显示下划线指示器，仅 `line` 模式生效 | `boolean` | `true` |
| id | 根节点 id | `string` | `''` |
| customClass | 根节点自定义类名 | `string \| object \| array` | — |
| customStyle | 根节点自定义样式 | `string \| object` | — |

### TabPane Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 唯一标识，必填 | `string \| number` | — |
| label | 标签标题，必填 | `string` | — |
| disabled | 是否禁用标签点击与滑动切换 | `boolean` | `false` |

### Tabs Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 激活项变化 | `(name: string \| number) => void` |
| change | 激活项变化后触发 | `(name, pane, index) => void` |
| click | 点击标签时触发，重复点击也会触发 | `(name, pane, index, event) => void` |
| tab-click | 点击标签时触发，返回对象载荷 | `({ name, pane, index, event }) => void` |
| click-disabled | 点击禁用标签时触发 | `({ name, pane, index, event }) => void` |
| swipe-change | 左右滑动切换成功后触发 | `({ name, pane, index, direction }) => void` |

### Tabs Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| default | `lk-tab-pane` 内容 | — |
| header | 标签栏上方区域 | — |
| prefix | 标签栏左侧区域 | — |
| suffix | 标签栏右侧区域 | — |
| tab | 自定义单个标签 | `{ item, index, active }` |
| indicator | 自定义指示器 | `{ activeIndex, left, width }` |

## 使用建议

::: tip
标签数量较多时建议设置 `:stretch="false"`，让标签宽度按内容自然撑开，滚动体验更稳定。
:::
