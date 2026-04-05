# 安装与引入

## 方式一：自动引入（最推荐 - uni-app 官方支持）

Lucky UI 完全遵循 uni-app 的 `easycom` 规范。当你把 `lucky-ui` 目录放在 `src/uni_modules/` 下时，uni-app 会 **自动解析并注册** 所有 `<lk-...>` 组件，无需你在任何地方 `import` 或声明。

```vue
<!-- src/pages/demo/index.vue -->
<template>
  <view>
    <!-- 直接在模板里写，无需 import LkButton 或 LkInput -->
    <lk-input v-model="keyword" placeholder="搜索..." />
    <lk-button @click="search">搜索</lk-button>
  </view>
</template>

<script setup lang="ts">
const search = () => {}
// 你只在需要工具函数时，才按需引入：
import { useRipple, addUnit, useTheme } from '@/uni_modules/lucky-ui'
</script>
```

> **注意：** 自动引入不影响 Tree-shaking，uni-app 会在打包时将你未使用的组件自动剔除。这种方式体积最小，体验最好。

同时在 `App.vue` 或全局 scss 文件中引入主题样式以生效：

```scss
// src/uni.scss
@use '@/uni_modules/lucky-ui/theme/src/index.scss' as *;
```

## 方式二：全局注册（可选）

如果你更希望像传统组件库那样一次性注册所有组件，可以在 `main.ts` 使用根插件：

```ts
// src/main.ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import LuckyUI from './uni_modules/lucky-ui'

export function createApp() {
  const app = createSSRApp(App)
  app.use(LuckyUI)
  return { app }
}
```

这个方式兼容旧习惯，但不作为默认推荐。

如果你只想局部使用某个组件，或者你想显式声明依赖，也可以直接从入口或单个文件按需导入：

```vue
<script setup lang="ts">
// 方式 A：从根入口导入
import { LkButton, LkInput } from '@/uni_modules/lucky-ui'

// 方式 B：从源文件导入（体积绝对最小）
// import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue'
</script>

<template>
  <view>
    <lk-input v-model="keyword" placeholder="搜索..." />
    <lk-button @click="search">搜索</lk-button>
  </view>
</template>
```

## 类型支持

在 `tsconfig.json` 中确保 `src` 路径已包含：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

组件库自带 `components.d.ts`，IDE 可自动识别所有 `lk-*` 组件的 props 类型。

## 快速验证

新建一个页面，放入以下代码，运行 `pnpm run dev:h5` 确认正常显示：

```vue
<script setup lang="ts">
// 无需引入组件！直接编写逻辑即可
</script>

<template>
  <view style="padding: 32rpx; display: flex; flex-direction: column; gap: 16rpx">
    <lk-button>默认按钮</lk-button>
    <lk-button variant="outline">描边按钮</lk-button>
    <lk-tag type="success">安装成功</lk-tag>
  </view>
</template>
```

> 说明：在 uni-app 工程中，`src/uni_modules/` 下组件已由 easycom 自动解析，通常不需要额外的自动导入插件。
```
