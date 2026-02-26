---
title: Radio 单选框
phone: radio
---

# Radio 单选框

在一组选项中进行单项选择，通常配合 `RadioGroup` 使用。

## 交互式调试

<PropsPlayground
  component="radio"
  :props-def="[
    { key: 'disabled', type: 'boolean', label: '禁用', default: false },
  ]"
  slot-content="单选框"
/>

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
const checked = ref('A')
</script>

<template>
  <lk-radio-group v-model="checked">
    <lk-radio name="A">选项 A</lk-radio>
    <lk-radio name="B">选项 B</lk-radio>
    <lk-radio name="C">选项 C</lk-radio>
  </lk-radio-group>
  <view>当前选中：{{ checked }}</view>
</template>
```

## 横向排列

```vue
<script setup lang="ts">
import { ref } from 'vue'
const plan = ref('lite')
</script>

<template>
  <lk-radio-group v-model="plan" direction="row">
    <lk-radio name="lite">基础版</lk-radio>
    <lk-radio name="pro">专业版</lk-radio>
    <lk-radio name="enterprise">企业版</lk-radio>
  </lk-radio-group>
</template>
```

## 图标类型

```vue
<template>
  <!-- dot（默认）：选中显示中心圆点 -->
  <lk-radio-group v-model="val" icon-type="dot">
    <lk-radio name="1">选项 1</lk-radio>
    <lk-radio name="2">选项 2</lk-radio>
  </lk-radio-group>

  <!-- check：选中显示勾选图标 -->
  <lk-radio-group v-model="val" icon-type="check">
    <lk-radio name="1">选项 1</lk-radio>
    <lk-radio name="2">选项 2</lk-radio>
  </lk-radio-group>
</template>
```

## 方形外观

```vue
<template>
  <lk-radio-group v-model="val" shape="square">
    <lk-radio name="yes">同意</lk-radio>
    <lk-radio name="no">不同意</lk-radio>
  </lk-radio-group>
</template>
```

## 禁用状态

```vue
<template>
  <!-- 整组禁用 -->
  <lk-radio-group v-model="val" disabled>
    <lk-radio name="A">选项 A（禁用）</lk-radio>
    <lk-radio name="B">选项 B（禁用）</lk-radio>
  </lk-radio-group>

  <!-- 单项禁用 -->
  <lk-radio-group v-model="val2">
    <lk-radio name="X">可选</lk-radio>
    <lk-radio name="Y" disabled>不可选</lk-radio>
    <lk-radio name="Z">可选</lk-radio>
  </lk-radio-group>
</template>
```

## 自定义选中颜色

```vue
<template>
  <lk-radio-group v-model="val" active-color="#f59e0b">
    <lk-radio name="gold">黄金选项</lk-radio>
    <lk-radio name="silver">白银选项</lk-radio>
  </lk-radio-group>
</template>
```

## 与表单结合

```vue
<script setup lang="ts">
import { ref } from 'vue'
const gender = ref('male')
const agree = ref(false)
</script>

<template>
  <lk-form>
    <lk-form-item label="性别" required>
      <lk-radio-group v-model="gender" direction="row">
        <lk-radio name="male">男</lk-radio>
        <lk-radio name="female">女</lk-radio>
      </lk-radio-group>
    </lk-form-item>
  </lk-form>
</template>
```

## API

### RadioGroup Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值（v-model） | `string \| number \| boolean` | `''` |
| direction | 排列方向 | `row \| column` | `row` |
| shape | 外观形状 | `circle \| square` | `circle` |
| iconType | 图标样式 | `dot \| check` | `dot` |
| size | 尺寸 | `sm \| md \| lg` | `md` |
| disabled | 是否全部禁用 | `boolean` | `false` |
| activeColor | 选中颜色 | `string` | — |

### RadioGroup Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 绑定值变化 | `(value: any) => void` |
| change | 选项改变 | `(value: any) => void` |

### Radio Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 唯一标识符（作为选中值） | `string \| number \| boolean` | `''` |
| label | 标签文字（等价于 default slot） | `string` | `''` |
| disabled | 是否禁用该项 | `boolean` | `false` |
| labelDisabled | 点击文字是否触发选择 | `boolean` | `false` |
| shape | 覆盖 group 的形状 | `circle \| square` | — |
| iconType | 覆盖 group 的图标类型 | `dot \| check` | — |
| activeColor | 覆盖 group 的选中色 | `string` | — |
| iconSize | 图标尺寸 | `string \| number` | — |

### Radio Slots

| 插槽名 | 说明 |
|--------|------|
| default | 标签内容 |
| icon | 自定义选中图标（参数：`{ checked, disabled }`） |
