# 安装与引入

## 推荐方式：easycom 自动引入

Lucky UI 完全遵循 `uni-app` 的 `easycom` 规范，因此只要把 `lucky-ui` 放在项目的 `src/uni_modules/` 下，`<lk-...>` 组件就可以直接在模板中使用，**无需任何组件级导入**。

库根目录提供了 `package.json` 和 `components.d.ts`，用于明确包入口、类型声明和开源发布信息。但需要注意，`easycom` 识别依赖的是目录结构，不是 `package.json` 本身；真正决定是否能直接使用的是组件是否位于 `src/uni_modules/lucky-ui/components/` 下。

### 1. 将组件库放入项目目录

```
src/uni_modules/lucky-ui/
```

### 2. 引入主题样式

在全局样式文件（例如 `src/uni.scss`）中引入 Lucky UI 主题：

```scss
@use '@/uni_modules/lucky-ui/theme/src/index.scss' as *;
```

### 3. 在页面模板中直接使用组件

```vue
<template>
  <view class="page-shell">
    <lk-navbar title="发现" :show-back="false" />
    <view class="page-body">
      <lk-input v-model="keyword" placeholder="搜索..." clearable />
      <lk-button @click="search">搜索</lk-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const keyword = ref('');
const search = () => {
  console.log('搜索关键词', keyword.value);
};
</script>
```

### 4. 仅在需要工具函数时才按需导入

如果你需要使用 Lucky UI 的工具函数、主题钩子、或者可复用 API，请按需导入：

```ts
import { useRipple, addUnit, useTheme } from '@/uni_modules/lucky-ui';
```

> 这里的 `import` 只用于函数、hooks、工具库，不用于模板组件。

### 5. 如果你把 Lucky UI 作为独立包安装

如果你不是把源码放进 `src/uni_modules/`，而是把它当成一个独立包安装到 `node_modules`，可以在 `pages.json` 里补一个 `easycom.custom` 规则，让 `<lk-...>` 组件同样可用：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^lk-(.*)": "lucky-ui/components/lk-$1/lk-$1.vue"
    }
  }
}
```

这个规则的前提是包内仍然保持 `components/lk-组件名/lk-组件名.vue` 的结构。

## 额外说明

- 如果你使用的是本地开发仓库，推荐保留 `src/uni_modules/lucky-ui/` 路径；
- 如果你在 npm 包里使用 Lucky UI，则路径可能会变为 `lucky-ui/components/...`；
- `easycom` 自动解析会在 uni-app 打包时识别 `<lk-...>` 标签，不需要你手动注册组件；
- `easycom` 识别的是组件目录结构，不会因为多了一个 `package.json` 就自动工作；
- 如果你希望显式注册组件，可使用 `app.use(LuckyUI)`，但这不是必需的。

## 兼容方式：可选全局注册

如果你更习惯一次性注册组件库，可以在 `src/main.ts` 中按以下方式注册：

```ts
import { createSSRApp } from 'vue';
import App from './App.vue';
import LuckyUI from './uni_modules/lucky-ui';

export function createApp() {
  const app = createSSRApp(App);
  app.use(LuckyUI);
  return { app };
}
```

该方式与 easycom 兼容，但并非必要。

## 运行验证

新建一个页面，运行 `pnpm run dev:h5`，应可直接使用 `<lk-button>`、`<lk-input>`、`<lk-tag>` 等组件而无需手动导入。

```vue
<script setup lang="ts">
const keyword = '';
</script>

<template>
  <view style="padding: 32rpx; display: flex; flex-direction: column; gap: 16rpx;">
    <lk-button>默认按钮</lk-button>
    <lk-button variant="outline">描边按钮</lk-button>
    <lk-tag type="success">安装成功</lk-tag>
  </view>
</template>
```
```
