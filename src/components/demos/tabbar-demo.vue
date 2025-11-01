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

    <demo-block title="FAB 中心悬浮（默认内置图标）">
      <lk-tabbar
        v-model="activeFab"
        type="FAB"
        :topBorder="true"
        :topShadow="true"
        active-color="#07c160"
        inactive-color="#999999"
        @fab-click="onFabClick"
      >
        <lk-tabbar-item name="home" icon="house-fill">首页</lk-tabbar-item>
        <lk-tabbar-item name="discover" icon="compass-fill">发现</lk-tabbar-item>
        <lk-tabbar-item name="message" icon="chat-dots-fill" :badge="2">消息</lk-tabbar-item>
        <lk-tabbar-item name="profile" icon="person-fill">我的</lk-tabbar-item>
        <!-- 不提供 slot="fab" 时，默认展示 plus 图标 -->
      </lk-tabbar>
    </demo-block>

    <demo-block title="FROSTED 磨砂玻璃">
      <lk-tabbar
        v-model="activeGlass"
        :frosted="true"
        :topLeftRadius="24"
        :topRightRadius="24"
        :topShadow="true"
        active-color="#3a7afe"
        inactive-color="#777777"
      >
        <lk-tabbar-item name="home" icon="house-fill">首页</lk-tabbar-item>
        <lk-tabbar-item name="search" icon="search">搜索</lk-tabbar-item>
        <lk-tabbar-item name="cart" icon="cart-fill" :badge="99" :max="99">购物车</lk-tabbar-item>
        <lk-tabbar-item name="me" icon="person-fill">我的</lk-tabbar-item>
      </lk-tabbar>
    </demo-block>
    
    <demo-block title="胶囊 Capsule（可配置宽度与上浮高度）">
      <lk-tabbar
        v-model="activeCapsule"
        type="CAPSULE"
        :frosted="false"
        :capsuleWidth="720"
        :capsuleOffset="24"
        :topShadow="true"
        active-color="#ff6b6b"
        inactive-color="#999"
      >
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
const activeFab = ref('home');
const activeGlass = ref('home');
const activeCapsule = ref('home');

function onFabClick() {
  // 这里可以切换到发布页、弹出菜单等
  console.log('FAB clicked');
}
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
