---
title: Tag 标签
phone: tag
---

# Tag 标签

标注内容属性、元信息或操作状态的小型标签。

## 基础用法

```vue
<template>
  <view class="demo-row">
    <lk-tag>默认</lk-tag>
    <lk-tag type="success">成功</lk-tag>
    <lk-tag type="warning">警告</lk-tag>
    <lk-tag type="danger">危险</lk-tag>
    <lk-tag type="info">信息</lk-tag>
  </view>
</template>
```

## 样式变体

```vue
<template>
  <!-- 实体（默认） -->
  <view class="demo-row">
    <lk-tag>实体</lk-tag>
    <lk-tag type="success">实体</lk-tag>
    <lk-tag type="danger">实体</lk-tag>
  </view>

  <!-- 描边 -->
  <view class="demo-row">
    <lk-tag variant="outline">描边</lk-tag>
    <lk-tag variant="outline" type="success">描边</lk-tag>
    <lk-tag variant="outline" type="danger">描边</lk-tag>
  </view>

  <!-- 浅色背景 -->
  <view class="demo-row">
    <lk-tag variant="light">浅色</lk-tag>
    <lk-tag variant="light" type="success">浅色</lk-tag>
    <lk-tag variant="light" type="danger">浅色</lk-tag>
  </view>
</template>
```

## 尺寸

```vue
<template>
  <view class="demo-row" style="align-items:center">
    <lk-tag size="sm">小标签</lk-tag>
    <lk-tag size="md">中标签</lk-tag>
    <lk-tag size="lg">大标签</lk-tag>
  </view>
</template>
```

## 可关闭

```vue
<script setup lang="ts">
import { ref } from 'vue'
const tags = ref(['Vue 3', 'TypeScript', 'Uni-app', 'Lucky UI'])
function remove(t: string) {
  tags.value = tags.value.filter(x => x !== t)
}
</script>

<template>
  <view class="demo-row">
    <lk-tag
      v-for="t in tags" :key="t"
      closable @close="remove(t)"
    >{{ t }}</lk-tag>
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 语义类型 | `default \| success \| warning \| danger \| info` | `default` |
| variant | 样式变体 | `solid \| outline \| light` | `solid` |
| size | 尺寸 | `sm \| md \| lg` | `md` |
| closable | 是否可关闭 | `boolean` | `false` |
| round | 是否胶囊圆角 | `boolean` | `false` |

### Events

| 事件名 | 说明 |
|--------|------|
| click | 点击标签 |
| close | 点击关闭按钮 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 标签内容 |
