<template>
  <view class="component-demo">
    <demo-block title="基础用法" desc="iOS 风格的底部导航">
      <view class="tabbar-preview">
        <lk-tabbar v-model="active1" :fixed="false">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="category" icon="grid-3x3-gap-fill" label="分类" />
          <lk-tabbar-item name="cart" icon="cart-fill" label="购物车" />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <demo-block title="带徽标" desc="展示消息数量或小红点">
      <view class="tabbar-preview">
        <lk-tabbar v-model="active2" :fixed="false">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" :badge="5" />
          <lk-tabbar-item name="notification" icon="bell-fill" label="通知" dot />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <demo-block title="自定义颜色" desc="修改激活/未激活颜色">
      <view class="tabbar-preview">
        <lk-tabbar
          v-model="active3"
          :fixed="false"
          active-color="var(--lk-color-success)"
          inactive-color="var(--lk-color-text-tertiary)"
        >
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="discover" icon="compass-fill" label="发现" />
          <lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" :badge="2" />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <demo-block title="三项导航">
      <view class="tabbar-preview">
        <lk-tabbar v-model="active4" :fixed="false">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="search" icon="search" label="搜索" />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <demo-block title="无边框" desc=":border='false'">
      <view class="tabbar-preview tabbar-preview--shadow">
        <lk-tabbar v-model="active5" :fixed="false" :border="false">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="category" icon="grid-3x3-gap-fill" label="分类" />
          <lk-tabbar-item name="cart" icon="cart-fill" label="购物车" :badge="99" />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
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
const active4 = ref('home');
const active5 = ref('home');
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 48rpx;
}

.tabbar-preview {
  border-radius: var(--lk-radius-lg);
  overflow: hidden;
  background: var(--lk-color-bg-container);

  &--shadow {
    box-shadow: var(--lk-shadow-sm);
  }
}
</style>
