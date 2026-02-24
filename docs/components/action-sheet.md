---
title: Action Sheet 动作面板
phone: action-sheet
---

# Action Sheet 动作面板

在页面底部弹出的操作菜单。

## 基础用法

```vue
<lk-action-sheet :actions="[{ name: '编辑' }, { name: '删除', color: '#f56c6c' }]" v-model:show="visible" />

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(true)
</script>
```

## 推荐示例

### 1) 直接复用项目 Demo（推荐）

```vue
<script setup lang="ts">
import ActionSheetDemo from '@/components/demos/action-sheet-demo.vue'
</script>

<template>
  <ActionSheetDemo />
</template>
```

### 2) 在业务页中按需组合

```vue
<template>
  <view class="page-demo">
    <lk-action-sheet />
  </view>
</template>
```

## API

### Props

- 组件参数较多，建议优先参考：`src/uni_modules/lucky-ui/components/lk-action-sheet/`
- 交互行为与默认值以 `*.props.ts` 为准

### Events

- 事件名称与参数说明以组件源码和对应 demo 为准

### Slots

- 插槽能力以组件模板实现为准（建议结合 demo 对照使用）
