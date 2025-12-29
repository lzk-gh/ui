<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import { backtopProps, backtopEmits } from './backtop.props';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';

/**
 * Backtop 回到顶部
 * - 页面滚动到一定距离后显示悬浮按钮，点击快速返回顶部
 */

defineOptions({ name: 'LkBacktop' });

const props = defineProps(backtopProps);

const emit = defineEmits(backtopEmits);

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
@use './index.scss';
</style>
