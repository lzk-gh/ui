---
title: Cell 单元格
phone: cell
---

# Cell 单元格

列表中最常见的展示行，适用于设置页、信息列表等场景。

## 基础用法

```vue
<template>
  <lk-cell-group>
    <lk-cell title="个人信息" value="查看" />
    <lk-cell title="收货地址" value="北京市朝阳区" />
    <lk-cell title="支付方式" value="微信支付" arrow />
  </lk-cell-group>
</template>
```

## 带图标

```vue
<template>
  <lk-cell-group>
    <lk-cell title="消息通知" prefix-icon="bell" arrow />
    <lk-cell title="账号安全" prefix-icon="shield-lock" arrow />
    <lk-cell title="隐私设置" prefix-icon="eye-slash" arrow />
    <lk-cell title="帮助中心" prefix-icon="question-circle" arrow />
  </lk-cell-group>
</template>
```

## 带描述（label）

```vue
<template>
  <lk-cell-group>
    <lk-cell
      title="当前版本"
      value="v1.2.0"
      label="已是最新版本"
    />
    <lk-cell
      title="存储空间"
      value="128 GB"
      label="已使用 48.6 GB"
    />
  </lk-cell-group>
</template>
```

## 右侧自定义内容

```vue
<script setup lang="ts">
import { ref } from 'vue'
const notify = ref(true)
</script>

<template>
  <lk-cell-group>
    <lk-cell title="消息推送" prefix-icon="bell">
      <template #value>
        <lk-switch v-model="notify" size="sm" />
      </template>
    </lk-cell>
    <lk-cell title="我的标签" prefix-icon="tag">
      <template #value>
        <view style="display:flex; gap:8rpx">
          <lk-tag size="sm" type="success">前端</lk-tag>
          <lk-tag size="sm">UI</lk-tag>
        </view>
      </template>
    </lk-cell>
  </lk-cell-group>
</template>
```

## 分组标题 & 卡片样式

```vue
<template>
  <lk-cell-group title="账号设置" card>
    <lk-cell title="修改头像" prefix-icon="person-circle" arrow clickable />
    <lk-cell title="修改昵称" prefix-icon="pencil" arrow clickable />
    <lk-cell title="绑定手机" prefix-icon="phone" value="已绑定" arrow clickable />
  </lk-cell-group>
</template>
```

## API

### CellGroup Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 分组标题 | `string` | `''` |
| border | 是否显示边框 | `boolean` | `true` |
| card | 卡片样式（带圆角和阴影） | `boolean` | `false` |
| inset | 内嵌圆角样式 | `boolean` | `false` |

### Cell Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 左侧标题 | `string` | `''` |
| value | 右侧内容 | `string` | `''` |
| label | 标题下方描述 | `string` | `''` |
| prefixIcon | 左侧图标名 | `string` | `''` |
| arrow | 显示右侧箭头 | `boolean` | `false` |
| clickable | 开启点击高亮 | `boolean` | `false` |
| required | 显示必填星号 | `boolean` | `false` |
| valueColor | 右侧文字颜色 | `string` | — |

### Cell Events

| 事件名 | 说明 |
|--------|------|
| click | 点击单元格 |

### Cell Slots

| 插槽名 | 说明 |
|--------|------|
| default / value | 右侧完全自定义 |
| title | 左侧标题自定义 |
| icon | 左侧图标自定义 |
