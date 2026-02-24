---
title: Badge 徽标
phone: badge
---

# Badge 徽标

在图标、按钮或内容上标注通知数字或状态点。

## 基础用法

```vue
<template>
  <view class="demo-row">
    <lk-badge :count="3">
      <lk-button>消息</lk-button>
    </lk-badge>
    <lk-badge dot>
      <lk-icon name="bell" :size="28" />
    </lk-badge>
    <lk-badge text="新">
      <lk-button>功能</lk-button>
    </lk-badge>
  </view>
</template>
```

## 最大值

超过 `max` 时显示 `max+`。

```vue
<template>
  <view class="demo-row">
    <lk-badge :count="5" :max="99"><lk-icon name="chat" :size="28" /></lk-badge>
    <lk-badge :count="100" :max="99"><lk-icon name="chat" :size="28" /></lk-badge>
    <lk-badge :count="999" :max="99"><lk-icon name="chat" :size="28" /></lk-badge>
  </view>
</template>
```

## 颜色类型

```vue
<template>
  <view class="demo-row">
    <lk-badge :count="8" type="danger"><lk-icon name="bell" :size="28" /></lk-badge>
    <lk-badge :count="8" type="success"><lk-icon name="bell" :size="28" /></lk-badge>
    <lk-badge :count="8" type="warning"><lk-icon name="bell" :size="28" /></lk-badge>
    <lk-badge :count="8" type="info"><lk-icon name="bell" :size="28" /></lk-badge>
  </view>
</template>
```

## 独立使用

不包裹子内容时，作为纯徽标展示。

```vue
<template>
  <view class="demo-row" style="align-items:center">
    <lk-badge :count="12" />
    <lk-badge dot />
    <lk-badge text="HOT" type="danger" />
    <lk-badge text="NEW" type="success" />
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| count | 显示数字 | `number` | `0` |
| max | 数字上限，超出显示 `max+` | `number` | `99` |
| dot | 显示小红点 | `boolean` | `false` |
| text | 显示文字（优先于 count） | `string` | `''` |
| type | 颜色类型 | `danger \| success \| warning \| info` | `danger` |
| showZero | count=0 时是否显示 | `boolean` | `false` |
| offset | 徽标偏移量 `[x, y]` | `[number, number]` | `[0, 0]` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 被徽标包裹的内容 |
