---
title: Calendar 日历
phone: calendar
---

# Calendar 日历

用于按月展示日期并完成单选、范围选择、多选等操作，适合签到、排期、预约、统计筛选等场景。

## 何时使用

- 需要在月历中直接选择日期时
- 需要连续日期范围时
- 需要多选若干离散日期时
- 需要配合最小/最大日期或禁用规则限制选择范围时

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(new Date())
</script>

<template>
  <lk-calendar v-model="value" />
</template>
```

## 范围选择

```vue
<script setup lang="ts">
import { ref } from 'vue'

const range = ref<[Date, Date]>([
  new Date(),
  new Date(Date.now() + 7 * 24 * 3600 * 1000),
])
</script>

<template>
  <lk-calendar v-model="range" type="range" />
</template>
```

## 多选日期

```vue
<script setup lang="ts">
import { ref } from 'vue'

const dates = ref<Date[]>([])
</script>

<template>
  <lk-calendar v-model="dates" type="multiple" :max-count="5" />
</template>
```

## 限制可选范围

```vue
<script setup lang="ts">
const disabledDate = (date: Date) => date < new Date()
</script>

<template>
  <lk-calendar
    v-model="value"
    :min-date="new Date()"
    :max-date="'2026-12-31'"
    :disabled-date="disabledDate"
  />
</template>
```

## 快捷方式与值格式

如果你希望返回字符串而不是 `Date`，可通过 `valueType` 和 `valueFormat` 控制输出格式。

```vue
<lk-calendar
  v-model="dateText"
  show-shortcuts
  value-type="string"
  value-format="YYYY-MM-DD"
/>
```

## 月视图与周视图切换

当前组件支持月/周/连续滚动视图，也支持左右滑动切换月份。

## 监听用户动作

```vue
<lk-calendar
  v-model="date"
  show-shortcuts
  @click-day="handleClickDay"
  @click-disabled="handleDisabled"
  @shortcut="handleShortcut"
  @swipe="handleSwipe"
/>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import CalendarDemo from '@/components/demos/calendar-demo.vue'
</script>

<template>
  <CalendarDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-calendar />
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值；根据 `type` 支持单值、范围值、多值 | `Date \| string \| [Date \| string, Date \| string] \| Array<Date \| string> \| null` | `null` |
| type | 选择模式 | `single \| range \| multiple` | `single` |
| mode | 选择模式，新 API，优先级高于 `type` | `single \| range \| multiple \| week \| month \| readonly` | `''` |
| view | 视图模式 | `month \| week \| scroll` | `month` |
| color | 主题色 | `string` | `primary` |
| disabledDate | 禁用日期函数 | `(date: Date) => boolean` | `undefined` |
| disabledWeekDays | 禁用星期，`0` 表示周日 | `number[]` | `[]` |
| minDate | 最小日期 | `Date \| string \| null` | `null` |
| maxDate | 最大日期 | `Date \| string \| null` | `null` |
| min | 最小日期字符串，兼容旧写法 | `string` | `''` |
| max | 最大日期字符串，兼容旧写法 | `string` | `''` |
| firstDay | 每周第一天，`0` 为周日 | `number` | `1` |
| showHeader | 是否显示头部 | `boolean` | `true` |
| showViewToggle | 是否显示月/周/滚动视图切换 | `boolean` | `true` |
| visibleMonthCount | 连续滚动模式展示月份数 | `number` | `6` |
| scrollHeight | 连续滚动容器高度 | `string \| number` | `720` |
| swipeThreshold | 横滑切月距离阈值，`0` 使用平台默认值 | `number` | `0` |
| swipeAngleRatio | 横滑切月横纵比阈值，`0` 使用平台默认值 | `number` | `0` |
| showShortcuts | 是否显示快捷方式 | `boolean` | `false` |
| showToday | 是否显示今天标识 | `boolean` | `true` |
| showLunar | 是否显示农历 | `boolean` | `true` |
| showFestival | 是否显示节日 | `boolean` | `true` |
| showSolarTerm | 是否显示二十四节气 | `boolean` | `true` |
| showHoliday | 是否显示休/班标识 | `boolean` | `true` |
| useBuiltinHoliday | 是否使用内置节假日数据 | `boolean` | `true` |
| holidayData | 自定义节假日/调休数据 | `CalendarHolidayItem[]` | `[]` |
| extraData | 业务日期扩展数据 | `CalendarDayExtra[]` | `[]` |
| maxCount | 多选模式下最大选择数量，`0` 表示不限制 | `number` | `0` |
| minRange | 最小区间天数 | `number` | `0` |
| maxRange | 最大区间天数 | `number` | `0` |
| readonly | 是否只读 | `boolean` | `false` |
| confirmOnSelect | 选择后是否立即触发 `confirm` | `boolean` | `false` |
| valueType | 返回值类型 | `date \| string` | `date` |
| valueFormat | 字符串格式化模板 | `string` | `YYYY-MM-DD` |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 值变化 | `(value) => void` |
| change | 值变化回调 | `(value) => void` |
| select | 日期被选中时触发 | `({ date, dateKey, day }) => void` |
| confirm | `confirmOnSelect` 开启后，选择完成时触发 | `(value) => void` |
| month-change | 月份切换 | `({ year, month }) => void` |
| view-change | 视图切换 | `(view: 'month' \| 'week' \| 'scroll') => void` |
| range-progress | 范围选择过程变化 | `([start, end]) => void` |
| click-day | 点击可选日期时触发 | `({ date, dateKey, day }) => void` |
| click-disabled | 点击禁用或只读日期时触发 | `({ date, dateKey, day }) => void` |
| shortcut | 点击快捷项后触发 | `({ type, value }) => void` |
| swipe | 横滑切换月份时触发 | `({ direction, year, month }) => void` |
| clear | 清空选择时触发 | `() => void` |

### Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| day | 自定义日期单元格内容 | `{ day: CalendarDay }` |

## 使用建议

::: tip
业务侧如果只关心字符串日期，优先使用 `valueType="string"`，可减少额外格式化逻辑。
:::

::: warning
范围模式下建议同时设置 `minDate` / `maxDate` 或 `disabledDate`，避免用户选到业务上不可提交的日期区间。
:::
