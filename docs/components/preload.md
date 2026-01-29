# 预加载系统 (Preload System)

Lucky UI 提供了一套完整的资源预加载系统，帮助开发者优化应用性能，提升用户体验。

## 特性

- 🚀 **智能队列管理** - 基于优先级的任务队列，支持并发控制
- ⏰ **空闲时间调度** - 利用浏览器空闲时间执行预加载任务
- 📦 **多类型支持** - 支持页面、组件、图片等多种资源类型
- 🔄 **自动重试** - 失败任务自动重试机制
- 📊 **调试面板** - 可视化的预加载状态监控
- 🎯 **开发者友好** - 简洁的 API 设计，支持 Vue 组合式 API

## 快速开始

### 基础使用

```typescript
import { usePreload, PreloadPriority } from '@/uni_modules/lucky-ui/core/src/preload';

// 在组件中使用
const { preloadPage, preloadImages, stats, isLoading } = usePreload();

// 预加载页面
preloadPage({
  path: '/pages/detail/index',
  priority: PreloadPriority.HIGH,
});

// 预加载多张图片
preloadImages(['https://example.com/image1.jpg', 'https://example.com/image2.jpg']);
```

### Tabbar 页面预加载

专为 Tabbar 页面场景设计的 Hook，在首页加载完成后自动预加载其他 Tab 页面：

```typescript
import { useTabbarPreload } from '@/uni_modules/lucky-ui/core/src/preload';

const { isPreloaded, manager } = useTabbarPreload({
  pages: [
    { id: 'home', path: '/pages/tabbar/home/index' },
    { id: 'cart', path: '/pages/tabbar/cart/index' },
    { id: 'mine', path: '/pages/tabbar/mine/index' },
  ],
  currentPageId: 'home',
  delay: 2000, // 首页加载后 2 秒开始预加载
  debug: true,
});

// 检查页面是否已预加载
if (isPreloaded('cart')) {
  console.log('购物车页面已预加载');
}
```

## API

### usePreload

预加载组合式函数。

#### 参数

| 参数       | 类型                     | 默认值  | 说明                             |
| ---------- | ------------------------ | ------- | -------------------------------- |
| config     | `Partial<PreloadConfig>` | -       | 预加载配置                       |
| autoStart  | `boolean`                | `false` | 是否在组件挂载时自动开始         |
| startDelay | `number`                 | `1000`  | 首次加载完成后的延迟时间（毫秒） |

#### 返回值

| 属性          | 类型                                        | 说明               |
| ------------- | ------------------------------------------- | ------------------ |
| manager       | `PreloadManager`                            | 预加载管理器实例   |
| stats         | `Ref<PreloadStats>`                         | 统计信息（响应式） |
| isLoading     | `Ref<boolean>`                              | 是否正在加载       |
| isPaused      | `Ref<boolean>`                              | 是否暂停           |
| preloadPage   | `(options: PagePreloadOptions) => string`   | 预加载页面         |
| preloadPages  | `(pages: PagePreloadOptions[]) => string[]` | 预加载多个页面     |
| preloadImage  | `(options: ImagePreloadOptions) => string`  | 预加载图片         |
| preloadImages | `(urls: string[], priority?) => string[]`   | 预加载多张图片     |
| pause         | `() => void`                                | 暂停预加载         |
| resume        | `() => void`                                | 恢复预加载         |
| clear         | `() => void`                                | 清空队列           |
| on            | `(event, handler) => void`                  | 监听事件           |
| off           | `(event, handler) => void`                  | 移除事件监听       |

### useTabbarPreload

Tabbar 页面预加载 Hook。

#### 参数

| 参数          | 类型                                                       | 说明                          |
| ------------- | ---------------------------------------------------------- | ----------------------------- |
| pages         | `Array<{ id: string; path: string; dataUrls?: string[] }>` | Tabbar 页面配置               |
| currentPageId | `string`                                                   | 当前页面 ID                   |
| delay         | `number`                                                   | 预加载延迟（毫秒），默认 2000 |
| debug         | `boolean`                                                  | 是否启用调试日志              |

### PreloadConfig

预加载配置选项。

| 参数           | 类型      | 默认值  | 说明                     |
| -------------- | --------- | ------- | ------------------------ |
| maxConcurrency | `number`  | `2`     | 最大并发数               |
| defaultRetries | `number`  | `2`     | 默认重试次数             |
| retryDelay     | `number`  | `1000`  | 重试延迟（毫秒）         |
| idleThreshold  | `number`  | `10`    | 空闲时间阈值（毫秒）     |
| taskTimeout    | `number`  | `30000` | 任务超时时间（毫秒）     |
| debug          | `boolean` | `false` | 是否启用调试日志         |
| pauseOnHidden  | `boolean` | `true`  | 页面隐藏时是否暂停预加载 |

