---
title: Badge 徽标
---

# Badge 徽标

用于显示消息数量或状态的小圆点。

## 基础用法

```vue
<lk-badge :value="5">
  <lk-button>消息</lk-button>
</lk-badge>
```

## 小红点

```vue
<lk-badge dot>
  <lk-icon name="bell" />
</lk-badge>
```

## Props（节选）

- value: 显示的数值或文本
- dot: 是否显示小红点
- max: 封顶数值
