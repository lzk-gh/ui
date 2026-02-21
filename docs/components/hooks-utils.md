---
title: Hooks 与工具
---

# Hooks 与工具

本文档汇总 `lucky-ui` 中常用的 composables 与 core utils，作为开源版本的快速索引。

## Demo 入口

- H5/小程序演示页：组件总览中的 `HooksUtils`
- 路由参数方式：`/pages/component-detail/index?name=hooks-utils`

## Composables

### useTransition

- 作用：统一管理进入/离开动画状态
- 来源：`@/uni_modules/lucky-ui/composables`
- 详细文档：`/USE_TRANSITION_GUIDE`

```ts
import { useTransition } from '@/uni_modules/lucky-ui/composables';

const { classes, styles, display } = useTransition(
  () => visible.value,
  { name: 'fade-up', duration: 300 }
);
```

### useRipple

- 作用：触摸涟漪动效（适合按钮/卡片）
- 来源：`@/uni_modules/lucky-ui/composables`

```ts
import { useRipple } from '@/uni_modules/lucky-ui/composables';

const { triggerRipple, rippleActive, rippleWaveStyle } = useRipple();
```

### useChartCanvas

- 作用：图表 canvas 尺寸与实例生命周期管理
- 来源：`@/uni_modules/lucky-ui/composables`

```ts
import { useChartCanvas } from '@/uni_modules/lucky-ui/composables';

const { initCanvas, canvasInfo } = useChartCanvas();
```

## Core Utils

统一从 `@/uni_modules/lucky-ui/core/src` 引入：

```ts
import {
  addUnit,
  debounce,
  throttle,
  formatPrice,
  isPhone,
  isH5,
  createRequest,
} from '@/uni_modules/lucky-ui/core/src';
```

### 常用工具

- `addUnit`：数字自动补 `rpx`
- `debounce` / `throttle`：高频事件优化
- `formatPrice` / `formatTime`：常见格式化
- `isPhone` / `isEmail` / `isIdCard`：输入校验
- `isH5` / `isMpWeixin`：平台判断
- `createRequest`：可配置请求实例

## 推荐约定

- 组件内部尺寸优先使用 `addUnit` 兼容数字输入
- 触摸/滚动类高频事件默认做 `throttle`
- 表单输入提交校验统一使用 `validate` 工具
- 平台分支逻辑优先用 `platform` 工具而不是手写判断

## 规范示例（推荐）

> 该章节结构参考 Naive UI / Ant Design 的文档组织方式，建议所有组件示例至少覆盖以下维度。

- 运行示例参考：`src/components/demos/hooks-utils-demo.vue`

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