### PreloadPriority

预加载优先级枚举。

| 值         | 说明                              |
| ---------- | --------------------------------- |
| HIGH (1)   | 高优先级 - 用户即将访问的页面     |
| MEDIUM (2) | 中优先级 - 常用页面               |
| LOW (3)    | 低优先级 - 不常用但可能访问的页面 |

### 事件类型

| 事件            | 说明     |
| --------------- | -------- |
| `task:start`    | 任务开始 |
| `task:complete` | 任务完成 |
| `task:error`    | 任务失败 |
| `task:cancel`   | 任务取消 |
| `queue:empty`   | 队列清空 |
| `queue:pause`   | 队列暂停 |
| `queue:resume`  | 队列恢复 |

## 调试面板

Lucky UI 提供了预加载调试面板组件 `<lk-preload-debugger>`，方便开发者查看预加载状态。

```vue
<template>
  <view>
    <!-- 页面内容 -->

    <!-- 预加载调试面板 -->
    <lk-preload-debugger :visible="isDev" position="bottom-right" />
  </view>
</template>

<script setup lang="ts">
import LkPreloadDebugger from '@/uni_modules/lucky-ui/components/lk-preload-debugger/lk-preload-debugger.vue';

const isDev = import.meta.env.DEV;
</script>
```

### Props

| 参数     | 类型                                                           | 默认值           | 说明     |
| -------- | -------------------------------------------------------------- | ---------------- | -------- |
| visible  | `boolean`                                                      | `false`          | 是否显示 |
| position | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | 位置     |

## 最佳实践

### 1. 在首页预加载关键页面

```typescript
// pages/home/index.vue
import { onMounted } from 'vue';
import { usePreload, PreloadPriority } from '@/uni_modules/lucky-ui/core/src/preload';

const { preloadPages } = usePreload();

onMounted(() => {
  // 首页加载后 2 秒，开始预加载关键页面
  setTimeout(() => {
    preloadPages([
      { path: '/pages/product/detail', priority: PreloadPriority.HIGH },
      { path: '/pages/cart/index', priority: PreloadPriority.MEDIUM },
      { path: '/pages/user/profile', priority: PreloadPriority.LOW },
    ]);
  }, 2000);
});
```

### 2. 预加载列表中的图片

```typescript
// 商品列表页
const { preloadImages } = usePreload();

// 当获取到商品数据后，预加载图片
watch(productList, list => {
  const imageUrls = list.map(item => item.image);
  preloadImages(imageUrls, PreloadPriority.MEDIUM);
});
```

### 3. 页面可见性控制

预加载系统会自动在页面隐藏时暂停，页面可见时恢复，无需手动处理。

### 4. 自定义预加载任务

```typescript
import {
  getPreloadManager,
  PreloadResourceType,
  PreloadPriority,
} from '@/uni_modules/lucky-ui/core/src/preload';

const manager = getPreloadManager();

// 添加自定义预加载任务
manager.addTask({
  type: PreloadResourceType.CUSTOM,
  priority: PreloadPriority.LOW,
  resource: 'custom-resource-key',
  maxRetries: 3,
  executor: async () => {
    // 自定义预加载逻辑
    await fetchSomeData();
    await loadSomeScript();
  },
});
```

## 平台差异

| 功能                | H5  | 微信小程序            | 其他小程序            |
| ------------------- | --- | --------------------- | --------------------- |
| requestIdleCallback | ✅  | ❌ (降级 setTimeout)  | ❌ (降级 setTimeout)  |
| link prefetch       | ✅  | ❌                    | ❌                    |
| uni.preloadPage     | ❌  | ✅                    | 部分支持              |
| Image 预加载        | ✅  | ✅ (uni.getImageInfo) | ✅ (uni.getImageInfo) |

## 注意事项

1. **避免过度预加载** - 预加载会消耗网络和内存资源，应该只预加载用户很可能访问的内容
2. **设置合理的延迟** - 确保首页完全加载后再开始预加载，避免影响首屏性能
3. **使用优先级** - 合理设置优先级，确保重要资源优先加载
4. **生产环境关闭调试** - 记得在生产环境关闭调试面板和调试日志
