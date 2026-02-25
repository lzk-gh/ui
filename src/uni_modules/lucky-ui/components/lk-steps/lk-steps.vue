<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue';
import { stepsProps, stepsEmits } from './steps.props';
import type { StepCardItem } from './steps.props';

defineOptions({ name: 'LkSteps' });

const props = defineProps(stepsProps);
const emit = defineEmits(stepsEmits);

// ─── 总步骤数 & 进度 ──────────────────────────────────────────────────────────
const total = computed(() => props.items.length);

const progressPercent = computed(() => {
  if (total.value <= 1) return 0;
  return (props.current / (total.value - 1)) * 100;
});

// ─── Story 模式：分段进度条填充百分比 ─────────────────────────────────────────
/** 每段填充比例 0~1 */
function segFill(idx: number): number {
  if (idx < props.current) return 1;
  if (idx > props.current) return 0;
  return storySegPercent.value;
}

const storySegPercent = ref(0);
let storyTimer: ReturnType<typeof setInterval> | null = null;
let storyTimeout: ReturnType<typeof setTimeout> | null = null;

function clearStoryTimers() {
  if (storyTimer !== null) { clearInterval(storyTimer); storyTimer = null; }
  if (storyTimeout !== null) { clearTimeout(storyTimeout); storyTimeout = null; }
}

function startStoryAutoplay() {
  clearStoryTimers();
  if (!props.autoplay || props.type !== 'story') return;
  const dur = props.autoplay;
  const tick = 16; // ~60fps
  let elapsed = 0;
  storySegPercent.value = 0;
  storyTimer = setInterval(() => {
    elapsed += tick;
    storySegPercent.value = Math.min(elapsed / dur, 1);
    if (elapsed >= dur) {
      clearStoryTimers();
      goNext();
    }
  }, tick);
}

watch(() => props.current, () => {
  storySegPercent.value = 0;
  startStoryAutoplay();
}, { immediate: true });

watch(() => props.type, (t) => {
  if (t !== 'story') clearStoryTimers();
  else startStoryAutoplay();
});

onUnmounted(clearStoryTimers);

// ─── Story / Stack：点击区域导航 ──────────────────────────────────────────────
const isCardMode = computed(() => ['story', 'stack'].includes(props.type));

function onCardTap(e: Record<string, unknown>) {
  if (!isCardMode.value) return;
  // H5: offsetX；小程序：touches[0].clientX
  let isRight = true;
  const target = e?.currentTarget as Record<string, unknown> | undefined;
  const touches = e?.touches as Array<Record<string, unknown>> | undefined;
  if (typeof e?.offsetX === 'number' && typeof (target as Record<string, unknown> | undefined)?.offsetWidth === 'number') {
    isRight = (e.offsetX as number) > ((target?.offsetWidth as number) / 2);
  } else if (touches?.[0] && target?.offsetWidth) {
    isRight = (touches[0].clientX as number) > ((target.offsetWidth as number) / 2);
  }
  if (isRight) goNext(); else goPrev();
}

function goNext() {
  if (props.current < total.value - 1) {
    const next = props.current + 1;
    emit('update:current', next);
    emit('change', next);
  }
}

function goPrev() {
  if (props.current > 0) {
    const prev = props.current - 1;
    emit('update:current', prev);
    emit('change', prev);
  }
}

// ─── Stack 模式：卡片样式计算 ──────────────────────────────────────────────────
/**
 * 计算第 idx 张卡片相对于当前卡片的层叠偏移状态
 * only show current, current+1, current+2
 */
function stackCardStyle(idx: number): Record<string, string> {
  const diff = idx - props.current;
  if (diff < 0 || diff > 2) return { display: 'none' };
  const scale = 1 - diff * 0.04;
  const translateY = diff * 18; // rpx per layer
  const opacity = diff === 0 ? '1' : diff === 1 ? '0.7' : '0.4';
  const zIndex = String(10 - diff);
  return {
    transform: `scale(${scale}) translateY(${translateY}rpx)`,
    opacity,
    'z-index': zIndex,
    'pointer-events': diff === 0 ? 'auto' : 'none',
  };
}

/** 计算 Story 背景渐变或图片 */
function storyBg(item: StepCardItem | undefined): string {
  if (!item) return '';
  if (item.bgImage) {
    return `url("${item.bgImage}") center center / cover no-repeat`;
  }
  if (!item.gradient) {
    return `linear-gradient(135deg, var(--lk-color-primary), var(--lk-brand-400))`;
  }
  return `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`;
}
</script>

