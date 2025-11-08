<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';

/**
 * Backtop 回到顶部
 * - 页面滚动到一定距离后显示悬浮按钮，点击快速返回顶部
 */

defineOptions({ name: 'LkBacktop' });

const props = defineProps({
  // 在滚动高度超过多少（px）后显示
  visibilityHeight: { type: Number, default: 200 },
  // 右下角偏移（支持 rpx/px）
  right: { type: [String, Number], default: '32rpx' },
  bottom: { type: [String, Number], default: '80rpx' },
  // 层级
  zIndex: { type: Number, default: 1000 },
  // 回到顶部动画时长（ms）
  duration: { type: Number, default: 300 },
  // 形状：circle | square | round
  shape: {
    type: String as () => 'circle' | 'square' | 'round',
    default: 'circle',
  },
  // 尺寸：sm | md | lg
  size: { type: String as () => 'sm' | 'md' | 'lg', default: 'md' },
  // 默认图标名（使用内置 lk-icon）
  icon: { type: String, default: 'arrow-up' },
  // 文本（提供给无图标或自定义 slot 辅助）
  text: { type: String, default: '' },
  // 自定义类名
  customClass: { type: String, default: '' },
  // 是否使用页面滚动监听；为 false 时走受控模式，由 scrollTop 决定显隐
  usePageScroll: { type: Boolean, default: true },
  // 外部传入的滚动位置（与 usePageScroll=false 配合使用）
  scrollTop: { type: Number, default: 0 },
});

const emit = defineEmits(['click', 'to-top', 'change:visible']);

const visible = ref(false);
const computedVisible = computed(() => {
  return props.usePageScroll ? visible.value : props.scrollTop >= props.visibilityHeight;
});

if (props.usePageScroll) {
  onPageScroll(e => {
    const next = e.scrollTop >= props.visibilityHeight;
    if (next !== visible.value) {
      visible.value = next;
      emit('change:visible', next);
    }
  });
} else {
  // 受控模式，根据外部传入的 scrollTop 判断显隐
  watch(
    () => props.scrollTop,
    st => {
      const next = st >= props.visibilityHeight;
      if (next !== visible.value) {
        // 这里保留内部 visible 仅用于触发变更事件，实际显隐取决于 computedVisible
        visible.value = next;
        emit('change:visible', next);
      }
    },
    { immediate: true }
  );
}

function toTop() {
  emit('click');
  if (props.usePageScroll) {
    // 页面级滚动
    uni.pageScrollTo({ scrollTop: 0, duration: props.duration });
  }
  // 无论哪种模式都抛出事件，受控模式由外部自行将容器滚动置 0
  emit('to-top');
}

const wrapperStyle = computed(() => {
  const r = typeof props.right === 'number' ? `${props.right}px` : `${props.right}`;
  const b = typeof props.bottom === 'number' ? `${props.bottom}px` : `${props.bottom}`;
  return {
    right: r,
    bottom: b,
    zIndex: String(props.zIndex),
  } as Record<string, string>;
});

const classes = computed(() => [
  'lk-backtop',
  `lk-backtop--${props.size}`,
  `lk-backtop--shape-${props.shape}`,
  { 'is-visible': computedVisible.value },
  props.customClass,
]);
</script>

<template>
  <view
    v-show="computedVisible"
    :class="classes"
    :style="wrapperStyle"
    @click="toTop"
    aria-label="Back to top"
    role="button"
  >
    <slot>
      <LkIcon :name="icon" size="32" color="var(--lk-color-text-inverse)" />
      <text v-if="text" class="lk-backtop__text">{{ text }}</text>
    </slot>
  </view>
</template>

<style lang="scss">
.lk-backtop {
  --_size: 88rpx;
  --_radius: 50%;
  --_bg: var(--lk-color-primary);
  --_bg-active: var(--lk-color-primary-active);
  --_shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.12);

  position: fixed;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: var(--_size);
  height: var(--_size);
  border-radius: var(--_radius);
  background: var(--_bg);
  color: var(--lk-color-text-inverse);
  box-shadow: var(--_shadow);
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  transform: translateY(12rpx);
  transition:
    opacity var(--lk-transition-fast),
    transform var(--lk-transition-fast),
    background var(--lk-transition-fast);

  &--sm {
    --_size: 72rpx;
  }
  &--md {
    --_size: 88rpx;
  }
  &--lg {
    --_size: 104rpx;
  }

  &--shape-square {
    --_radius: var(--lk-radius-sm);
  }
  &--shape-round {
    --_radius: var(--lk-radius-pill);
  }
  &--shape-circle {
    --_radius: 50%;
  }

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:active {
    background: var(--_bg-active);
  }

  &__text {
    font-size: 24rpx;
    color: var(--lk-color-text-inverse);
  }
}
</style>
