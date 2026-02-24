<template>
  <view class="component-demo">
    <!-- ① 基础用法 (line 下划线) -->
    <demo-block title="基础用法 · Line">
      <lk-tabs v-model="activeTab1">
        <lk-tab-pane label="推荐" name="1">
          <view class="tab-content">
            <lk-icon name="star-fill" size="48" color="primary" />
            <text class="tab-content__text">为你精选推荐内容</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="热门" name="2">
          <view class="tab-content">
            <lk-icon name="lightning-fill" size="48" color="warning" />
            <text class="tab-content__text">当前热门趋势</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="最新" name="3">
          <view class="tab-content">
            <lk-icon name="clock" size="48" color="info" />
            <text class="tab-content__text">最新发布内容</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ② Card 卡片类型 -->
    <demo-block title="卡片类型 · Card">
      <lk-tabs v-model="activeTab2" type="card" :stretch="false">
        <lk-tab-pane label="全部" name="1">
          <view class="tab-content">
            <text class="tab-content__text">全部商品</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="女装" name="2">
          <view class="tab-content">
            <text class="tab-content__text">女装专区</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="男装" name="3">
          <view class="tab-content">
            <text class="tab-content__text">男装专区</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="配饰" name="4">
          <view class="tab-content">
            <text class="tab-content__text">配饰专区</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ③ Pill 胶囊类型 -->
    <demo-block title="胶囊类型 · Pill">
      <lk-tabs v-model="activeTab3" type="pill">
        <lk-tab-pane label="日榜" name="1">
          <view class="tab-content">
            <text class="tab-content__text">今日排行</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="周榜" name="2">
          <view class="tab-content">
            <text class="tab-content__text">本周排行</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="月榜" name="3">
          <view class="tab-content">
            <text class="tab-content__text">本月排行</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ④ 多 Tab 横向滚动 · Line -->
    <demo-block title="多 Tab 横向滚动 · Line">
      <lk-tabs v-model="activeScrollTab1" :stretch="false">
        <lk-tab-pane
          v-for="tab in scrollTabsLine"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <view class="tab-content">
            <lk-icon :name="tab.icon" size="48" color="primary" />
            <text class="tab-content__text">{{ tab.label }}的内容</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ⑤ 多 Tab 横向滚动 · Card -->
    <demo-block title="多 Tab 横向滚动 · Card">
      <lk-tabs v-model="activeScrollTab2" type="card" :stretch="false">
        <lk-tab-pane
          v-for="tab in scrollTabsCard"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <view class="tab-content">
            <text class="tab-content__text">{{ tab.label }}分类</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ⑥ 程序化切换 · 点击跳到远端 Tab -->
    <demo-block title="程序化跳转 · 自动滚动居中">
      <view class="jump-actions">
        <view
          v-for="(btn, idx) in jumpButtons"
          :key="idx"
          class="jump-btn"
          :class="{ 'jump-btn--active': activeJumpTab === btn.target }"
          @click="activeJumpTab = btn.target"
        >
          <text class="jump-btn__text">{{ btn.label }}</text>
        </view>
      </view>
      <lk-tabs v-model="activeJumpTab" :stretch="false">
        <lk-tab-pane
          v-for="tab in jumpTabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <view class="tab-content">
            <lk-icon :name="tab.icon" size="48" color="primary" />
            <text class="tab-content__text">当前: {{ tab.label }}</text>
            <text class="tab-content__sub">切换到远端 Tab 会自动滚动居中</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ⑦ header 插槽 -->
    <demo-block title="header 插槽 · 搜索栏">
      <lk-tabs v-model="activeTab4">
        <template #header>
          <view class="header-search">
            <lk-icon name="search" size="32" color="textTertiary" />
            <text class="header-search__text">搜索感兴趣的内容…</text>
          </view>
        </template>
        <lk-tab-pane label="综合" name="1">
          <view class="tab-content">
            <text class="tab-content__text">综合搜索结果</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="视频" name="2">
          <view class="tab-content">
            <text class="tab-content__text">视频搜索结果</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="图片" name="3">
          <view class="tab-content">
            <text class="tab-content__text">图片搜索结果</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ⑧ prefix / suffix 插槽 + 多 Tab 滚动 -->
    <demo-block title="prefix / suffix + 多 Tab 滚动">
      <lk-tabs v-model="activePrefixTab" :stretch="false">
        <template #prefix>
          <view class="slot-btn" @click="onBack">
            <lk-icon name="chevron-left" size="40" color="text" />
          </view>
        </template>
        <lk-tab-pane
          v-for="tab in prefixTabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <view class="tab-content">
            <text class="tab-content__text">{{ tab.label }}频道</text>
          </view>
        </lk-tab-pane>
        <template #suffix>
          <view class="slot-btn" @click="onMore">
            <lk-icon name="three-dots" size="40" color="text" />
          </view>
        </template>
      </lk-tabs>
    </demo-block>

    <!-- ⑨ tab 插槽 · 图标+文字 -->
    <demo-block title="tab 插槽 · 图标 + 文字">
      <lk-tabs v-model="activeTab6">
        <template #tab="{ item, active }">
          <view class="custom-tab" :class="{ 'custom-tab--active': active }">
            <lk-icon
              :name="getTabIcon(item.name)"
              :size="active ? '40' : '36'"
              :color="active ? 'primary' : 'textTertiary'"
            />
            <text class="custom-tab__label">{{ item.label }}</text>
          </view>
        </template>
        <lk-tab-pane label="首页" name="home">
          <view class="tab-content">
            <lk-icon name="house-fill" size="64" color="primary" />
            <text class="tab-content__text">首页内容区域</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="消息" name="chat">
          <view class="tab-content">
            <lk-icon name="chat-fill" size="64" color="primary" />
            <text class="tab-content__text">消息内容区域</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="收藏" name="star">
          <view class="tab-content">
            <lk-icon name="heart-fill" size="64" color="primary" />
            <text class="tab-content__text">收藏内容区域</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="我的" name="user">
          <view class="tab-content">
            <lk-icon name="gear-fill" size="64" color="primary" />
            <text class="tab-content__text">个人中心</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ⑩ tab 插槽 · 带徽标 -->
    <demo-block title="tab 插槽 · 带徽标">
      <lk-tabs v-model="activeTab7">
        <template #tab="{ item, active }">
          <view class="badge-tab" :class="{ 'badge-tab--active': active }">
            <text class="badge-tab__label">{{ item.label }}</text>
            <view
              v-if="getBadge(item.name)"
              class="badge-tab__badge"
            >
              <text class="badge-tab__badge-text">{{ getBadge(item.name) }}</text>
            </view>
          </view>
        </template>
        <lk-tab-pane label="消息" name="msg">
          <view class="tab-content">
            <text class="tab-content__text">消息列表</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="通知" name="notify">
          <view class="tab-content">
            <text class="tab-content__text">通知列表</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="待办" name="todo">
          <view class="tab-content">
            <text class="tab-content__text">待办事项</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ⑪ indicator 插槽 · 渐变指示器 -->
    <demo-block title="indicator 插槽 · 渐变指示器">
      <lk-tabs v-model="activeTab8">
        <template #indicator="{ left, width }">
          <view
            class="gradient-indicator"
            :style="{
              transform: `translateX(${left}px)`,
              width: `${width}px`,
            }"
          ></view>
        </template>
        <lk-tab-pane label="精选" name="1">
          <view class="tab-content">
            <text class="tab-content__text">精选内容</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="潮流" name="2">
          <view class="tab-content">
            <text class="tab-content__text">潮流动态</text>
          </view>
        </lk-tab-pane>
        <lk-tab-pane label="生活" name="3">
          <view class="tab-content">
            <text class="tab-content__text">生活方式</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- ⑫ 多 Tab + 自定义图标 Tab + 滚动 -->
    <demo-block title="多 Tab · 图标模式 · 滚动">
      <lk-tabs v-model="activeIconScroll" :stretch="false">
        <template #tab="{ item, active }">
          <view class="icon-scroll-tab" :class="{ 'icon-scroll-tab--active': active }">
            <lk-icon
              :name="getScrollIcon(item.name)"
              :size="active ? '44' : '38'"
              :color="active ? 'primary' : 'textTertiary'"
            />
            <text class="icon-scroll-tab__label">{{ item.label }}</text>
          </view>
        </template>
        <lk-tab-pane
          v-for="tab in iconScrollTabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <view class="tab-content">
            <lk-icon :name="tab.icon" size="56" color="primary" />
            <text class="tab-content__text">{{ tab.label }}</text>
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkTabs from '@/uni_modules/lucky-ui/components/lk-tabs/lk-tabs.vue';
import LkTabPane from '@/uni_modules/lucky-ui/components/lk-tabs/lk-tab-pane.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

