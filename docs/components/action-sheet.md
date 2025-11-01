---
title: Action Sheet 动作面板
---

# Action Sheet 动作面板

在页面底部弹出的操作菜单。

## 基础用法

```vue
<lk-action-sheet :actions="[{ name: '编辑' }, { name: '删除', color: '#f56c6c' }]" v-model:show="visible" />

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(true)
</script>
```

参考 Demo：
- https://github.com/lzk-gh/ui/blob/main/src/components/demos/action-sheet-demo.vue
