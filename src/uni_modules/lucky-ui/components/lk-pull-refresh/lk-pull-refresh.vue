<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { addUnit } from '../../core/src/utils/unit';
import LkLoading from '../lk-loading/lk-loading.vue';
import { PullRefreshStatus, pullRefreshEmits, pullRefreshProps } from './pull-refresh.props';
import type { PullRefreshStatus as PullRefreshStatusType } from './pull-refresh.props';
import { useLocale } from '../../composables/useLocale';

defineOptions({ name: 'LkPullRefresh' });

const props = defineProps(pullRefreshProps);
const emit = defineEmits(pullRefreshEmits);
const { t } = useLocale('pullRefresh');

const status = ref<PullRefreshStatusType>(
  props.modelValue ? PullRefreshStatus.Refreshing : PullRefreshStatus.Idle
);
const triggered = ref(props.modelValue);
const refresherActive = ref(props.modelValue);
const pullingDistance = ref(0);
const scrollTop = ref(0);
let successTimer: ReturnType<typeof setTimeout> | null = null;

interface RefresherPullingEvent {
  detail?: {
    dy?: number;
  };
}

const classes = computed(() => [
  'lk-pull-refresh',
  `lk-pull-refresh--${status.value}`,
  {
    'is-disabled': props.disabled,
    'is-active': isIndicatorVisible.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => ({
  height: addUnit(props.height),
  background: props.background,
}));

const indicatorText = computed(() => {
  if (status.value === PullRefreshStatus.Refreshing) return props.loadingText || t('loading');
  if (status.value === PullRefreshStatus.Success) return props.successText || t('success');
  if (status.value === PullRefreshStatus.Loosing) return props.loosingText || t('loosing');
  return props.pullingText || t('pulling');
});

const isIndicatorVisible = computed(
  () =>
    refresherActive.value &&
    (status.value === PullRefreshStatus.Refreshing ||
      status.value === PullRefreshStatus.Success ||
      pullingDistance.value > 0)
);

const progress = computed(() => {
  if (status.value === PullRefreshStatus.Refreshing || status.value === PullRefreshStatus.Success) {
    return 1;
  }
  return Math.min(1, pullingDistance.value / Math.max(1, props.threshold));
});

const indicatorStyle = computed(() => ({
  opacity: isIndicatorVisible.value ? 1 : 0,
  transform: `translate3d(0, ${Math.min(18, progress.value * 18)}rpx, 0)`,
}));

watch(
  () => props.modelValue,
  value => {
    if (value) {
      clearSuccessTimer();
      triggered.value = true;
      refresherActive.value = true;
      status.value = PullRefreshStatus.Refreshing;
      return;
    }
    settleRefresh();
  }
);

onUnmounted(() => {
  clearSuccessTimer();
});

function onPulling(event: RefresherPullingEvent) {
  if (props.disabled || status.value === PullRefreshStatus.Refreshing) return;
  const distance = Number(event?.detail?.dy ?? 0);
  pullingDistance.value = Math.max(0, distance);
  if (pullingDistance.value <= 0) {
    resetIndicator();
    return;
  }
  refresherActive.value = true;
  status.value =
    pullingDistance.value >= props.threshold
      ? PullRefreshStatus.Loosing
      : PullRefreshStatus.Pulling;
}

function onRefresh() {
  if (props.disabled) {
    triggered.value = false;
    return;
  }
  clearSuccessTimer();
  triggered.value = true;
  refresherActive.value = true;
  status.value = PullRefreshStatus.Refreshing;
  pullingDistance.value = props.threshold;
  emit('update:modelValue', true);
  emit('refresh');
}

function onRestore(event: unknown) {
  resetIndicator();
  emit('restore', event);
}

function onAbort(event: unknown) {
  resetIndicator();
  emit('abort', event);
}

function onScroll(event: unknown) {
  emit('scroll', event);
}

function onScrollToLower(event: unknown) {
  emit('scrolltolower', event);
}

function start() {
  if (props.disabled || status.value === PullRefreshStatus.Refreshing) return;
  clearSuccessTimer();
  triggered.value = true;
  refresherActive.value = true;
  status.value = PullRefreshStatus.Refreshing;
  pullingDistance.value = props.threshold;
  emit('update:modelValue', true);
  emit('refresh');
}

function finish() {
  emit('update:modelValue', false);
  settleRefresh();
}

function scrollToTop() {
  scrollTop.value = scrollTop.value === 0 ? 1 : 0;
  setTimeout(() => {
    scrollTop.value = 0;
  }, 0);
}

function settleRefresh() {
  triggered.value = false;
  pullingDistance.value = 0;
  if (status.value === PullRefreshStatus.Success) return;
  if (status.value === PullRefreshStatus.Refreshing && props.showSuccess) {
    clearSuccessTimer();
    status.value = PullRefreshStatus.Success;
    successTimer = setTimeout(
      () => {
        status.value = PullRefreshStatus.Idle;
      },
      Math.max(0, props.successDuration)
    );
    return;
  }
  clearSuccessTimer();
  resetIndicator();
}

function resetIndicator() {
  clearSuccessTimer();
  triggered.value = false;
  refresherActive.value = false;
  pullingDistance.value = 0;
  status.value = PullRefreshStatus.Idle;
}

function clearSuccessTimer() {
  if (!successTimer) return;
  clearTimeout(successTimer);
  successTimer = null;
}

defineExpose({
  start,
  finish,
  scrollToTop,
});
</script>

<template>
  <view :id="props.id" :class="classes" :style="[rootStyle, props.customStyle as any]">
    <view class="lk-pull-refresh__indicator" :style="indicatorStyle">
      <slot
        v-if="isIndicatorVisible"
        name="indicator"
        :status="status"
        :pulling-distance="pullingDistance"
        :refreshing="status === PullRefreshStatus.Refreshing"
        :progress="progress"
      >
        <view class="lk-pull-refresh__indicator-inner">
          <view class="lk-pull-refresh__main">
            <slot
              name="icon"
              :status="status"
              :pulling-distance="pullingDistance"
              :refreshing="status === PullRefreshStatus.Refreshing"
              :progress="progress"
            />
            <slot
              name="text"
              :status="status"
              :pulling-distance="pullingDistance"
              :refreshing="status === PullRefreshStatus.Refreshing"
              :progress="progress"
            >
              <lk-loading
                v-if="status !== PullRefreshStatus.Success"
                type="text"
                :text="indicatorText"
              />
              <text v-else class="lk-pull-refresh__text">
                {{ indicatorText }}
              </text>
            </slot>
          </view>
        </view>
      </slot>
    </view>

    <scroll-view
      class="lk-pull-refresh__scroll"
      scroll-y
      :scroll-top="scrollTop"
      :refresher-enabled="!props.disabled"
      :refresher-triggered="triggered"
      :refresher-threshold="props.threshold"
      :refresher-background="props.background"
      :refresher-default-style="props.defaultStyle"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @refresherabort="onAbort"
      @scroll="onScroll"
      @scrolltolower="onScrollToLower"
    >
      <slot />
    </scroll-view>
  </view>
</template>

<style lang="scss">
@use './lk-pull-refresh.scss';
</style>