// ── 基础 demos ───────────────────────────────
const activeTab1 = ref('1');
const activeTab2 = ref('1');
const activeTab3 = ref('1');
const activeTab4 = ref('1');
const activeTab6 = ref('home');
const activeTab7 = ref('msg');
const activeTab8 = ref('1');

// ── ④ 多 Tab 横向滚动 · Line ────────────────
const scrollTabsLine = [
  { name: 't1', label: '推荐', icon: 'star-fill' },
  { name: 't2', label: '热门', icon: 'lightning-fill' },
  { name: 't3', label: '科技', icon: 'gear' },
  { name: 't4', label: '娱乐', icon: 'music-note' },
  { name: 't5', label: '体育', icon: 'trophy' },
  { name: 't6', label: '财经', icon: 'cash-coin' },
  { name: 't7', label: '教育', icon: 'book' },
  { name: 't8', label: '健康', icon: 'heart-pulse' },
  { name: 't9', label: '美食', icon: 'cup-fill' },
  { name: 't10', label: '旅游', icon: 'geo-alt' },
];
const activeScrollTab1 = ref('t1');

// ── ⑤ 多 Tab 横向滚动 · Card ────────────────
const scrollTabsCard = [
  { name: 'c1', label: '全部' },
  { name: 'c2', label: '手机' },
  { name: 'c3', label: '电脑' },
  { name: 'c4', label: '平板' },
  { name: 'c5', label: '耳机' },
  { name: 'c6', label: '键盘' },
  { name: 'c7', label: '鼠标' },
  { name: 'c8', label: '显示器' },
  { name: 'c9', label: '摄像头' },
];
const activeScrollTab2 = ref('c1');

