---
title: Avatar 头像
---

# Avatar 头像

用来代表用户或物体，支持图片、图标与文字。

## 基础用法

```vue
<lk-avatar src="https://example.com/user.png" />
<lk-avatar icon="person" />
<lk-avatar>U</lk-avatar>
```

## 形状与尺寸

```vue
<lk-avatar shape="circle" size="small">A</lk-avatar>
<lk-avatar shape="square" size="large">A</lk-avatar>
```

## Props（节选）

- src: 图片地址
- icon: 内置图标名
- shape: `circle | square`
- size: `small | medium | large` 或 数字

## 规范示例（推荐）

> 该章节结构参考 Naive UI / Ant Design 的文档组织方式，建议所有组件示例至少覆盖以下维度。

- 运行示例参考：`src/components/demos/avatar-demo.vue`

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
