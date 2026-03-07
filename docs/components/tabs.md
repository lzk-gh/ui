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

## 懒加载内容

默认开启 `lazy`，只有激活过的面板才会真正渲染内容。

```vue
<lk-tabs v-model="tab" lazy>
  <lk-tab-pane name="a" label="A">A 内容</lk-tab-pane>
  <lk-tab-pane name="b" label="B">B 内容</lk-tab-pane>
</lk-tabs>
```

## 卡片样式

```vue
<template>
  <lk-tabs v-model="tab" type="card">
## 滑动切换

```vue
<lk-tabs v-model="tab" swipeable>
  <lk-tab-pane name="a" label="推荐">推荐内容</lk-tab-pane>
  <lk-tab-pane name="b" label="热门">热门内容</lk-tab-pane>
  <lk-tab-pane name="c" label="最新">最新内容</lk-tab-pane>
</lk-tabs>
```

## 自定义标签区

支持 `header`、`prefix`、`suffix`、`tab`、`indicator` 等插槽。

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

## 关于禁用

当前 `lk-tab-pane` 源码仅支持 `name` 和 `label` 两个 props，文档或旧示例中的 `disabled`、`icon` 并非当前稳定 API，建议使用自定义 `tab` 插槽自行扩展视觉与交互。

    <lk-tab-pane name="pending" label="待处理" />
    <lk-tab-pane name="done" label="已完成" />
  </lk-tabs>
</template>
```

## 可禁用选项
| lazy | 是否开启延迟渲染 | `boolean` | `true` |
| type | 风格类型 | `line \| card \| pill` | `line` |
| stretch | 选项卡是否自动拉伸 | `boolean` | `true` |
| swipeable | 内容区是否支持左右滑动切换 | `boolean` | `true` |
| showIndicator | 是否显示下划线指示器，仅 `line` 模式生效 | `boolean` | `true` |
    <lk-tab-pane name="a" label="可用 A" />
    <lk-tab-pane name="b" label="禁用 B" disabled />
    <lk-tab-pane name="c" label="可用 C" />
  </lk-tabs>
</template>
```

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 当前选中 tab 的 name（v-model） | `string` | — |
| type | 风格类型 | `line \| card \| pill` | `line` |
| sticky | 是否使用吸顶布局 | `boolean` | `false` |

### Tabs Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| header | 整个标签栏上方区域 | — |
| prefix | 标签栏左侧区域 | — |
| suffix | 标签栏右侧区域 | — |
| tab | 自定义单个标签渲染 | `{ item, index, active }` |
| indicator | 自定义指示器 | `{ activeIndex, left, width }` |
| default | TabPane 内容区 | — |

## 使用建议

::: tip
如果标签较多，设置 `:stretch="false"` 会更适合横向滚动场景。
:::

::: warning
当前源码中的 `lk-tab-pane` 只注册 `name` 与 `label`，若你需要图标、徽标、禁用态，请优先通过 `tab` 插槽实现。
:::
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