// ── ⑥ 程序化跳转 ────────────────────────────
const jumpTabs = [
  { name: 'j1', label: '北京', icon: 'geo-alt' },
  { name: 'j2', label: '上海', icon: 'geo-alt' },
  { name: 'j3', label: '广州', icon: 'geo-alt' },
  { name: 'j4', label: '深圳', icon: 'geo-alt' },
  { name: 'j5', label: '成都', icon: 'geo-alt' },
  { name: 'j6', label: '杭州', icon: 'geo-alt' },
  { name: 'j7', label: '武汉', icon: 'geo-alt' },
  { name: 'j8', label: '南京', icon: 'geo-alt' },
  { name: 'j9', label: '重庆', icon: 'geo-alt' },
  { name: 'j10', label: '西安', icon: 'geo-alt' },
  { name: 'j11', label: '长沙', icon: 'geo-alt' },
  { name: 'j12', label: '厦门', icon: 'geo-alt' },
];
const activeJumpTab = ref('j1');

const jumpButtons = [
  { label: '跳到 第1个', target: 'j1' },
  { label: '跳到 第6个', target: 'j6' },
  { label: '跳到 第12个', target: 'j12' },
  { label: '跳到 第8个', target: 'j8' },
];

// ── ⑧ prefix/suffix + 多 Tab ────────────────
const prefixTabs = [
  { name: 'p1', label: '关注' },
  { name: 'p2', label: '推荐' },
  { name: 'p3', label: '直播' },
  { name: 'p4', label: '同城' },
  { name: 'p5', label: '美食' },
  { name: 'p6', label: '知识' },
  { name: 'p7', label: '游戏' },
  { name: 'p8', label: '音乐' },
];
const activePrefixTab = ref('p1');

// ── ⑫ 多 Tab 图标滚动 ───────────────────────
const iconScrollTabs = [
  { name: 'is1', label: '首页', icon: 'house-fill' },
  { name: 'is2', label: '消息', icon: 'chat-fill' },
  { name: 'is3', label: '通知', icon: 'bell-fill' },
  { name: 'is4', label: '收藏', icon: 'heart-fill' },
  { name: 'is5', label: '钱包', icon: 'wallet-fill' },
  { name: 'is6', label: '设置', icon: 'gear-fill' },
  { name: 'is7', label: '相册', icon: 'image-fill' },
  { name: 'is8', label: '地图', icon: 'map-fill' },
  { name: 'is9', label: '日历', icon: 'calendar-fill' },
];
const activeIconScroll = ref('is1');

const scrollIconMap: Record<string, string> = {
  is1: 'house-fill',
  is2: 'chat-fill',
  is3: 'bell-fill',
  is4: 'heart-fill',
  is5: 'wallet-fill',
  is6: 'gear-fill',
  is7: 'image-fill',
  is8: 'map-fill',
  is9: 'calendar-fill',
};
function getScrollIcon(name: string) {
  return scrollIconMap[name] || 'app';
}

