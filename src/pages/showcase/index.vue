<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import ComponentCase from '@/components/showcase/component-case.vue';
import type { ShowcaseCase } from '@/components/showcase/showcase-cases';
import { SHOWCASE_CASES } from '@/components/showcase/showcase-cases';
import ActionSheetDemo from '@/components/demos/action-sheet-demo.vue';
import AnchorDemo from '@/components/demos/anchor-demo.vue';
import AvatarDemo from '@/components/demos/avatar-demo.vue';
import BacktopDemo from '@/components/demos/backtop-demo.vue';
import BadgeDemo from '@/components/demos/badge-demo.vue';
import ButtonDemo from '@/components/demos/button-demo.vue';
import CalendarDemo from '@/components/demos/calendar-demo.vue';
import CardDemo from '@/components/demos/card-demo.vue';
import CarouselDemo from '@/components/demos/carousel-demo.vue';
import CellDemo from '@/components/demos/cell-demo.vue';
import ChartBarDemo from '@/components/demos/chart-bar-demo.vue';
import ChartLiteDemo from '@/components/demos/chart-lite-demo.vue';
import ChartLineDemo from '@/components/demos/chart-line-demo.vue';
import ChartPieDemo from '@/components/demos/chart-pie-demo.vue';
import CheckboxDemo from '@/components/demos/checkbox-demo.vue';
import ChoiceDemo from '@/components/demos/choice-demo.vue';
import CollapseDemo from '@/components/demos/collapse-demo.vue';
import CountdownDemo from '@/components/demos/countdown-demo.vue';
import CurtainDemo from '@/components/demos/curtain-demo.vue';
import DatePickerDemo from '@/components/demos/date-picker-demo.vue';
import DividerDemo from '@/components/demos/divider-demo.vue';
import DropdownDemo from '@/components/demos/dropdown-demo.vue';
import EmptyDemo from '@/components/demos/empty-demo.vue';
import FabDemo from '@/components/demos/fab-demo.vue';
import FormDemo from '@/components/demos/form-demo.vue';
import GridDemo from '@/components/demos/grid-demo.vue';
import HorizontalScrollDemo from '@/components/demos/horizontal-scroll-demo.vue';
import IconDemo from '@/components/demos/icon-demo.vue';
import ImageDemo from '@/components/demos/image-demo.vue';
import IndexBarDemo from '@/components/demos/index-bar-demo.vue';
import InputDemo from '@/components/demos/input-demo.vue';
import LoadingDemo from '@/components/demos/loading-demo.vue';
import NoticeBarDemo from '@/components/demos/notice-bar-demo.vue';
import PickerDemo from '@/components/demos/picker-demo.vue';
import NavbarDemo from '@/components/demos/navbar-demo.vue';
import NumberRollerDemo from '@/components/demos/number-roller-demo.vue';
import OverlayDemo from '@/components/demos/overlay-demo.vue';
import ProgressDemo from '@/components/demos/progress-demo.vue';
import RadioDemo from '@/components/demos/radio-demo.vue';
import RateDemo from '@/components/demos/rate-demo.vue';
import SegmentedDemo from '@/components/demos/segmented-demo.vue';
import StickyDemo from '@/components/demos/sticky-demo.vue';
import SkeletonDemo from '@/components/demos/skeleton-demo.vue';
import SliderDemo from '@/components/demos/slider-demo.vue';
import SpaceDemo from '@/components/demos/space-demo.vue';
import StepperDemo from '@/components/demos/stepper-demo.vue';
import SwitchDemo from '@/components/demos/switch-demo.vue';
import TabbarBasicDemo from '@/components/demos/tabbar-basic-demo.vue';
import TabbarContainerDemo from '@/components/demos/tabbar-container-demo.vue';
import TabsDemo from '@/components/demos/tabs-demo.vue';
import TagDemo from '@/components/demos/tag-demo.vue';
import TextareaDemo from '@/components/demos/textarea-demo.vue';
import TimePickerDemo from '@/components/demos/time-picker-demo.vue';
import TimelineDemo from '@/components/demos/timeline-demo.vue';
import ToastDemo from '@/components/demos/toast-demo.vue';
import UploadDemo from '@/components/demos/upload-demo.vue';
import VerifyCodeDemo from '@/components/demos/verify-code-demo.vue';
import ModalDemo from '@/components/demos/modal-demo.vue';
import PopupDemo from '@/components/demos/popup-demo.vue';
import TooltipDemo from '@/components/demos/tooltip-demo.vue';
import WaterfallDemo from '@/components/demos/waterfall-demo.vue';
import WatermarkDemo from '@/components/demos/watermark-demo.vue';
import MetaRowDemo from '@/components/demos/meta-row-demo.vue';
import KeyboardDemo from '@/components/demos/keyboard-demo.vue';
import VirtualListDemo from '@/components/demos/virtual-list-demo.vue';

