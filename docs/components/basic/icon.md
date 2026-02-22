---
title: Icon 图标
phone: icon
---

# Icon 图标

`lk-icon` 基于字体图标方案，支持 **H5 / 微信小程序 / App** 统一渲染。
项目内置了完整的 **SVG 图标库 → 字体图标** 构建链路，业务可直接扩展。

## Showtime：为什么这套方案很强

- SVG 批量筛选与锁定（可控体积）
- 一键构建字体与映射（自动生成 `codepoints.ts`）
- 跨端统一调用（`<lk-icon name="..." />`）
- 图标名即 SVG 文件名，学习与维护成本低

## 基础用法

```vue
<template>
  <view class="demo-row">
    <lk-icon name="house" />
    <lk-icon name="heart" />
    <lk-icon name="star" />
    <lk-icon name="bell" />
    <lk-icon name="person" />
  </view>
</template>
```

## 工程化工作流（SVG → 字体图标）

```bash
pnpm run icons:prepare
pnpm run icons:build
```

### 流程说明

1. `icons:prepare`：按规则筛选 SVG 到 `assets/bootstrap-icons-selected`
2. `icons:build`：生成字体文件、`lk-icons.css` 与 `codepoints.ts`
3. 组件直接使用 `name` 渲染，无需手写 unicode

### 关键文件

- 图标筛选配置：`src/uni_modules/lucky-ui/scripts/iconset.mobile.config.js`
- 选择脚本：`src/uni_modules/lucky-ui/scripts/prepare-mobile-icons.js`
- 构建脚本：`src/uni_modules/lucky-ui/scripts/build-icons.svgtofont.js`
- 生成映射：`src/uni_modules/lucky-ui/components/lk-icon/codepoints.ts`

## 尺寸

通过 `size` 设置像素尺寸（单位 px，组件内部自动转 rpx）。

```vue
<template>
  <view class="demo-row">
    <lk-icon name="star" :size="16" />
    <lk-icon name="star" :size="24" />
    <lk-icon name="star" :size="32" />
    <lk-icon name="star" :size="48" />
  </view>
</template>
```

## 颜色

```vue
<template>
  <view class="demo-row">
    <lk-icon name="heart-fill" color="#ef4444" />
    <lk-icon name="patch-check-fill" color="#22c55e" />
    <lk-icon name="lightning-charge-fill" color="#f59e0b" />
    <lk-icon name="info-circle-fill" color="#3b82f6" />
    <lk-icon name="shield-fill" color="var(--lk-color-primary)" />
  </view>
</template>
```

## 业务自定义图标库示例

只要你的 SVG 进入构建目录，文件名就能直接作为图标名使用。

```vue
<template>
  <view class="demo-row">
    <lk-icon name="wallet" color="primary" />
    <lk-icon name="shield-check" color="success" />
    <lk-icon name="lightning-charge" color="warning" />
    <lk-icon name="chat-dots" color="info" />
  </view>
</template>
```

## 与文字/按钮组合

```vue
<template>
  <view class="demo-col">
    <!-- 与文字组合 -->
    <view style="display:flex; align-items:center; gap:8rpx">
      <lk-icon name="geo-alt-fill" color="var(--lk-color-primary)" :size="18" />
      <text>北京市朝阳区</text>
    </view>

    <!-- 作为按钮前缀 -->
    <lk-button>
      <lk-icon name="upload" style="margin-right:8rpx" />
      上传图片
    </lk-button>

    <!-- 独立操作图标 -->
    <view class="demo-row">
      <lk-icon name="trash" color="#ef4444" :size="22" />
      <lk-icon name="pencil" color="var(--lk-color-primary)" :size="22" />
      <lk-icon name="share" color="#64748b" :size="22" />
    </view>
  </view>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 图标名称 | `string` | — |
| size | 图标尺寸（px） | `number \| string` | `24` |
| color | 图标颜色 | `string` | 继承文本色 |
| customClass | 额外类名 | `string` | `''` |
| customStyle | 额外样式 | `string \| object` | `''` |

### Events

| 事件名 | 说明 |
|--------|------|
| click | 图标点击 |

::: tip 图标名称规则
- 图标名使用**小写连字符**形式，例如 `chevron-right`、`arrow-up-circle`
- 当前可用图标清单以 `codepoints.ts` 为准
- 你可以继续基于配置扩充 SVG 集合并重新构建
:::
