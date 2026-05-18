---
title: Empty 空状态
phone: empty
---

# Empty 空状态

用于数据为空、搜索无结果、网络异常、权限受限等场景的占位提示。组件内置一组 SVG 空态插画，也支持通过 `image` 或 `src` 覆盖为业务自定义图片。

## 基础用法

```vue
<template>
  <lk-empty />
</template>
```

## 内置插画

通过 `name` 选择内置插画，默认会带出对应标题和描述。

```vue
<template>
  <lk-empty name="search" />
  <lk-empty name="network" />
  <lk-empty name="permission" />
</template>
```

内置名称：`empty`、`search`、`network`、`error`、`permission`、`inbox`、`cart`、`favorite`。

## 自定义文案

```vue
<template>
  <lk-empty
    name="search"
    title="没有匹配内容"
    description="调整筛选条件后重新搜索"
  />
</template>
```

## 自定义图片

`image` 优先级高于 `src`，两者都高于内置 `name` 插画。

```vue
<template>
  <lk-empty
    image="https://example.com/empty.svg"
    title="门店暂未营业"
    description="稍后再来看看"
  />
</template>
```

## 跟随品牌色

内置插画默认读取 Lucky UI 当前品牌色生成 SVG。组件本身不会修改全局主题；只有业务主动切换主题色时，空态插画才会同步刷新。

```vue
<template>
  <lk-empty name="empty" />
</template>
```

## 自定义颜色

需要单独指定某个空态的颜色时，可使用 `color` 覆盖当前品牌色。该配置只影响当前 `lk-empty`，适合在 Demo 或局部业务场景中做颜色预览，不会改动全局品牌色。

```vue
<template>
  <lk-empty name="cart" color="#13c2c2" />
</template>
```

## 操作区

```vue
<template>
  <lk-empty name="network">
    <template #action>
      <lk-button size="sm">重新加载</lk-button>
    </template>
  </lk-empty>
</template>
```

## 布局模式

```vue
<template>
  <lk-empty layout="compact" :image-size="160" />
  <lk-empty layout="page" name="permission" />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| name | 内置插画名称 | `string` | `empty / search / network / error / permission / inbox / cart / favorite` | `empty` |
| image | 自定义图片地址，优先级最高 | `string` | — | `''` |
| src | 自定义图片地址别名，优先级低于 `image` | `string` | — | `''` |
| title | 主标题 | `string` | — | 内置文案 |
| description | 副描述 | `string` | — | 内置文案 |
| imageSize | 插画尺寸，数字按 `rpx` 处理 | `string / number` | — | `240` |
| color | 内置插画主题色，默认跟随品牌色 | `string` | — | `''` |
| layout | 布局模式 | `string` | `default / compact / page` | `default` |
| showImage | 是否显示插画 | `boolean` | — | `true` |
| customClass | 自定义类名 | `string / object / array` | — | — |
| customStyle | 自定义样式 | `string / object` | — | — |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| load | 图片加载成功时触发 | `(event: unknown)` |
| error | 图片加载失败时触发 | `(event: unknown)` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| image | 自定义插画区域 |
| title | 自定义标题 |
| description | 自定义描述 |
| action | 底部操作区 |

## 主题定制

| CSS 变量 | 说明 | 默认值 |
|----------|------|--------|
| `--lk-empty-padding` | 容器内边距 | `var(--lk-spacing-xl) var(--lk-spacing-lg)` |
| `--lk-empty-title-color` | 标题颜色 | `var(--lk-text-primary)` |
| `--lk-empty-description-color` | 描述颜色 | `var(--lk-text-secondary)` |
| `--lk-empty-title-size` | 标题字号 | `var(--lk-font-size-lg)` |
| `--lk-empty-description-size` | 描述字号 | `var(--lk-font-size-sm)` |
| `--lk-empty-gap` | 标题与描述间距 | `var(--lk-spacing-sm)` |

## 兼容说明

内置插画通过 UniApp `<image>` 渲染 SVG data URI，不依赖 DOM、`v-html` 或远程网络。若当前运行端限制 data URI SVG，可通过 `image` 传入本地静态图片或 CDN 图片兜底。

## 素材许可

内置空态插画参考 ManyPixels 免费插画图库整理，只作为组件默认占位能力使用，不作为独立素材包、图库或下载器分发。详细记录见 [ManyPixels 空态插画来源说明](../assets/manypixels-empty-license)。
