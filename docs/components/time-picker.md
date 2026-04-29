---
title: Time Picker 时间选择器
phone: time-picker
---

# Time Picker 时间选择器

用于选择时间字符串，点击输入区域后从底部弹出时间面板，适合预约时间、营业时间、提醒时间等场景。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const time = ref('12:00:00')
</script>

<template>
  <lk-time-picker v-model="time" />
</template>
```

## 常见场景

### 时间步长

```vue
<script setup lang="ts">
import { ref } from 'vue'

const time = ref('09:00:00')
</script>

<template>
  <lk-time-picker
    v-model="time"
    :step-hour="1"
    :step-minute="5"
    :step-second="10"
  />
</template>
```

### 精度控制

通过 `format` 可决定是否展示秒。

```vue
<template>
  <lk-time-picker v-model="time" format="HH:mm" />
</template>
```

### 可清空 + 禁用

```vue
<script setup lang="ts">
import { ref } from 'vue'

const time = ref('14:30:00')
</script>

<template>
  <lk-time-picker v-model="time" clearable />
  <lk-time-picker v-model="time" disabled style="margin-top: 24rpx" />
</template>
```

### 监听变化

```vue
<script setup lang="ts">
import { ref } from 'vue'

const time = ref('08:00:00')

const handleChange = (value: string) => {
  console.log('time changed:', value)
}
</script>

<template>
  <lk-time-picker v-model="time" @change="handleChange" />
</template>
```

### 占位文案

```vue
<lk-time-picker v-model="time" placeholder="请选择开始时间" />
```

## Demo 复用

### 直接使用项目 Demo（推荐）

```vue
<script setup lang="ts">
import TimePickerDemo from '@/components/demos/time-picker-demo.vue'
</script>

<template>
  <TimePickerDemo />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| modelValue | 绑定值，支持默认 `v-model` | `string` | — | `''` |
| show | 是否显示面板，支持 `v-model:show` | `boolean` | — | `undefined` |
| format | 时间格式；包含 `ss` 时展示秒列 | `string` | — | `HH:mm:ss` |
| placeholder | 占位文本 | `string` | — | `选择时间` |
| clearable | 是否可清除 | `boolean` | — | `true` |
| disabled | 是否禁用 | `boolean` | — | `false` |
| stepHour | 小时步长 | `number` | — | `1` |
| stepMinute | 分钟步长 | `number` | — | `1` |
| stepSecond | 秒步长 | `number` | — | `1` |
| id | 根节点 id | `string` | — | `''` |
| customClass | 自定义类名 | `string / object / array` | — | `''` |
| customStyle | 自定义样式 | `string / object` | — | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | `(val: string)` |
| update:show | 面板显隐变化，配合 `v-model:show` | `(visible: boolean)` |
| select | 面板内草稿值变化时触发 | `(val: string, column: 'h' \| 'm' \| 's')` |
| change | 点击确定或清空后触发 | `(val: string)` |
| confirm | 点击确定时触发 | `(val: string)` |
| cancel | 点击取消时触发，返回当前草稿值 | `(val: string)` |
| open | 打开面板 | `()` |
| close | 关闭面板 | `()` |
| clear | 清空值 | `()` |

### Slots

当前版本以 props + events 为主，暂无对外自定义插槽。

## 使用建议

::: tip
如果业务只需要到分钟级，建议使用 `format="HH:mm"`，界面会更简洁。
:::

::: warning
`v-model` 绑定的是最终时间字符串；如需受控管理面板显隐，请使用 `v-model:show`。
:::