/**
 * 当前筛选组件标识。
 * 注意事项：通过 query `component` 控制，空值表示展示全部。
 */
const currentSlug = ref('');
const themeStore = useThemeStore();
const themeClass = computed(() => themeStore.themeClass);
const brandStyleVars = computed(() => themeStore.brandStyleVars);

/**
 * 读取并应用路由参数。
 * @param slug 组件标识
 */
const applyComponentSlug = (slug: string | undefined) => {
  const normalized = (slug || '').trim().toLowerCase();
  currentSlug.value = normalized;
};

/**
 * 从当前页面实例读取 query。
 * @returns 组件标识
 */
const readCurrentPageComponent = () => {
  const pages = getCurrentPages();
  const current = pages[pages.length - 1] as unknown as {
    options?: Record<string, string | undefined>;
  };
  return current?.options?.component || '';
};

onLoad((options?: { component?: string }) => {
  applyComponentSlug(options?.component);
});

onShow(() => {
  applyComponentSlug(readCurrentPageComponent());
});

// #ifdef H5
const syncFromHash = () => {
  const hash = window.location.hash || '';
  const query = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  const params = new URLSearchParams(query);
  applyComponentSlug(params.get('component') || '');
};

onMounted(() => {
  syncFromHash();
  window.addEventListener('hashchange', syncFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncFromHash);
});
// #endif

const visibleCases = computed(() =>
  SHOWCASE_CASES.filter(item => {
    if (!currentSlug.value) {
      return true;
    }
    return item.slug === currentSlug.value;
  })
);

/**
 * 分组文案映射。
 */
const groupLabelMap: Record<ShowcaseCase['group'], string> = {
  basic: '基础组件',
  form: '表单组件',
  feedback: '反馈组件',
  advanced: '高级组件',
};

/**
 * 验证状态文案映射。
 */
const verifyStatusLabelMap: Record<ShowcaseCase['verifyStatus'], string> = {
  verified: '已验证',
  pending: '待验证',
};

/**
 * 风险等级文案映射。
 */
const riskLevelLabelMap: Record<ShowcaseCase['riskLevel'], string> = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
};

/**
 * 风险等级到标签类型映射。
 */
const riskTagTypeMap: Record<ShowcaseCase['riskLevel'], 'low' | 'medium' | 'high'> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

const groupedCases = computed(() => {
  const groups: Record<string, ShowcaseCase[]> = {};
  for (const item of visibleCases.value) {
    const groupKey = item.group;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  }
  return groups;
});

const totalCount = computed(() => visibleCases.value.length);
const verifiedCount = computed(
  () => visibleCases.value.filter(item => item.verifyStatus === 'verified').length
);
const lowRiskCount = computed(
  () => visibleCases.value.filter(item => item.riskLevel === 'low').length
);
</script>

