<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import ComponentCase from '@/components/showcase/component-case.vue';
import type { ShowcaseCase } from '@/components/showcase/showcase-cases';
import { SHOWCASE_CASES } from '@/components/showcase/showcase-cases';
import ButtonDemo from '@/components/demos/button-demo.vue';
import InputDemo from '@/components/demos/input-demo.vue';
import PickerDemo from '@/components/demos/picker-demo.vue';
import TabsDemo from '@/components/demos/tabs-demo.vue';
import TooltipDemo from '@/components/demos/tooltip-demo.vue';
import WaterfallDemo from '@/components/demos/waterfall-demo.vue';
import MetaRowDemo from '@/components/demos/meta-row-demo.vue';

/**
 * 当前筛选组件标识。
 * 注意事项：通过 query `component` 控制，空值表示展示全部。
 */
const currentSlug = ref('');

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
  const current = pages[pages.length - 1] as unknown as { options?: Record<string, string | undefined> };
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
  verified: '✅ 全平台已验证',
  pending: '⚠️ 待验证',
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
</script>

<template>
  <scroll-view scroll-y class="showcase-page">
    <view class="showcase-headline">
      <text class="headline-title">Lucky UI 组件跨平台展示台</text>
      <text class="headline-desc">统一展示组件变体并附带平台差异说明，用于视觉回归与人工复核。</text>
    </view>

    <view v-for="(groupItems, groupKey) in groupedCases" :key="groupKey" class="group-block">
      <text class="group-title">{{ groupLabelMap[groupKey as ShowcaseCase['group']] }}</text>

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
            <input-demo v-else-if="item.slug === 'input'" />
            <picker-demo v-else-if="item.slug === 'picker'" />
            <tabs-demo v-else-if="item.slug === 'tabs'" />
            <tooltip-demo v-else-if="item.slug === 'tooltip'" />
            <waterfall-demo v-else-if="item.slug === 'waterfall'" />
            <meta-row-demo v-else-if="item.slug === 'meta-row'" />
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
.showcase-page {
  height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: #f7f8fa;
}

.showcase-headline {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 16rpx;
}

.headline-title {
  display: block;
  color: #1f2329;
  font-size: 34rpx;
  font-weight: 700;
}

.headline-desc {
  display: block;
  margin-top: 10rpx;
  color: #4e5969;
  font-size: 24rpx;
  line-height: 1.6;
}

.showcase-block {
  margin-bottom: 32rpx;
}

.group-block {
  margin-bottom: 24rpx;
}

.group-title {
  display: block;
  margin-bottom: 12rpx;
  color: #1f2329;
  font-size: 28rpx;
  font-weight: 700;
}

.showcase-empty {
  padding: 40rpx 20rpx;
  text-align: center;
}

.empty-title {
  display: block;
  color: #1f2329;
  font-size: 30rpx;
  font-weight: 600;
}

.empty-desc {
  display: block;
  margin-top: 10rpx;
  color: #86909c;
  font-size: 24rpx;
}
</style>
