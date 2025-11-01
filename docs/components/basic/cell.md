---
title: Cell 单元格
---

# Cell 单元格

列表项容器，通常用于展示一行信息。

## 基础用法

```vue
<lk-cell title="标题" value="内容" />
<lk-cell title="可点击" is-link @click="onTap" />

<script setup lang="ts">
function onTap() {}
</script>
```

## 带图标

```vue
<lk-cell title="消息" :icon="'bell'" value="10 条" />
```

## Props（节选）

- title: 左侧标题
- value: 右侧内容
- icon: 左侧图标名
- is-link: 是否展示右侧箭头并可点击
