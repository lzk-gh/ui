---
title: Textarea 文本域
phone: textarea
---

# Textarea 文本域

用于输入较长文本内容，适合意见反馈、备注说明、评论回复等多行编辑场景。

## 交互式调试

<PropsPlayground
  component="textarea"
  :props-def="[
    { key: 'variant', type: 'enum', label: '变体', values: ['outline', 'filled', 'flush'], default: 'outline' },
    { key: 'placeholder', type: 'string', label: '占位文本', default: '请输入内容' },
    { key: 'maxlength', type: 'number', label: '最大长度', default: 140 },
    { key: 'disabled', type: 'boolean', label: '禁用', default: false },
    { key: 'autoHeight', type: 'boolean', label: '自适应高度', default: false },
    { key: 'showCount', type: 'boolean', label: '字数统计', default: false },
    { key: 'clearable', type: 'boolean', label: '可清除', default: false },
  ]"
/>

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const content = ref('')
</script>

<template>
  <lk-textarea v-model="content" placeholder="请输入内容" />
</template>
```

## 风格变体

组件内置 `outline`、`filled`、`flush` 三种视觉风格。

```vue
<template>
  <lk-textarea placeholder="默认描边" variant="outline" />
  <lk-textarea placeholder="填充风格" variant="filled" />
  <lk-textarea placeholder="无边框列表态" variant="flush" />
</template>
```

## 自动增高与字数统计

```vue
<script setup lang="ts">
import { ref } from 'vue'

const bio = ref('')
</script>

<template>
  <lk-textarea
    v-model="bio"
    auto-height
    :maxlength="200"
    show-count
    placeholder="请输入个人简介"
  />
</template>
```

## 清空按钮与底部扩展区

通过 `clearable` 提供快捷清空；通过 `footer` 和 `suffix` 插槽扩展底部辅助操作与右侧区域。

```vue
<template>
  <lk-textarea clearable placeholder="写评论...">
    <template #suffix>
      <lk-icon name="emoji-smile" />
    </template>

    <template #footer>
      <view class="quick-tags">
        <text>#推荐</text>
        <text>#好评</text>
      </view>
    </template>
  </lk-textarea>
</template>
```

## 与表单联动

传入与 `lk-form-item` 一致的 `prop`，可在失焦或清空时联动表单校验。

```vue
<template>
  <lk-form :model="form" :rules="rules">
    <lk-form-item label="备注" prop="remark">
      <lk-textarea v-model="form.remark" prop="remark" show-count :maxlength="100" />
    </lk-form-item>
  </lk-form>
</template>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import TextareaDemo from '@/components/demos/textarea-demo.vue'
</script>

<template>
  <TextareaDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-textarea />
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值 | `string` | `''` |
| label | 顶部标签文本 | `string` | `''` |
| placeholder | 占位内容 | `string` | `'请输入内容'` |
| placeholderClass | 占位样式类名 | `string` | `'lk-textarea__placeholder'` |
| variant | 风格变体 | `outline \| filled \| flush` | `outline` |
| disabled | 是否禁用 | `boolean` | `false` |
| maxlength | 最大输入长度，`-1` 表示不限制 | `number` | `-1` |
| autoHeight | 是否自动增高 | `boolean` | `false` |
| showCount | 是否显示字数统计 | `boolean` | `false` |
| clearable | 是否显示清空按钮 | `boolean` | `false` |
| confirmType | 键盘右下角按钮文字 | `send \| search \| next \| go \| done \| return \| string` | `return` |
| adjustPosition | 键盘弹起时是否自动上推页面 | `boolean` | `true` |
| cursorSpacing | 光标与键盘距离 | `number` | `0` |
| fixed | 是否展示在键盘上方 | `boolean` | `false` |
| prop | 表单字段名 | `string` | `''` |
| validateEvent | 是否触发表单验证联动 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 输入值变化 | `(value: string) => void` |
| input | 输入过程中触发 | `(value: string) => void` |
| change | 失焦或清空后的最终值变化 | `(value: string) => void` |
| focus | 聚焦时触发 | `(event: unknown) => void` |
| blur | 失焦时触发 | `(event: unknown) => void` |
| confirm | 点击键盘确认按钮 | `(event: unknown) => void` |
| clear | 点击清空按钮 | `() => void` |
| linechange | 行数变化时触发 | `(event: unknown) => void` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| suffix | 右侧扩展区域，常用于表情、附件按钮 |
| footer | 底部扩展区域，位于计数左侧 |

## 使用建议

::: tip
如果是短文本输入，优先使用 `lk-input`；只有在内容可能换行时再使用 `lk-textarea`。
:::

::: warning
`showCount` 只有在 `maxlength !== -1` 时才有明确上限意义，建议配合 `maxlength` 一起使用。
:::
