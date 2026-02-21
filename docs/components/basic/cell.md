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

## 规范示例（推荐）

> 该章节结构参考 Naive UI / Ant Design 的文档组织方式，建议所有组件示例至少覆盖以下维度。

- 运行示例参考：`src/components/demos/cell-demo.vue`

### 基础用法

- 展示组件最小可用示例（MVP）。
- 建议同时给出默认值与常见场景说明。

### 变体（Variants）

- 覆盖常见视觉/语义变体（如 primary / success / warning / danger）。
- 如无变体能力，可说明“不适用”。

### 尺寸（Size）

- 覆盖 `sm / md / lg` 或对应尺寸能力。
- 如组件不支持尺寸，说明由容器或样式变量控制。

### 状态（States）

- 至少覆盖 `disabled`、加载态、错误态、空态中的适用项。
- 涉及交互时，补充事件触发与边界行为。

## API

- 建议按 `Props`、`Events`、`Slots`、`Expose` 分节说明。
- 推荐使用表格统一字段：`参数`、`说明`、`类型`、`默认值`。
