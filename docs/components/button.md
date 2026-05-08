---
title: Button 按钮
phone: button
---

# Button 按钮

用于触发页面主操作、次操作和文本操作，支持变体、尺寸、形状、加载态、禁用态和小程序开放能力。

## 基础用法

```vue
<template>
  <lk-button>默认按钮</lk-button>
  <lk-button variant="outline">描边按钮</lk-button>
  <lk-button variant="soft">柔和按钮</lk-button>
  <lk-button variant="text">文本按钮</lk-button>
</template>
```

## 状态与尺寸

```vue
<template>
  <lk-button size="sm">小按钮</lk-button>
  <lk-button size="md">中按钮</lk-button>
  <lk-button size="lg" block>块级按钮</lk-button>
  <lk-button loading>加载中</lk-button>
  <lk-button disabled>禁用</lk-button>
</template>
```

## 图标与形状

```vue
<template>
  <lk-button icon="search">搜索</lk-button>
  <lk-button shape="round">胶囊按钮</lk-button>
  <lk-button shape="circle">
    <lk-icon name="plus" />
  </lk-button>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| variant | 按钮变体 | `solid / outline / soft / text` | `solid` |
| size | 尺寸 | `sm / md / lg` | `md` |
| shape | 形状 | `default / square / round / circle` | `default` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| block | 是否块级 | `boolean` | `false` |
| icon | 左侧图标名 | `string` | `''` |
| nativeType | 表单行为 | `button / submit / reset` | `button` |
| openType | 小程序开放能力 | `string` | `''` |
| customClass | 自定义类名 | `string / object / array` | — |
| customStyle | 自定义样式 | `string / object` | — |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击按钮时触发 | `(event: Event)` |
| getphonenumber | 获取手机号回调 | `(event: Event)` |
| chooseavatar | 获取头像回调 | `(event: Event)` |

## 发布说明

`lk-button` 已进入首批 Release Candidate。开放能力依赖各小程序平台原生 `button` 能力，发布文档中需声明平台差异。

