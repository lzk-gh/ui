---
title: Input 输入框
phone: input
---

# Input 输入框

单行文本输入框，支持清空、前缀图标、字数统计等常见功能。

## 交互式调试

<PropsPlayground
  component="input"
  :props-def="[
    { key: 'size', type: 'enum', label: '尺寸', values: ['sm', 'md', 'lg'], default: 'md' },
    { key: 'type', type: 'enum', label: '输入类型', values: ['text', 'password', 'number', 'tel', 'email'], default: 'text' },
    { key: 'placeholder', type: 'string', label: '占位文本', default: '请输入' },
    { key: 'disabled', type: 'boolean', label: '禁用', default: false },
    { key: 'readonly', type: 'boolean', label: '只读', default: false },
    { key: 'clearable', type: 'boolean', label: '可清除', default: true },
    { key: 'showCount', type: 'boolean', label: '字数统计', default: false },
  ]"
/>

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
const val = ref('')
</script>

<template>
  <lk-input v-model="val" placeholder="请输入内容" />
</template>
```

## 输入类型

```vue
<template>
  <view class="demo-col">
    <lk-input type="text" placeholder="文本输入" />
    <lk-input type="password" placeholder="密码输入" />
    <lk-input type="number" placeholder="数字输入" />
    <lk-input type="tel" placeholder="电话号码" />
  </view>
</template>
```

## 前缀图标

```vue
<template>
  <view class="demo-col">
    <lk-input prefix-icon="search" placeholder="搜索..." />
    <lk-input prefix-icon="person" placeholder="用户名" />
    <lk-input prefix-icon="lock" type="password" placeholder="密码" />
    <lk-input prefix-icon="envelope" type="email" placeholder="电子邮箱" />
  </view>
</template>
```

## 尺寸

```vue
<template>
  <view class="demo-col">
    <lk-input size="sm" placeholder="小尺寸" />
    <lk-input size="md" placeholder="中尺寸（默认）" />
    <lk-input size="lg" placeholder="大尺寸" />
  </view>
</template>
```

## 可清空 & 字数统计

```vue
<script setup lang="ts">
import { ref } from 'vue'
const bio = ref('')
</script>

<template>
  <!-- clearable 默认已启用 -->
  <lk-input v-model="bio" placeholder="请输入昵称" clearable />

  <!-- 字数统计（配合 maxlength） -->
  <lk-input
    v-model="bio"
    placeholder="一句话介绍自己"
    :maxlength="50"
    show-count
  />
</template>
```

## 禁用 & 只读

```vue
<template>
  <view class="demo-col">
    <lk-input value="禁用状态" disabled />
    <lk-input value="只读状态" readonly />
  </view>
</template>
```

## 与表单验证结合

```vue
<script setup lang="ts">
import { ref } from 'vue'
const formRef = ref()
const form = ref({ username: '', phone: '' })

async function submit() {
  await formRef.value.validate()
}
</script>

<template>
  <lk-form ref="formRef" :model="form">
    <lk-form-item
      label="用户名"
      prop="username"
      :rules="[{ required: true, message: '请输入用户名' }]"
    >
      <lk-input v-model="form.username" prefix-icon="person" placeholder="请输入用户名" />
    </lk-form-item>
    <lk-form-item
      label="手机号"
      prop="phone"
      :rules="[
        { required: true, message: '请输入手机号' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
      ]"
    >
      <lk-input v-model="form.phone" type="tel" prefix-icon="phone" placeholder="请输入手机号" />
    </lk-form-item>
    <lk-button block @click="submit">提交</lk-button>
  </lk-form>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值（v-model） | `string \| number` | `''` |
| type | 输入类型 | `text \| password \| number \| tel \| email` | `text` |
| size | 尺寸 | `sm \| md \| lg` | `md` |
| placeholder | 占位文字 | `string` | `''` |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |
| clearable | 是否显示清空按钮 | `boolean` | `true` |
| maxlength | 最大长度（-1 不限） | `number` | `-1` |
| showCount | 是否显示字数统计 | `boolean` | `false` |
| prefixIcon | 前缀图标名 | `string` | `''` |
| autofocus | 是否自动聚焦 | `boolean` | `false` |
| prop | 表单字段名（配合 Form 校验） | `string` | `''` |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 值变化 | `(value: string) => void` |
| input | 输入时触发 | `(value: string) => void` |
| change | 失焦后值变化时触发 | `(value: string) => void` |
| focus | 聚焦 | `(event: Event) => void` |
| blur | 失焦 | `(event: Event) => void` |
| clear | 点击清空按钮 | `() => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| prefix | 前缀自定义内容 |
| suffix | 后缀自定义内容 |
