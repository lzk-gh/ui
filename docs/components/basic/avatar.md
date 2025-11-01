---
title: Avatar 头像
---

# Avatar 头像

用来代表用户或物体，支持图片、图标与文字。

## 基础用法

```vue
<lk-avatar src="https://example.com/user.png" />
<lk-avatar icon="person" />
<lk-avatar>U</lk-avatar>
```

## 形状与尺寸

```vue
<lk-avatar shape="circle" size="small">A</lk-avatar>
<lk-avatar shape="square" size="large">A</lk-avatar>
```

## Props（节选）

- src: 图片地址
- icon: 内置图标名
- shape: `circle | square`
- size: `small | medium | large` 或 数字
