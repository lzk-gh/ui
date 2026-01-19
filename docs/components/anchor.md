---
title: Anchor 锚点导航
---

# Anchor 锚点导航

用于“侧边分类 + 右侧内容滚动”的锚点联动场景，支持亮/暗主题自动适配。

## 基础用法（ScrollView 联动）

- 右侧内容用 `scroll-view` 承载，并给它一个 `id`（例如 `anchor-content`）
- `LkAnchor` 传入 `target-container="#anchor-content"`，用于在小程序端正确测量各 section 的相对位置
- 在右侧 `@scroll` 中把 `scrollTop` 传给 `anchorRef.onScroll(scrollTop)`

参考 Demo：
- https://github.com/lzk-gh/ui/blob/main/src/components/demos/anchor-demo.vue
