---
title: Tag 标签
---

# Tag 标签

用于标记和分类的小标签。

## 基础用法

```vue
<lk-tag>默认</lk-tag>
<lk-tag type="primary">主要</lk-tag>
<lk-tag type="success">成功</lk-tag>
<lk-tag type="warning">警告</lk-tag>
<lk-tag type="danger">危险</lk-tag>
```

## 可关闭

```vue
<lk-tag closable @close="onClose">可关闭</lk-tag>

<script setup lang="ts">
function onClose() {}
</script>
```

## Props（节选）

- type: 颜色风格 `default | primary | success | warning | danger`
- closable: 是否可关闭
- round: 是否圆角
