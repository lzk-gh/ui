---
title: 概览
---

# Lucky UI 文档

欢迎来到 Lucky UI 文档站点（基于 VitePress）。这里主要收录“基础组件”的用法说明与代码示例，并附带项目工程相关文档。

## 快速预览

- 左侧侧边栏进入 组件 → 基础组件 查看各组件文档
- 顶部导航进入 工程文档 查看实施总结、架构与测试指南等

## 使用说明（示例）

本仓库以 uni-app 为运行环境，组件位于 `src/uni_modules/lucky-ui/components`。在业务页面中按需引用即可：

```vue
<template>
  <view>
    <lk-button type="primary">主要按钮</lk-button>
  </view>
  
</template>

<script setup lang="ts">
// 在 uni-app 中，安装到 uni_modules 后可直接使用（参考项目已有配置）
</script>
```

> 注：VitePress 站点用于文档展示与代码范例预览，这里不直接运行 uni-app 组件。
