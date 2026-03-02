<script setup lang="ts">
import { computed, useSlots } from 'vue';

import LkOverlay from '../lk-overlay/lk-overlay.vue';
import LkIcon from '../lk-icon/lk-icon.vue';

import {
  useTransition,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';
import { addUnit } from '../../core/src/utils/unit';
import { curtainProps, curtainEmits } from './curtain.props';

defineOptions({ name: 'LkCurtain' });

const props = defineProps(curtainProps);
const emit = defineEmits(curtainEmits);

const slots = useSlots();

const widthStr = computed(() => addUnit(props.width));
const heightStr = computed(() => addUnit(props.height));
const closeOffsetStr = computed(() => addUnit(props.closeOffset) || '24rpx');
const closeOffsetBottomStr = computed(() => addUnit(props.closeOffsetBottom) || '36rpx');
const hasDefaultSlot = computed(() => !!slots.default);
const rootStyle = computed<(string | Record<string, string | number>)[]>(() => [
  (props.customStyle || '') as string,
  {
    zIndex: props.zIndex,
    pointerEvents: props.show ? 'auto' : 'none',
  },
]);

const contentStyle = computed(() => {
  return {
    zIndex: props.zIndex + 1,
    width: widthStr.value,
    height: heightStr.value,
  };
});

const closeStyle = computed(() => {
  const offset = ensureNegativeOffset(
    props.closePosition === 'bottom' ? closeOffsetBottomStr.value : closeOffsetStr.value
  );

  if (props.closePosition === 'bottom') {
    return { bottom: offset };
  }

  const styles: Record<string, string> = {};
  if (props.closePosition.includes('top')) styles.top = offset;
  if (props.closePosition.includes('bottom')) styles.bottom = offset;
  if (props.closePosition.includes('left')) styles.left = offset;
  if (props.closePosition.includes('right')) styles.right = offset;

  return styles;
});

const transitionConfig = computed<TransitionConfig>(() => ({
  name: 'zoom-in',
  duration: 220,
  easing: 'ease-out',
}));

const {
  classes: contentClasses,
  styles: contentStyles,
  display,
} = useTransition(() => props.show, transitionConfig.value);

function ensureNegativeOffset(value: string) {
  // 移除可能存在的单位，转换为数值
  const num = parseFloat(value);
  const unit = value.replace(num.toString(), '');

  // 确保偏移值是负数，这样关闭按钮才会溢出到内容区域外
  const offset = Math.abs(num);
  return `-${offset}${unit || 'rpx'}`;
}

function onOverlayClick() {
  emit('click-overlay');
  if (props.closeOnClickOverlay) {
    onClose();
  }
}

function onClose() {
  emit('update:show', false);
  emit('close');
}

function onClick() {
  emit('click');
  if (!props.link) return;

  // #ifdef H5
  if (props.link.startsWith('http')) {
    window.location.href = props.link;
    return;
  }
  // #endif

  const navFn = (uni as unknown as Record<string, (...args: unknown[]) => unknown>)[
    props.linkType
  ];
  if (typeof navFn === 'function') {
    navFn({
      url: props.link,
    });
  }
}
</script>

<template>
  <view
    v-if="display"
    class="lk-curtain"
    :class="customClass"
    :style="rootStyle"
    @tap.stop
  >
    <lk-overlay
      v-if="display"
      :show="show"
      :z-index="props.zIndex"
      @click="onOverlayClick"
    />
    <view
      class="lk-curtain__content"
      :class="contentClasses"
      :style="[contentStyle, contentStyles]"
      @tap.stop
    >
      <view
        v-if="hasDefaultSlot"
        class="lk-curtain__slot"
        style="width: 100%; height: 100%"
        @tap="onClick"
      >
        <slot />
      </view>
      <image
        v-else
        class="lk-curtain__image"
        :src="imageUrl"
        :mode="imageMode"
        style="width: 100%; height: 100%"
        @tap="onClick"
      />
      <view
        class="lk-curtain__close"
        :class="['lk-curtain__close--' + closePosition]"
        :style="closeStyle"
        @tap.stop="onClose"
      >
        <lk-icon name="x-lg" size="32" color="var(--lk-color-text-inverse)" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.lk-curtain {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: visible;
  }

  &__image {
    display: block;
  }

  &__slot {
    width: 100%;
    height: 100%;
  }

  &__close {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72rpx;
    height: 72rpx;
    border: 2rpx solid var(--lk-color-text-inverse);
    border-radius: 50%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.3);

    &--top-left {
      left: 0;
    }

    &--top-right {
      right: 0;
    }

    &--bottom-left {
      left: 0;
    }

    &--bottom-right {
      right: 0;
    }

    &--bottom {
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
