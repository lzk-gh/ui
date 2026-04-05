---
title: Tabbar 底部导航
phone: tabbar
---

# Tabbar 底部导航

Lucky UI 仅提供 **`lk-tabbar-container`**：在**单个页面**内同时承载「底部 Tab 栏 + 多面板内容」，支持懒加载、状态保持、多组视觉模式（block、手电筒、浮动等），适合 App 主壳、电商首页等多 Tab 单页场景。

若你需要 **uni-app 原生多页面 + `switchTab`**，请使用 `pages.json` 的 **原生 `tabBar`** 配置；本组件面向**自定义 Tab 容器**架构，与原生 tabBar 二选一即可。

## 引入方式

将 `lucky-ui` 置于 `src/uni_modules/` 后，模板中直接使用 `<lk-tabbar-container>`（[easycom / 安装说明](/guide/install)）。类型与常量可自包入口按需导入：

```ts
import type { TabConfig, TabbarVisualMode } from '@/uni_modules/lucky-ui';
import { TABBAR_VISUAL_MODES } from '@/uni_modules/lucky-ui';
```

npm 包场景将 `@/uni_modules/lucky-ui` 换为 `lucky-ui` 即可。

## 平台说明

- **H5 / App**：在 `TabConfig` 上为每个 Tab 配置 `component`（`markRaw(同步组件)` 或 `() => import('...')` 异步），由容器内动态组件渲染。
- **小程序**：使用具名插槽 **`#tab-{id}`**（`id` 与 `tabs[].id` 一致）编写各 Tab 内容。

## 基础示例（H5 / App）

```vue
<script setup lang="ts">
import { markRaw } from 'vue';
import type { TabConfig } from '@/uni_modules/lucky-ui';
import PageHome from './pages/home.vue';
import PageMine from './pages/mine.vue';

const tabs: TabConfig[] = [
  { id: 'home', label: '首页', icon: 'house', component: markRaw(PageHome), keepAlive: true },
  { id: 'mine', label: '我的', icon: 'gear', component: markRaw(PageMine), keepAlive: true },
];
</script>

<template>
  <view class="shell">
    <lk-tabbar-container :tabs="tabs" default-tab="home" mode="block" />
  </view>
</template>
```

## 小程序插槽示例

```vue
<lk-tabbar-container :tabs="tabs" default-tab="home">
  <!-- #ifdef MP -->
  <template #tab-home>
    <home-panel />
  </template>
  <template #tab-mine>
    <mine-panel />
  </template>
  <!-- #endif -->
</lk-tabbar-container>
```

## 底部栏外观

- **`mode`**：`plain` | `block` | `flashlight` | `float` | `marker-top` | `marker-bottom` | `dot-slide` | `bubble` | `ripple` | `mask-fill` | `text-raise`。未传时默认为 `block`。
- **`border`**：是否显示底栏顶部分隔线（默认 `true`）。
- **`glass-bg`**：底栏毛玻璃背景（默认 `false`）；暗色需页面根节点带 `.lk-theme-dark` 等主题 class。
- **`z-index`**：底栏层级（默认 `300`）。

可与业务全局状态联动，例如 `:mode="themeStore.tabbarMode"`。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tabs | Tab 配置 | `TabConfig[]` | （必填） |
| default-tab | 默认激活的 Tab `id` | `string` | `''`（取第一项） |
| mode | 底栏视觉模式 | `TabbarVisualMode` | `block` |
| border | 底栏顶部分隔线 | `boolean` | `true` |
| glass-bg | 底栏毛玻璃 | `boolean` | `false` |
| z-index | 底栏 `z-index` | `number` | `300` |
| debug | 调试日志 | `boolean` | `false` |
| custom-class | 根节点 class | `string` | `''` |
| custom-style | 根节点样式 | `string \| Record<string, string>` | `''` |
| preload-delay | 预加载其余 Tab 前的延迟（ms） | `number` | `2000` |
| preload-all | 是否预加载其它 Tab | `boolean` | `true` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| before-change | 切换前 | `(tabId, oldTabId)` |
| change | 切换完成 | `(tabId)` |

## TabConfig

```ts
interface TabConfig {
  id: string;
  label: string;
  icon: string;
  selectedIcon?: string;
  activeIconFill?: boolean;
  component?: Component | (() => Promise<{ default: Component }>);
  keepAlive?: boolean;
  badge?: number;
  dot?: boolean;
}
```

## 主题

颜色使用 Lucky UI 的 **`--lk-*`** 变量（如 `--lk-bg-page`、`--lk-color-primary`）。接入方引入主题 SCSS 后即可随亮暗切换。

## 从旧版 `lk-tabbar` 迁移

此前独立的 **`lk-tabbar` / `lk-tabbar-item` 已移除**。请改为：

1. 使用 **`lk-tabbar-container`** + **`tabs` 配置**（及 H5/App 的 `component` 或小程序插槽）。
2. 原 `fixed` / `slider` / `bump` 等模式与本容器 `mode` 体系不同，请按上表重新选择视觉模式。
3. 需要 **原生页面跳转** 时，请使用 `pages.json` tabBar 或自行在 Tab 内容里 `uni.switchTab`，不再由底栏组件内置。

## 参考

- 核心逻辑：`uni_modules/lucky-ui/core/src/tabbar-container`
- 本仓库示例：`src/pages/app-main/index.vue`、`src/components/demos/tabbar-demo.vue`
