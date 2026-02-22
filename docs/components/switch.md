---
title: Switch 开关
phone: switch
---

# Switch 开关

用于开启或关闭某个功能状态，是替代 Checkbox 的更直观表单控件。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
const on = ref(false)
</script>

<template>
  <lk-switch v-model="on" />
  <view>状态：{{ on ? '已开启' : '已关闭' }}</view>
</template>
```

## 尺寸

```vue
<template>
  <view class="demo-row" style="align-items:center">
    <lk-switch size="sm" />
    <lk-switch size="md" />
    <lk-switch size="lg" />
  </view>
</template>
```

## 自定义颜色

```vue
<template>
  <view class="demo-col">
    <lk-switch :model-value="true" active-color="#22c55e" />
    <lk-switch :model-value="true" active-color="#f59e0b" />
    <lk-switch :model-value="true" active-color="#ef4444" />
  </view>
</template>
```

## 禁用与加载

```vue
<template>
  <view class="demo-row">
    <lk-switch :model-value="true" disabled />
    <lk-switch :model-value="false" disabled />
    <lk-switch :model-value="true" loading />
  </view>
</template>
```

## 带文字标签

```vue
<script setup lang="ts">
import { ref } from 'vue'
const receive = ref(true)
const auto = ref(false)
</script>

<template>
  <lk-cell-group>
    <lk-cell title="接收通知">
      <template #value>
        <lk-switch v-model="receive" size="sm" />
      </template>
    </lk-cell>
    <lk-cell title="自动同步">
      <template #value>
        <lk-switch v-model="auto" size="sm" />
      </template>
    </lk-cell>
  </lk-cell-group>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值（v-model） | `boolean` | `false` |
| size | 尺寸 | `sm \| md \| lg` | `md` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| activeColor | 开启状态颜色 | `string` | — |
| inactiveColor | 关闭状态颜色 | `string` | — |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 状态变化 | `(value: boolean) => void` |
| change | 状态变化 | `(value: boolean) => void` |
