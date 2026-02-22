---
title: Time Picker 时间选择器
phone: time-picker
---

# Time Picker 时间选择器

用于选择时间值，支持步长、清空、禁用与格式控制。

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

### 可清空 + 禁用

```vue
<script setup lang="ts">
import { ref } from 'vue'

const time = ref('14:30:00')
</script>

<template>
  <lk-time-picker v-model="time" clearable @clear="() => (time = '')" />
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

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值（时间字符串） | `string` | `''` |
| format | 时间格式（支持裁剪秒） | `string` | `HH:mm:ss` |
| placeholder | 占位文本 | `string` | `选择时间` |
| clearable | 是否可清除 | `boolean` | `true` |
| disabled | 是否禁用 | `boolean` | `false` |
| stepHour | 小时步长 | `number` | `1` |
| stepMinute | 分钟步长 | `number` | `1` |
| stepSecond | 秒步长 | `number` | `1` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 绑定值更新 | `(val: string)` |
| change | 选择值变化 | `(val: string)` |
| open | 打开面板 | `-` |
| close | 关闭面板 | `-` |
| clear | 清空值 | `-` |

### Slots

当前版本以 props + events 为主，暂无对外自定义插槽。
