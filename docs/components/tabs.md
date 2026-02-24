---
title: Tabs 选项卡
phone: tabs
---

# Tabs 选项卡

用于在同一内容区域切换不同内容面板。

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

## 带图标

```vue
<template>
  <lk-tabs v-model="tab">
    <lk-tab-pane name="chat" label="消息" icon="chat">
      <view style="padding:32rpx">消息列表</view>
    </lk-tab-pane>
    <lk-tab-pane name="contact" label="联系人" icon="people">
      <view style="padding:32rpx">联系人列表</view>
    </lk-tab-pane>
    <lk-tab-pane name="me" label="我" icon="person">
      <view style="padding:32rpx">个人信息</view>
    </lk-tab-pane>
  </lk-tabs>
</template>
```

## 卡片样式

```vue
<template>
  <lk-tabs v-model="tab" type="card">
    <lk-tab-pane name="all" label="全部" />
    <lk-tab-pane name="pending" label="待处理" />
    <lk-tab-pane name="done" label="已完成" />
  </lk-tabs>
</template>
```

## 可禁用选项

```vue
<template>
  <lk-tabs v-model="tab">
    <lk-tab-pane name="a" label="可用 A" />
    <lk-tab-pane name="b" label="禁用 B" disabled />
    <lk-tab-pane name="c" label="可用 C" />
  </lk-tabs>
</template>
```

## API

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 当前选中 tab 的 name（v-model） | `string` | — |
| type | 风格类型 | `line \| card \| pill` | `line` |
| sticky | 是否使用吸顶布局 | `boolean` | `false` |
| scrollable | tab 数量多时是否可横向滚动 | `boolean` | `false` |
| activeColor | 激活颜色 | `string` | — |

### TabPane Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 唯一标识 | `string` | — |
| label | 选项卡标题 | `string` | — |
| icon | 图标名称 | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |

### Tabs Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 激活 tab 变化 | `(name: string) => void` |
| change | 激活 tab 变化 | `(name: string) => void` |
