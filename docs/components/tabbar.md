---
title: Tabbar 底部导航
---

# Tabbar 底部导航

页面底部的导航切换栏（支持徽标/小红点、颜色自定义、底部固定与安全区适配）。

## 基础用法

```vue
<template>
	<lk-tabbar v-model="active" :fixed="false">
		<lk-tabbar-item name="home" icon="house-fill" label="首页" />
		<lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" :badge="5" />
		<lk-tabbar-item name="notification" icon="bell-fill" label="通知" dot />
		<lk-tabbar-item name="profile" icon="person-fill" label="我的" />
	</lk-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref('home');
</script>
```

## LkTabbar Props

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| v-model | 当前激活项的 name | - |
| fixed | 固定在底部 | true |
| safeArea | 安全区适配 | true |
| border | 顶部边框线 | true |
| activeColor | 激活颜色 | - |
| inactiveColor | 未激活颜色 | - |
| backgroundColor | 背景色 | - |

## LkTabbarItem Props

| 属性 | 说明 |
| --- | --- |
| name | 唯一标识（必填） |
| icon | 图标名称 |
| label | 文字标签 |
| badge | 徽标数字 |
| dot | 小红点 |

## 参考

- 组件演示：src/components/demos/tabbar-demo.vue
