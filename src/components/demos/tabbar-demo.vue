<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-tabbar v-model="active1">
        <lk-tabbar-item name="home" icon="house-fill">首页</lk-tabbar-item>
        <lk-tabbar-item name="category" icon="grid-3x3-gap-fill">分类</lk-tabbar-item>
        <lk-tabbar-item name="cart" icon="cart-fill">购物车</lk-tabbar-item>
        <lk-tabbar-item name="profile" icon="person-fill">我的</lk-tabbar-item>
      </lk-tabbar>
    </demo-block>

    <demo-block title="带徽标">
      <lk-tabbar v-model="active2">
        <lk-tabbar-item name="home" icon="house-fill">首页</lk-tabbar-item>
        <lk-tabbar-item name="message" icon="chat-dots-fill" :badge="5">消息</lk-tabbar-item>
        <lk-tabbar-item name="notification" icon="bell-fill" dot>通知</lk-tabbar-item>
        <lk-tabbar-item name="profile" icon="person-fill">我的</lk-tabbar-item>
      </lk-tabbar>
    </demo-block>

    <demo-block title="自定义颜色">
      <lk-tabbar v-model="active3" active-color="#07c160" inactive-color="#999999">
        <lk-tabbar-item name="home" icon="house-fill">首页</lk-tabbar-item>
        <lk-tabbar-item name="discover" icon="compass-fill">发现</lk-tabbar-item>
        <lk-tabbar-item name="profile" icon="person-fill">我的</lk-tabbar-item>
      </lk-tabbar>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkTabbar from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar.vue';
import LkTabbarItem from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar-item.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const active1 = ref('home');
const active2 = ref('home');
const active3 = ref('home');
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