<template>
  <scroll-view scroll-y class="showcase-page" :class="themeClass" :style="brandStyleVars">
    <view class="showcase-hero">
      <view class="hero-copy">
        <text class="hero-kicker">Lucky UI Preview</text>
        <text class="hero-title">组件预览台</text>
        <text class="hero-desc">移动端质感、清晰分组、稳定回归。</text>
      </view>
      <view class="hero-metrics">
        <view class="metric-item">
          <text class="metric-value">{{ totalCount }}</text>
          <text class="metric-label">组件</text>
        </view>
        <view class="metric-divider" />
        <view class="metric-item">
          <text class="metric-value">{{ verifiedCount }}</text>
          <text class="metric-label">已验证</text>
        </view>
        <view class="metric-divider" />
        <view class="metric-item">
          <text class="metric-value">{{ lowRiskCount }}</text>
          <text class="metric-label">低风险</text>
        </view>
      </view>
    </view>

    <view v-for="(groupItems, groupKey) in groupedCases" :key="groupKey" class="group-block">
      <view class="group-heading">
        <text class="group-title">{{ groupLabelMap[groupKey as ShowcaseCase['group']] }}</text>
        <text class="group-count">{{ groupItems.length }}</text>
      </view>

      <view v-for="item in groupItems" :key="item.slug" class="showcase-block">
        <component-case
          :title="item.title"
          :group-label="groupLabelMap[item.group]"
          :verify-status-label="verifyStatusLabelMap[item.verifyStatus]"
          :risk-level-label="riskLevelLabelMap[item.riskLevel]"
          :verify-status-type="item.verifyStatus === 'verified' ? 'ok' : 'warn'"
          :risk-type="riskTagTypeMap[item.riskLevel]"
          :risk-notes="item.riskNotes"
        >
          <template #demo>
            <button-demo v-if="item.slug === 'button'" />
            <calendar-demo v-else-if="item.slug === 'calendar'" />
            <card-demo v-else-if="item.slug === 'card'" />
            <icon-demo v-else-if="item.slug === 'icon'" />
            <avatar-demo v-else-if="item.slug === 'avatar'" />
            <backtop-demo v-else-if="item.slug === 'backtop'" />
            <action-sheet-demo v-else-if="item.slug === 'action-sheet'" />
            <badge-demo v-else-if="item.slug === 'badge'" />
            <cell-demo v-else-if="item.slug === 'cell'" />
            <carousel-demo v-else-if="item.slug === 'carousel'" />
            <chart-bar-demo v-else-if="item.slug === 'chart-bar'" />
            <chart-lite-demo v-else-if="item.slug === 'chart-lite'" />
            <chart-line-demo v-else-if="item.slug === 'chart-line'" />
            <chart-pie-demo v-else-if="item.slug === 'chart-pie'" />
            <checkbox-demo v-else-if="item.slug === 'checkbox'" />
            <choice-demo v-else-if="item.slug === 'choice'" />
            <collapse-demo v-else-if="item.slug === 'collapse'" />
            <countdown-demo v-else-if="item.slug === 'countdown'" />
            <divider-demo v-else-if="item.slug === 'divider'" />
            <empty-demo v-else-if="item.slug === 'empty'" />
            <curtain-demo v-else-if="item.slug === 'curtain'" />
            <date-picker-demo v-else-if="item.slug === 'date-picker'" />
            <dropdown-demo v-else-if="item.slug === 'dropdown'" />
            <form-demo v-else-if="item.slug === 'form'" />
            <image-demo v-else-if="item.slug === 'image'" />
            <input-demo v-else-if="item.slug === 'input'" />
            <grid-demo v-else-if="item.slug === 'grid'" />
            <anchor-demo v-else-if="item.slug === 'anchor'" />
            <index-bar-demo v-else-if="item.slug === 'index-bar'" />
            <horizontal-scroll-demo v-else-if="item.slug === 'horizontal-scroll'" />
            <loading-demo v-else-if="item.slug === 'loading'" />
            <modal-demo v-else-if="item.slug === 'modal'" />
            <navbar-demo v-else-if="item.slug === 'navbar'" />
            <notice-bar-demo v-else-if="item.slug === 'notice-bar'" />
            <number-roller-demo v-else-if="item.slug === 'number-roller'" />
            <overlay-demo v-else-if="item.slug === 'overlay'" />
            <picker-demo v-else-if="item.slug === 'picker'" />
            <popup-demo v-else-if="item.slug === 'popup'" />
            <progress-demo v-else-if="item.slug === 'progress'" />
            <radio-demo v-else-if="item.slug === 'radio'" />
            <rate-demo v-else-if="item.slug === 'rate'" />
            <fab-demo v-else-if="item.slug === 'fab'" />
            <segmented-demo v-else-if="item.slug === 'segmented'" />
            <skeleton-demo v-else-if="item.slug === 'skeleton'" />
            <slider-demo v-else-if="item.slug === 'slider'" />
            <space-demo v-else-if="item.slug === 'space'" />
            <stepper-demo v-else-if="item.slug === 'stepper'" />
            <switch-demo v-else-if="item.slug === 'switch'" />
            <tag-demo v-else-if="item.slug === 'tag'" />
            <tabs-demo v-else-if="item.slug === 'tabs'" />
            <tabbar-basic-demo v-else-if="item.slug === 'tabbar'" />
            <tabbar-container-demo v-else-if="item.slug === 'tabbar-container'" />
            <sticky-demo v-else-if="item.slug === 'sticky'" />
            <textarea-demo v-else-if="item.slug === 'textarea'" />
            <time-picker-demo v-else-if="item.slug === 'time-picker'" />
            <timeline-demo v-else-if="item.slug === 'timeline'" />
            <toast-demo v-else-if="item.slug === 'toast'" />
            <upload-demo v-else-if="item.slug === 'upload'" />
            <verify-code-demo v-else-if="item.slug === 'verify-code'" />
            <tooltip-demo v-else-if="item.slug === 'tooltip'" />
            <waterfall-demo v-else-if="item.slug === 'waterfall'" />
            <watermark-demo v-else-if="item.slug === 'watermark'" />
            <meta-row-demo v-else-if="item.slug === 'meta-row'" />
            <keyboard-demo v-else-if="item.slug === 'keyboard'" />
            <virtual-list-demo v-else-if="item.slug === 'virtual-list'" />
          </template>
        </component-case>
      </view>
    </view>

    <view v-if="visibleCases.length === 0" class="showcase-empty">
      <text class="empty-title">未匹配到组件</text>
      <text class="empty-desc">请检查 query 参数 `component` 是否正确。</text>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
