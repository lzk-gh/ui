<template>
  <scroll-view class="discover-page" :style="{ height: contentHeight }" scroll-y>
      <lk-space direction="vertical" :gap="24">
      <!-- 搜索栏 -->
      <view class="section-search">
        <lk-input v-model="searchText" placeholder="搜索组件..." prefix-icon="search" />
      </view>

      <!-- 轮播图 -->
      <view class="section-banner">
        <lk-carousel :carousel-list="banners" height="460rpx" indicator-type="number" indicator-position="bottom-right">
          <template #default="{ item }">
            <lk-image :src="item" width="100%" height="460rpx" fit="cover" />
          </template>
        </lk-carousel>
      </view>

      <!-- 通知栏 -->
      <view class="section-notice">
        <lk-notice-bar :scrollable="true" icon="notification" text="Lucky UI：用组件组合出真实业务页面" />
      </view>

      <!-- 金刚区/功能入口 -->
      <view class="section-grid">
        <lk-card title="功能入口" shadow="base">
          <lk-grid :carousel="true" :columns="4" :gap="16"  :item-gap="12" :rows="2" :items="gridItems" />
        </lk-card>
      </view>

      <!-- 组件组合演示：更充分展示常用交互组件 -->
      <view class="section-demo">
          <lk-cell title="筛选">
            <template #value>
              <lk-segmented v-model="segment" :options="segmentOptions" block />
            </template>
          </lk-cell>
          <lk-cell title="开关">
            <template #value>
              <lk-switch v-model="switchValue" />
            </template>
          </lk-cell>
          <lk-cell title="数量">
            <template #value>
              <lk-stepper v-model="count" :min="1" :max="99" />
            </template>
          </lk-cell>
          <lk-cell title="评分">
            <template #value>
              <lk-rate v-model="rate" />
            </template>
          </lk-cell>
      </view>

      <!-- 推荐组件 -->
      <view class="section-recommend">
        <lk-cell title="热门推荐" value="查看全部" clickable arrow @click="handleMoreClick" />

        <view class="card-list">
          <lk-card
            v-for="(item, index) in recommendList"
            :key="index"
            :title="item.title"
            shadow="hover"
            hoverable
          >
            <template #header-extra>
              <lk-tag type="light" size="sm">{{ item.extra }}</lk-tag>
            </template>
            <view class="card-content">
              <text class="card-desc">{{ item.desc }}</text>
              <view class="card-tags">
                <lk-tag
                  v-for="tag in item.tags"
                  :key="tag"
                  type="light"
                  size="sm"
                  style="margin-right: 10rpx;"
                >
                  {{ tag }}
                </lk-tag>
              </view>
            </view>
            <template #footer>
              <view class="card-footer">
                <lk-button size="sm" plain @click="goToDetail(item)">
                  查看详情
                </lk-button>
              </view>
            </template>
          </lk-card>
        </view>
      </view>
    </lk-space>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 组件导入
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkCarousel from '@/uni_modules/lucky-ui/components/lk-carousel/lk-carousel.vue';
import LkImage from '@/uni_modules/lucky-ui/components/lk-image/lk-image.vue';
import LkNoticeBar from '@/uni_modules/lucky-ui/components/lk-notice-bar/lk-notice-bar.vue';
import LkGrid from '@/uni_modules/lucky-ui/components/lk-grid/lk-grid.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkSegmented from '@/uni_modules/lucky-ui/components/lk-segmented/lk-segmented.vue';
import LkSwitch from '@/uni_modules/lucky-ui/components/lk-switch/lk-switch.vue';
import LkStepper from '@/uni_modules/lucky-ui/components/lk-stepper/lk-stepper.vue';
import LkRate from '@/uni_modules/lucky-ui/components/lk-rate/lk-rate.vue';

defineProps<{ contentHeight: string }>();

const searchText = ref('');

const segment = ref<string | number>('recommend');
const segmentOptions = [
  { label: '推荐', value: 'recommend' },
  { label: '最新', value: 'latest' },
  { label: '热榜', value: 'hot' },
];
const switchValue = ref(false);
const count = ref<number | string>(1);
const rate = ref(4);

const banners = [
  'https://img01.yzcdn.cn/vant/cat.jpeg',
  'https://img01.yzcdn.cn/vant/cat.jpeg',
  'https://img01.yzcdn.cn/vant/cat.jpeg',
];

const gridItems = [
  { icon: 'box', text: '基础组件', type: 'basic' },
  { icon: 'box', text: '表单组件', type: 'form' },
  { icon: 'chat', text: '反馈组件', type: 'feedback' },
  { icon: 'box', text: '数据展示', type: 'data' },
  { icon: 'box', text: '导航组件', type: 'nav' },
  { icon: 'image', text: '媒体组件', type: 'media' },
  { icon: 'box', text: '业务组件', type: 'business' },
  { icon: 'box', text: '更多', type: 'more' },
  { icon: 'box', text: '更多', type: 'more' },
  { icon: 'box', text: '更多', type: 'more' },
];

type RecommendItem = {
  title: string;
  extra: string;
  desc: string;
  tags: string[];
  path: string;
};

const recommendList: RecommendItem[] = [
  {
    title: 'Button 按钮',
    extra: 'v1.0.0',
    desc: '按钮用于触发一个操作，如提交表单、取消操作等。支持多种类型、尺寸和状态。',
    tags: ['基础', '交互'],
    path: 'button'
  },
  {
    title: 'Form 表单',
    extra: 'v1.0.0',
    desc: '高性能表单组件，支持数据校验、自定义布局，轻松构建复杂表单页面。',
    tags: ['表单', '录入'],
    path: 'form'
  },
  {
    title: 'Chart 图表',
    extra: 'v1.0.0',
    desc: '基于 Canvas 的轻量级图表组件，支持折线图、柱状图、饼图等多种图表类型。',
    tags: ['数据', '可视化'],
    path: 'chart-line'
  },
];

const handleMoreClick = () => {
  uni.showToast({ title: '更多推荐开发中', icon: 'none' });
};

const goToDetail = (item: RecommendItem) => {
  uni.navigateTo({
    url: `/pages/component-detail/index?name=${item.path}`
  });
};
</script>
