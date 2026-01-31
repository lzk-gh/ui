---
title: Tabbar 底部导航
---

# Tabbar 底部导航

页面底部的导航切换栏，支持三种视觉风格模式，配备丝滑的动画效果。

## 特性

- 🎨 **三种模式**：Fixed（简约）、Slider（滑块）、Bump（中间凸起）
- ✨ **丝滑动画**：使用 `cubic-bezier` 贝塞尔曲线，点击有缩放回弹效果
- 📱 **安全区适配**：完美适配 iPhone X 等机型的底部安全区域
- 🎭 **毛玻璃效果**：支持 `glassBg` 实现磨砂玻璃质感
- 🔢 **徽标支持**：数字徽标、小红点、脉冲动画
- 🎯 **跟随品牌色**：默认使用系统品牌色，支持自定义

## 基础用法 - Fixed 模式

简约风格，仅颜色渐变过渡，默认模式。

```vue
<template>
  <lk-tabbar v-model="active" mode="fixed">
    <lk-tabbar-item name="home" icon="house-fill" label="首页" />
    <lk-tabbar-item name="category" icon="grid-3x3-gap-fill" label="分类" />
    <lk-tabbar-item name="cart" icon="cart-fill" label="购物车" :badge="3" />
    <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
  </lk-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const active = ref('home');
</script>
```

## Slider 模式 - 滑块风格

Tabbar 背景有一个半透明滑块，切换时平滑移动到目标位置。

```vue
<template>
  <lk-tabbar v-model="active" mode="slider">
    <lk-tabbar-item name="home" icon="house-fill" label="首页" />
    <lk-tabbar-item name="discover" icon="compass-fill" label="发现" />
    <lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" dot />
    <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
  </lk-tabbar>
</template>
```

## Bump 模式 - 中间凸起风格

中间按钮悬浮突出（适合奇数个 Tab），点击有缩放回弹效果。

```vue
<template>
  <lk-tabbar v-model="active" mode="bump" :border="false">
    <lk-tabbar-item name="home" icon="house-fill" label="首页" />
    <lk-tabbar-item name="discover" icon="compass-fill" label="发现" />
    <lk-tabbar-item name="add" icon="plus-lg" label="" />
    <lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" />
    <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
  </lk-tabbar>
</template>
```

## List 配置模式

通过 `list` 属性传入配置数组，无需使用 slot。

```vue
<template>
  <lk-tabbar v-model="active" mode="slider" :list="tabbarList" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref(0);
const tabbarList = [
  { icon: 'house-fill', text: '首页' },
  { icon: 'compass-fill', text: '发现' },
  { icon: 'chat-dots-fill', text: '消息', badge: 12 },
  { icon: 'person-fill', text: '我的' },
];
</script>
```

## 毛玻璃效果

开启 `glassBg` 呈现磨砂玻璃质感。

```vue
<lk-tabbar v-model="active" glass-bg :border="false">
  <!-- items -->
</lk-tabbar>
```

## 选中态图标切换

支持未选中/选中使用不同图标。

```vue
<lk-tabbar-item 
  name="home" 
  icon="house" 
  selected-icon="house-fill" 
  label="首页" 
/>
```

## LkTabbar Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前激活项的索引或 name | `string \| number` | `0` |
| mode | 模式：`fixed` / `slider` / `bump` | `string` | `'fixed'` |
| list | 导航项配置数组（简化用法） | `TabbarItemConfig[]` | `[]` |
| fixed | 是否固定在底部 | `boolean` | `true` |
| safeArea | 是否适配底部安全区域 | `boolean` | `true` |
| border | 是否显示顶部边框线 | `boolean` | `true` |
| activeColor | 激活项颜色（默认品牌色） | `string` | - |
| inactiveColor | 未激活项颜色 | `string` | `#909399` |
| bgColor | 背景颜色 | `string` | - |
| glassBg | 是否启用毛玻璃效果 | `boolean` | `false` |
| switchPage | 点击是否跳转页面 | `boolean` | `false` |
| zIndex | 层级 | `number` | `300` |

## LkTabbarItem Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 唯一标识（必填） | `string \| number` | - |
| icon | 图标名称 | `string` | - |
| selectedIcon | 选中态图标名称 | `string` | - |
| label | 文字标签 | `string` | - |
| customIcon | 是否使用自定义图标（图片路径） | `boolean` | `false` |
| badge | 徽标数字 | `string \| number` | - |
| dot | 是否显示小红点 | `boolean` | `false` |

## TabbarItemConfig 类型

```typescript
interface TabbarItemConfig {
  pagePath?: string;       // 页面路径
  icon: string;            // 图标名称
  selectedIcon?: string;   // 选中态图标
  text: string;            // 文字标签
  customIcon?: boolean;    // 是否自定义图标
  badge?: string | number; // 徽标
  dot?: boolean;           // 小红点
}
```

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 切换选中项时触发 | `(value, item?)` |

## 动画说明

所有动画使用 Material Design 标准曲线：

- **颜色过渡**：`cubic-bezier(0.4, 0, 0.2, 1)` - 0.3s
- **滑块移动**：`cubic-bezier(0.4, 0, 0.2, 1)` - 0.35s
- **点击缩放**：`cubic-bezier(0.34, 1.56, 0.64, 1)` - 0.2s（回弹效果）
- **小红点脉冲**：2s 无限循环

## 参考

- 组件演示：`src/components/demos/tabbar-demo.vue`
