---
title: Hooks 与工具
---

# Hooks 与工具

本文档汇总 Lucky UI 中常用的组合式函数与核心工具，示例均基于当前仓库可用 API。

## 使用约定

- 推荐从 `@/uni_modules/lucky-ui/composables` 与 `@/uni_modules/lucky-ui/core/src` 统一导入。
- `hooks-utils` 是工具文档页，不属于单一组件，因此不提供右侧手机壳预览。
- 页面级逻辑建议在 `onLoad / onShow` 触发，组件内交互可用 `onMounted`。

## Composables

### useTransition

- 作用：统一管理组件进入/离开动画状态，减少手写 class 与状态切换。

```ts
import { useTransition } from '@/uni_modules/lucky-ui/composables';
import { ref } from 'vue';

const visible = ref(false);

const { classes, styles, display } = useTransition(
  () => visible.value,
  { name: 'fade-up', duration: 300 }
);

const open = () => (visible.value = true);
const close = () => (visible.value = false);
```

### useRipple

- 作用：为按钮/卡片提供点击涟漪反馈，统一触摸体验。

```ts
import { useRipple } from '@/uni_modules/lucky-ui/composables';

const { triggerRipple, rippleActive, rippleWaveStyle } = useRipple();

const onTap = (e: any) => {
  triggerRipple(e);
};
```

### useChartCanvas

- 作用：管理 Canvas 图表初始化、尺寸同步与销毁。

```ts
import { useChartCanvas } from '@/uni_modules/lucky-ui/composables';

const { initCanvas, canvasInfo } = useChartCanvas();

onMounted(async () => {
  await initCanvas('chart-canvas');
  // 使用 canvasInfo 绘制图表
});
```

## 预加载系统（Core）

### usePreload

用于页面/图片资源预加载，支持优先级、暂停恢复、统计信息。

```ts
import { usePreload, PreloadPriority } from '@/uni_modules/lucky-ui/core/src';

const { preloadPage, preloadImages, stats, isLoading, pause, resume } = usePreload({
  autoStart: true,
  startDelay: 0,
});

preloadPage({ path: '/pages_sub/search/index', priority: PreloadPriority.HIGH });
preloadImages(['https://picsum.photos/300/200?1', 'https://picsum.photos/300/200?2']);
```

### useTabbarPreload

适用于 Tabbar 结构：首页稳定后按优先级预加载其他分包页面。

```ts
import { useTabbarPreload } from '@/uni_modules/lucky-ui/core/src';

const { isPreloaded, triggerPreload } = useTabbarPreload({
  pages: [
    { id: 'search', path: '/pages_sub/search/index' },
    { id: 'settings', path: '/pages_sub/settings/index' },
  ],
  currentPageId: 'search',
  delay: 1500,
  debug: true,
});

triggerPreload();
```

## Core Utils

统一从 `@/uni_modules/lucky-ui/core/src` 引入：

```ts
import {
  addUnit,
  debounce,
  throttle,
  formatPrice,
  isPhone,
  isH5,
  isMpWeixin,
  createRequest,
} from '@/uni_modules/lucky-ui/core/src';
```

### 常用工具

- `addUnit`：数字自动补 `rpx`（组件尺寸传数字时建议统一处理）
- `debounce` / `throttle`：输入、滚动、拖拽等高频场景优化
- `formatPrice` / `formatTime`：金额与时间格式化
- `isPhone` / `isEmail` / `isIdCard`：常见输入校验
- `isH5` / `isMpWeixin`：跨端平台判断
- `createRequest`：请求实例（支持拦截器、重试、取消）

### createRequest 示例

```ts
import { createRequest } from '@/uni_modules/lucky-ui/core/src';

const request = createRequest({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retry: 1,
});

request.interceptors.request.use((config) => {
  config.header = {
    ...config.header,
    Authorization: 'Bearer token',
  };
  return config;
});

const getProfile = () => request.get({ url: '/user/profile' });
```

## 推荐约定

- 组件内部尺寸优先使用 `addUnit` 兼容数字输入
- 触摸/滚动类高频事件默认做 `throttle`
- 表单提交前统一使用 `isPhone / isEmail / isIdCard` 进行轻校验
- 平台分支逻辑优先用 `isH5 / isMpWeixin` 等平台工具而不是手写判断

## API

> 详细类型与实现请参考：
>
> - `src/uni_modules/lucky-ui/composables/`
> - `src/uni_modules/lucky-ui/core/src/`
