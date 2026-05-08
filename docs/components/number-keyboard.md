---
title: NumberKeyboard 数字键盘
phone: number-keyboard
---

# NumberKeyboard 数字键盘

::: warning Legacy
`LkNumberKeyboard` 是旧版数字键盘，仅保留兼容。新功能优先使用 [Keyboard 键盘](./keyboard)，它覆盖数字、身份证、车牌和自定义布局。
:::

## 适用场景

- 既有项目已经接入 `LkNumberKeyboard`，需要保持 API 稳定。
- 只需要数字、小数点和确认按钮的轻量输入。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const value = ref('');

function handleInput(key: string) {
  value.value += key;
}
</script>

<template>
  <lk-number-keyboard
    v-model:visible="visible"
    extra-key="."
    allow-decimal
    @input="handleInput"
  />
</template>
```

## 迁移到 LkKeyboard

```vue
<lk-keyboard
  v-model:visible="visible"
  v-model="value"
  type="number"
  show-dot
/>
```

### 迁移策略

| 旧组件能力 | 新组件配置 |
|------------|------------|
| `visible` | `v-model:visible` |
| `input/delete/confirm` 事件 | `v-model` + `input/delete/confirm` |
| `allowDecimal` | `show-dot` |
| `random` | `random` |
| `extraKey` | `extra-key` |

新项目不要再新增 `LkNumberKeyboard` 示例。公开文档仅保留兼容说明，后续可在 major 版本中移除旧入口。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| visible | 是否显示 | `boolean` | `false` |
| random | 是否随机排序 | `boolean` | `false` |
| extraKey | 左下角额外按键 | `string` | `''` |
| confirmText | 确认按钮文本 | `string` | `'确认'` |
| allowDecimal | 是否允许小数点 | `boolean` | `false` |
| allowKeyboard | 是否允许系统键盘 | `boolean` | `false` |
| safeArea | 是否预留安全区 | `boolean` | `true` |
| zIndex | 层级 | `number` | `99` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:visible | 显隐变化 | `(visible: boolean) => void` |
| input | 输入按键 | `(key: string) => void` |
| delete | 删除 | `() => void` |
| confirm | 确认 | `() => void` |
| close | 关闭 | `() => void` |

## 发布验收

`lk-number-keyboard` 已纳入 needs-hardening showcase 回归，发布前按下面边界验收：

| 场景 | 验收方式 | 要点 |
|------|----------|------|
| 展示台基线 | 自动回归 | `tests/visual/needs-hardening-showcase.spec.ts` 校验组件路由、verified 状态与中风险标记 |
| Legacy 兼容 | 人工验收 | `input/delete/confirm/close` 旧事件保持兼容，不再新增公开能力 |
| 迁移关系 | 人工验收 | 新文档、示例和首批发布说明优先引导到 `lk-keyboard` |