<template>
  <!-- ═══════════════════════ STORY 模式 ═══════════════════════ -->
  <view
    v-if="type === 'story'"
    class="lk-steps lk-steps--story"
    @tap="onCardTap"
  >
    <!-- 顶部分段进度条 -->
    <view class="lk-steps__story-bars">
      <view
        v-for="(_, idx) in items"
        :key="idx"
        class="lk-steps__story-bar"
      >
        <view
          class="lk-steps__story-bar-fill"
          :style="{ width: `${segFill(idx) * 100}%`, 'transition-duration': idx === current && autoplay ? `0ms` : '300ms' }"
        />
      </view>
    </view>

    <!-- 卡片内容区 -->
    <view
      v-for="(item, idx) in items"
      :key="idx"
      class="lk-steps__story-card"
      :class="{ 'is-active': idx === current, 'is-prev': idx < current }"
      :style="{ background: storyBg(item), height: cardHeight ? `${cardHeight}rpx` : undefined }"
    >
      <view v-if="item.tag" class="lk-steps__story-tag">
        <text>{{ item.tag }}</text>
      </view>
      <view class="lk-steps__story-body">
        <view v-if="item.icon" class="lk-steps__story-icon">
          <lk-icon :name="item.icon" size="80" color="#fff" />
        </view>
        <text class="lk-steps__story-title">{{ item.title }}</text>
        <text v-if="item.subtitle" class="lk-steps__story-subtitle">{{ item.subtitle }}</text>
        <text v-if="item.description" class="lk-steps__story-desc">{{ item.description }}</text>
      </view>
      <!-- 点击区域提示（可选装饰） -->
      <view class="lk-steps__story-nav">
        <view class="lk-steps__story-nav-prev" />
        <view class="lk-steps__story-nav-next" />
      </view>
    </view>

    <!-- 底部步骤指示 -->
    <view class="lk-steps__story-footer">
      <text class="lk-steps__story-count">{{ current + 1 }} / {{ total }}</text>
    </view>
  </view>

  <!-- ═══════════════════════ STACK 模式 ═══════════════════════ -->
  <view
    v-else-if="type === 'stack'"
    class="lk-steps lk-steps--stack"
    :style="{ height: cardHeight ? `${cardHeight + 48}rpx` : undefined }"
  >
    <view
      v-for="(item, idx) in items"
      :key="idx"
      class="lk-steps__stack-card"
      :class="{
        'is-active': idx === current,
        'is-leaving': idx < current,
      }"
      :style="stackCardStyle(idx)"
      @tap="idx === current ? onCardTap($event) : undefined"
    >
      <!-- 卡片顶部：标题 + 步骤指示 -->
      <view class="lk-steps__stack-header">
        <view class="lk-steps__stack-step">
          <view class="lk-steps__stack-step-circle">
            <text class="lk-steps__stack-step-num">{{ idx + 1 }}</text>
          </view>
          <text class="lk-steps__stack-step-total">/ {{ total }}</text>
        </view>
        <view v-if="item.icon" class="lk-steps__stack-icon">
          <lk-icon :name="item.icon" size="44" />
        </view>
      </view>

      <!-- 卡片主体 -->
      <view class="lk-steps__stack-body">
        <text v-if="item.tag" class="lk-steps__stack-tag">{{ item.tag }}</text>
        <text class="lk-steps__stack-title">{{ item.title }}</text>
        <text v-if="item.subtitle" class="lk-steps__stack-subtitle">{{ item.subtitle }}</text>
        <text v-if="item.description" class="lk-steps__stack-desc">{{ item.description }}</text>
      </view>

      <!-- 底部进度槽 -->
      <view class="lk-steps__stack-progress">
        <view
          class="lk-steps__stack-progress-fill"
          :style="{ width: `${progressPercent}%` }"
        />
      </view>

      <!-- 操作区 slot（仅当前卡片显示） -->
      <view v-if="idx === current" class="lk-steps__stack-actions">
        <slot name="actions" :current="current" :total="total" :go-next="goNext" :go-prev="goPrev" />
      </view>
    </view>
  </view>


</template>

<style lang="scss">
@use './index.scss';
</style>
