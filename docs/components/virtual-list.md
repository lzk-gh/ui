---
title: Virtual List 虚拟列表
---

# Virtual List 虚拟列表

在长列表中按需渲染可视区域，提升性能。

## 基础用法

```vue
<lk-virtual-list :items="items" :item-height="60">
  <template #default="{ item }">{{ item }}</template>
</lk-virtual-list>
```

参考 Demo：
- https://github.com/lzk-gh/ui/blob/main/src/components/demos/virtual-list-demo.vue