@use '@/styles/test-page.scss' as *;

.showcase-page {
  height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: $test-bg-page;
}

.showcase-hero {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  margin-bottom: 40rpx;
  padding: 40rpx;
  background: $test-bg-card;
  border: 1rpx solid $test-border-color;
  border-radius: 36rpx;
  box-shadow: $test-shadow-sm;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.hero-kicker {
  display: block;
  color: $test-primary;
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 0;
}

.hero-title {
  display: block;
  color: $test-text-primary;
  font-size: 48rpx;
  font-weight: 800;
  line-height: 1.1;
}

.hero-desc {
  display: block;
  color: $test-text-secondary;
  font-size: 24rpx;
  line-height: 1.5;
}

.hero-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  background: $test-gray-50;
  border: 1rpx solid $test-border-color;
  border-radius: 28rpx;
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.metric-value {
  color: $test-text-primary;
  font-size: 34rpx;
  font-weight: 800;
}

.metric-label {
  color: $test-text-tertiary;
  font-size: 20rpx;
}

.metric-divider {
  width: 1rpx;
  height: 44rpx;
  background: $test-border-color;
}

.showcase-block {
  margin-bottom: 36rpx;
}

.group-block {
  margin-bottom: 40rpx;
}

.group-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.group-title {
  display: block;
  color: $test-text-primary;
  font-size: 32rpx;
  font-weight: 800;
}

.group-count {
  min-width: 48rpx;
  height: 48rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  background: $test-bg-card;
  border: 1rpx solid $test-border-color;
  color: $test-text-secondary;
  font-size: 22rpx;
  font-weight: 700;
  line-height: 48rpx;
  text-align: center;
  box-sizing: border-box;
}

.showcase-empty {
  padding: 40rpx 20rpx;
  text-align: center;
}

.empty-title {
  display: block;
  color: $test-text-primary;
  font-size: 30rpx;
  font-weight: 600;
}

.empty-desc {
  display: block;
  margin-top: 10rpx;
  color: $test-text-tertiary;
  font-size: 24rpx;
}
</style>