// ── 公共 helpers ─────────────────────────────
const tabIconMap: Record<string, string> = {
  home: 'house-fill',
  chat: 'chat-fill',
  star: 'heart-fill',
  user: 'gear-fill',
};
function getTabIcon(name: string) {
  return tabIconMap[name] || 'app';
}

const badgeMap: Record<string, string> = {
  msg: '5',
  notify: '12',
  todo: '',
};
function getBadge(name: string) {
  return badgeMap[name] || '';
}

function onBack() {
  uni.showToast({ title: '返回', icon: 'none' });
}
function onMore() {
  uni.showToast({ title: '更多操作', icon: 'none' });
}
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* ── 内容面板 ──────────────────────────── */
.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 64rpx 24rpx;
  font-size: 28rpx;
  color: var(--lk-color-text);
  text-align: center;
  background: var(--lk-color-bg);

  &__text {
    color: var(--lk-color-text-secondary);
    font-size: 26rpx;
  }

  &__sub {
    color: var(--lk-color-text-placeholder);
    font-size: 22rpx;
    margin-top: 4rpx;
  }
}

/* ── header 搜索栏 ────────────────────── */
.header-search {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin: 20rpx 24rpx;
  padding: 16rpx 24rpx;
  background: var(--lk-fill-1, rgba(0, 0, 0, 0.04));
  border-radius: var(--lk-radius-full, 999rpx);

  &__text {
    font-size: 26rpx;
    color: var(--lk-color-text-placeholder);
  }
}

/* ── prefix / suffix 按钮 ─────────────── */
.slot-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  cursor: pointer;
  border-radius: var(--lk-radius-full, 999rpx);
  transition: background 0.2s ease;

  &:active {
    background: var(--lk-fill-1, rgba(0, 0, 0, 0.04));
  }
}

/* ── 快捷跳转按钮组 ───────────────────── */
.jump-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 20rpx 24rpx;
}

.jump-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 24rpx;
  border-radius: var(--lk-radius-md, 12rpx);
  background: var(--lk-fill-1, rgba(0, 0, 0, 0.04));
  transition: all 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.96);
  }

  &--active {
    background: var(--lk-color-primary);

    .jump-btn__text {
      color: #ffffff;
    }
  }

  &__text {
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
    transition: color 0.2s ease;
  }
}

/* ── tab 插槽 · 图标+文字 ─────────────── */
.custom-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 8rpx 0;
  transition: all 0.25s ease;

  &__label {
    font-size: 22rpx;
    color: var(--lk-color-text-tertiary);
    transition: color 0.25s ease;
  }

  &--active {
    .custom-tab__label {
      color: var(--lk-color-primary);
      font-weight: 600;
    }
  }
}

/* ── tab 插槽 · 带徽标 ────────────────── */
.badge-tab {
  display: flex;
  align-items: center;
  gap: 8rpx;
  position: relative;

  &__label {
    font-size: var(--lk-font-size-base, 28rpx);
    color: var(--lk-color-text-secondary);
    transition: color 0.25s ease;
  }

  &--active {
    .badge-tab__label {
      color: var(--lk-color-primary);
      font-weight: 600;
    }
  }

  &__badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32rpx;
    height: 32rpx;
    padding: 0 8rpx;
    background: var(--lk-color-danger, #f56c6c);
    border-radius: var(--lk-radius-full, 999rpx);
    line-height: 1;
  }

  &__badge-text {
    font-size: 20rpx;
    color: #ffffff;
    font-weight: 600;
  }
}

/* ── indicator 插槽 · 渐变指示器 ──────── */
.gradient-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 8rpx;
  border-radius: var(--lk-radius-full, 999rpx);
  background: linear-gradient(90deg, var(--lk-color-primary), #ff6b6b);
  transition:
    transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  z-index: 1;
}

/* ── 多 Tab 图标滚动模式 ──────────────── */
.icon-scroll-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 8rpx 0;
  transition: all 0.25s ease;

  &__label {
    font-size: 22rpx;
    color: var(--lk-color-text-tertiary);
    transition: all 0.25s ease;
  }

  &--active {
    .icon-scroll-tab__label {
      color: var(--lk-color-primary);
      font-weight: 600;
    }
  }
}
</style>
