---
title: Date Picker 日期选择器
phone: date-picker
---

# Date Picker 日期选择器

基于 `lk-popup` 与 `lk-calendar` 组合的日期弹层选择器，适合需要“点击按钮打开面板再确认”的日期输入场景。

## 何时使用

- 表单中需要弹层确认日期
- 需要日期、日期范围、多选、年月、日期时间等多种模式
- 需要在选择完成后统一点击“确定”提交时

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const date = ref(new Date())

function onConfirm(value: Date | [Date, Date] | Date[] | null) {
  if (value instanceof Date) date.value = value
}
</script>

<template>
  <lk-button @click="visible = true">选择日期</lk-button>
  <lk-date-picker v-model="visible" :value="date" @confirm="onConfirm" />
</template>
```

## 年月选择

```vue
<lk-date-picker v-model="visible" :value="date" type="year-month" @confirm="onConfirm" />
```

## 日期范围

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const range = ref<[Date, Date]>([new Date(), new Date(Date.now() + 86400000)])

function onConfirm(value: Date | [Date, Date] | Date[] | null) {
  if (Array.isArray(value) && value.length === 2) {
    range.value = value as [Date, Date]
  }
}
</script>

<template>
  <lk-date-picker v-model="visible" :value="range" type="range" @confirm="onConfirm" />
</template>
```

## 多选日期

```vue
<lk-date-picker v-model="visible" :value="dates" type="multiple" @confirm="onConfirm" />
```

## 日期时间

组件支持在日历选择后继续补充时间部分，适合预约、排期等场景。

```vue
<lk-date-picker
  v-model="visible"
  :value="dateTime"
  type="date-time"
  time-precision="minute"
  @confirm="onConfirm"
/>
```

## 日期时间范围

```vue
<lk-date-picker
  v-model="visible"
  :value="rangeDateTime"
  type="range-date-time"
  time-precision="minute"
  @confirm="onConfirm"
/>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import DatePickerDemo from '@/components/demos/date-picker-demo.vue'
</script>

<template>
  <DatePickerDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-date-picker />
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| modelValue | 是否显示面板，兼容默认 `v-model` | `boolean` | — | `false` |
| show | 是否显示面板，支持 `v-model:show` | `boolean` | — | `undefined` |
| value | 当前已选值 | `Date / string / number / array / null` | — | `null` |
| type | 选择器类型 | `string` | `date / range / year-month / multiple / time / date-time / range-date-time` | `date` |
| pickerMode | 展示模式 | `string` | `auto / calendar / wheel` | `auto` |
| title | 面板标题 | `string` | — | `选择日期` |
| color | 主题色 | `string` | — | `primary` |
| valueType | 输出值类型 | `string` | `date / string / timestamp` | `date` |
| valueFormat | 字符串输出格式 | `string` | — | `YYYY-MM-DD` |
| firstDay | 每周第一天 | `number` | — | `1` |
| view | 日历视图 | `string` | `month / week / scroll` | `month` |
| showViewToggle | 是否显示月/周/滚动切换 | `boolean` | — | `false` |
| showShortcuts | 是否显示快捷方式 | `boolean` | — | `false` |
| showLunar | 是否显示农历 | `boolean` | — | `true` |
| showFestival | 是否显示节日 | `boolean` | — | `true` |
| showSolarTerm | 是否显示二十四节气 | `boolean` | — | `true` |
| showHoliday | 是否显示休/班 | `boolean` | — | `true` |
| disabledDate | 禁用日期函数 | `(date: Date) => boolean` | — | `undefined` |
| minDate | 最小日期 | `Date / string / null` | — | `null` |
| maxDate | 最大日期 | `Date / string / null` | — | `null` |
| maxCount | 多选最大数量，`0` 表示不限制 | `number` | — | `0` |
| minRange | 最小区间天数 | `number` | — | `0` |
| maxRange | 最大区间天数 | `number` | — | `0` |
| confirmOnSelect | 选择后是否立即确认 | `boolean` | — | `false` |
| timePrecision | 时间精度 | `string` | `hour / minute / second` | `minute` |
| stepHour | 小时步长 | `number` | — | `1` |
| stepMinute | 分钟步长 | `number` | — | `1` |
| stepSecond | 秒步长 | `number` | — | `1` |
| id | 根节点 id | `string` | — | `''` |
| customClass | 自定义类名 | `string / object / array` | — | `''` |
| customStyle | 自定义样式 | `string / object` | — | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 面板显隐变化 | `(visible: boolean)` |
| update:show | 面板显隐变化，配合 `v-model:show` | `(visible: boolean)` |
| update:value | 点击确定后更新值 | `(value: DatePickerValue)` |
| select | 面板内草稿值变化时触发 | `(value: DatePickerValue)` |
| change | 点击确定后触发 | `(value: DatePickerValue)` |
| confirm | 点击确定后返回所选值 | `(value: DatePickerValue)` |
| cancel | 点击取消或关闭时触发，返回当前草稿值 | `(value: DatePickerValue)` |
| open | 面板打开时触发 | `()` |
| close | 面板关闭时触发 | `()` |

### Slots

当前版本无对外插槽。

## 使用建议

::: tip
如果只是页面内直接点选日期，优先使用 `lk-calendar`；如果需要弹层确认流程，优先使用 `lk-date-picker`。
:::

::: warning
该组件的 `v-model` 控制的是“面板是否显示”，真正的日期值通过 `value` 传入，并通过 `confirm` 返回。
:::
