# 介绍

Lucky UI 是一套面向 **Uni-app（Vue 3）** 的跨端移动端组件库，同时支持 H5 移动端与微信小程序。

## 特性

- **60+ 组件**：涵盖所有常用移动端 UI 场景
- **跨端兼容**：同一套代码运行于 H5 和微信小程序
- **TypeScript**：全量类型，完善的 IDE 提示
- **主题系统**：Design Token + CSS 变量，支持暗色模式
- **按需引用**：Tree-shaking 友好，只引入你需要的

## 技术栈

| 项目 | 版本 |
|------|------|
| Vue | ^3.4 |
| Uni-app | 3.x |
| TypeScript | ^5.0 |
| Vite | ^5.0 |

## 目录结构

```
src/uni_modules/lucky-ui/
├── components/          # 所有组件
│   ├── lk-button/       # 单个组件 SFC + Props
│   ├── lk-input/
│   └── ...
├── core/
│   └── src/
│       ├── utils/       # 工具函数（addUnit、throttle 等）
│       └── hooks/       # 通用 Composables
├── theme/
│   └── src/
│       ├── tokens/      # Design Tokens
│       ├── base/        # 基础样式层
│       └── index.scss   # 主样式入口
└── composables/         # 跨组件复用 Composables
```

## 浏览器与小程序兼容性

| 平台 | 支持情况 |
|------|---------|
| H5（Chrome / Safari） | ✅ 完整支持 |
| 微信小程序 | ✅ 完整支持 |
| 支付宝小程序 | 部分支持 |
| App（plus） | 部分支持 |

> 主要开发与测试目标为 H5 和微信小程序。
