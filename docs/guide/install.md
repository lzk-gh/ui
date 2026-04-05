# 安装与引入

## 推荐方式：easycom 自动引入

Lucky UI 完全遵循 `uni-app` 的 `easycom` 规范，因此只要把 `lucky-ui` 放在项目的 `src/uni_modules/` 下，`<lk-...>` 组件就可以直接在模板中使用，**无需任何组件级导入**。

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

## 额外说明

- 如果你使用的是本地开发仓库，推荐保留 `src/uni_modules/lucky-ui/` 路径；
- 如果你在 npm 包里使用 Lucky UI，则路径可能会变为 `lucky-ui/components/...`；
- `easycom` 自动解析会在 uni-app 打包时识别 `<lk-...>` 标签，不需要你手动注册组件；
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
