---
title: Tag 标签
---

# Tag 标签

用于标记和分类的小标签。

## 基础用法

```vue
<lk-tag>默认</lk-tag>
<lk-tag type="primary">主要</lk-tag>
<lk-tag type="success">成功</lk-tag>
<lk-tag type="warning">警告</lk-tag>
<lk-tag type="danger">危险</lk-tag>
```

## 可关闭

```vue
<lk-tag closable @close="onClose">可关闭</lk-tag>

<script setup lang="ts">
function onClose() {}
</script>
```

## Props（节选）

- type: 颜色风格 `default | primary | success | warning | danger`
- closable: 是否可关闭
- round: 是否圆角

## 规范示例（推荐）

> 该章节结构参考 Naive UI / Ant Design 的文档组织方式，建议所有组件示例至少覆盖以下维度。

- 运行示例参考：`src/components/demos/tag-demo.vue`

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
