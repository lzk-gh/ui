---
title: Timeline 时间轴
---

# Timeline 时间轴

按时间顺序展示信息。

## 基础用法

以卡片式呈现时间节点，视觉更接近 iOS 风格。

```vue
<lk-timeline>
  <lk-timeline-item
    time="09:00"
    end-time="10:30"
    title="Design Review"
    subtitle="Studio A · 3F"
    desc="讨论近期产品视觉方向与组件一致性。"
    tag="Today"
    location="Room 302"
    person="Sarah Johnson"
    accent="#5a7bff"
  />
</lk-timeline>
```

参考 Demo：

- https://github.com/lzk-gh/ui/blob/main/src/components/demos/timeline-demo.vue

## API

### Timeline Props

| 参数         | 说明                       | 类型          | 默认值                        |
| ------------ | -------------------------- | ------------- | ----------------------------- |
| direction    | 方向（当前仅实现纵向布局） | string        | `vertical`                    |
| show-line    | 是否显示时间轴             | boolean       | `true`                        |
| show-time    | 是否显示时间区域           | boolean       | `true`                        |
| line-color   | 连接线颜色                 | string        | `var(--lk-color-border-weak)` |
| line-width   | 连接线宽度                 | number/string | `4rpx`                        |
| item-gap     | 项目间距                   | number/string | `28rpx`                       |
| size         | 节点尺寸 `sm/md/lg`        | string        | `md`                          |
| active-index | 激活索引（从 0 开始）      | number        | `-1`                          |

### Timeline Item Props

| 参数       | 说明       | 类型    | 默认值                        |
| ---------- | ---------- | ------- | ----------------------------- |
| time       | 起始时间   | string  | -                             |
| endTime    | 结束时间   | string  | -                             |
| title      | 标题       | string  | -                             |
| subtitle   | 副标题     | string  | -                             |
| desc       | 描述       | string  | -                             |
| tag        | 标签       | string  | -                             |
| index      | 项目索引   | number  | `-1`                          |
| active     | 激活态     | boolean | `false`                       |
| accent     | 节点强调色 | string  | `var(--lk-color-primary)`     |
| cardBg     | 卡片背景色 | string  | `var(--lk-color-bg-surface)`  |
| cardBorder | 卡片边框色 | string  | `var(--lk-color-border-weak)` |
| location   | 地点       | string  | -                             |
| person     | 人员       | string  | -                             |
| avatar     | 头像       | string  | -                             |

### Timeline Item Slots

| 名称    | 说明           |
| ------- | -------------- |
| time    | 自定义时间区域 |
| title   | 自定义标题     |
| tag     | 自定义标签     |
| default | 自定义主体内容 |
| footer  | 自定义底部区域 |

## 规范示例（推荐）

> 该章节结构参考 Naive UI / Ant Design 的文档组织方式，建议所有组件示例至少覆盖以下维度。

- 运行示例参考：`src/components/demos/timeline-demo.vue`

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
