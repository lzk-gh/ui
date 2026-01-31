<template>
  <view class="component-demo">
    <!-- ============================================================ -->
    <!-- Fixed 模式 - 简约风格（默认） -->
    <!-- ============================================================ -->
    <demo-block title="Fixed 模式（简约风格）" desc="仅颜色渐变过渡，跟随品牌色">
      <view class="tabbar-preview">
        <lk-tabbar v-model="activeFixed" :fixed="false" mode="fixed">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="category" icon="grid-3x3-gap-fill" label="分类" />
          <lk-tabbar-item name="cart" icon="cart-fill" label="购物车" :badge="3" />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <!-- ============================================================ -->
    <!-- Slider 模式 - 滑块风格 -->
    <!-- ============================================================ -->
    <demo-block title="Slider 模式（滑块风格）" desc="滑块平滑移动到目标位置">
      <view class="tabbar-preview">
        <lk-tabbar v-model="activeSlider" :fixed="false" mode="slider">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="discover" icon="compass-fill" label="发现" />
          <lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" dot />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <!-- ============================================================ -->
    <!-- Bump 模式 - 中间凸起风格 -->
    <!-- ============================================================ -->
    <demo-block title="Bump 模式（中间凸起）" desc="中间按钮悬浮突出，点击有回弹效果">
      <view class="tabbar-preview tabbar-preview--bump">
        <lk-tabbar v-model="activeBump" :fixed="false" mode="bump" :border="false">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="discover" icon="compass-fill" label="发现" />
          <lk-tabbar-item name="add" icon="plus-lg" label="" />
          <lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" :badge="5" />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <!-- ============================================================ -->
    <!-- List 模式 - 使用配置数组 -->
    <!-- ============================================================ -->
    <demo-block title="List 配置模式" desc="通过 list 属性配置，无需使用 slot">
      <view class="tabbar-preview">
        <lk-tabbar v-model="activeList" :fixed="false" mode="slider" :list="tabbarList" />
      </view>
    </demo-block>

    <!-- ============================================================ -->
    <!-- 自定义颜色 -->
    <!-- ============================================================ -->
    <demo-block title="自定义颜色" desc="可自定义激活/未激活颜色">
      <view class="tabbar-preview">
        <lk-tabbar
          v-model="activeColor"
          :fixed="false"
          mode="fixed"
          active-color="#10b981"
          inactive-color="#9ca3af"
        >
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="category" icon="grid-3x3-gap-fill" label="分类" />
          <lk-tabbar-item name="cart" icon="cart-fill" label="购物车" />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <!-- ============================================================ -->
    <!-- 毛玻璃效果 -->
    <!-- ============================================================ -->
    <demo-block title="毛玻璃效果" desc="开启 glassBg 呈现磨砂玻璃质感">
      <view class="tabbar-preview tabbar-preview--gradient">
        <lk-tabbar v-model="activeGlass" :fixed="false" mode="fixed" glass-bg :border="false">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="discover" icon="compass-fill" label="发现" />
          <lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <!-- ============================================================ -->
    <!-- 徽标与小红点 -->
    <!-- ============================================================ -->
    <demo-block title="徽标与小红点" desc="展示消息数量或提示状态">
      <view class="tabbar-preview">
        <lk-tabbar v-model="activeBadge" :fixed="false" mode="slider">
          <lk-tabbar-item name="home" icon="house-fill" label="首页" />
          <lk-tabbar-item name="message" icon="chat-dots-fill" label="消息" :badge="99" />
          <lk-tabbar-item name="notification" icon="bell-fill" label="通知" dot />
          <lk-tabbar-item name="profile" icon="person-fill" label="我的" />
        </lk-tabbar>
      </view>
    </demo-block>

    <!-- ============================================================ -->
    <!-- 选中态图标切换 -->
    <!-- ============================================================ -->
    <demo-block title="选中态图标" desc="支持未选中/选中不同图标">
      <view class="tabbar-preview">
        <lk-tabbar v-model="activeIcon" :fixed="false" mode="fixed">
          <lk-tabbar-item name="home" icon="house" selected-icon="house-fill" label="首页" />
          <lk-tabbar-item name="heart" icon="heart" selected-icon="heart-fill" label="收藏" />
          <lk-tabbar-item name="star" icon="star" selected-icon="star-fill" label="关注" />
          <lk-tabbar-item name="profile" icon="person" selected-icon="person-fill" label="我的" />
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

// Fixed 模式
const activeFixed = ref('home');

// Slider 模式
const activeSlider = ref('home');

// Bump 模式
const activeBump = ref('home');

// List 配置模式
const activeList = ref(0);
const tabbarList = [
  { icon: 'house-fill', text: '首页' },
  { icon: 'compass-fill', text: '发现' },
  { icon: 'chat-dots-fill', text: '消息', badge: 12 },
  { icon: 'person-fill', text: '我的' },
];

// 自定义颜色
const activeColor = ref('home');

// 毛玻璃效果
const activeGlass = ref('home');

// 徽标
const activeBadge = ref('home');

// 图标切换
const activeIcon = ref('home');
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

  // Bump 模式需要更多上方空间
  &--bump {
    padding-top: 60rpx;
    overflow: visible;
  }

  // 渐变背景用于展示毛玻璃效果
  &--gradient {
    background: linear-gradient(
      135deg,
      var(--lk-color-primary) 0%,
      var(--lk-color-primary-soft) 50%,
      #e0f2fe 100%
    );
    padding-top: 100rpx;
  }
}
</style>
