<template>
  <view v-if="display" class="lk-curtain" :class="customClass" :style="customStyle">
    <lk-overlay v-if="display" :show="show" :z-index="zIndex" @click="onOverlayClick" />
    <view class="lk-curtain__content" :class="contentClasses" :style="{ ...contentStyle, ...contentStyles }">
      <image
        class="lk-curtain__image"
        :src="imageUrl"
        mode="aspectFit"
        :style="{ width: '100%', height: '100%' }"
        @click="onClick"
      />
      <view
        class="lk-curtain__close"
        :class="['lk-curtain__close--' + closePosition]"
        @click="onClose"
      >
        <lk-icon name="x-lg" size="32" color="#fff" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTransition, type TransitionConfig } from '@/uni_modules/lucky-ui/composables/useTransition';
import { curtainProps, curtainEmits } from './curtain.props';
import { addUnit } from '../../core/src/utils/unit';
import LkOverlay from '../lk-overlay/lk-overlay.vue';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkCurtain' });

const props = defineProps(curtainProps);
const emit = defineEmits(curtainEmits);

const zIndex = 10090;

const widthStr = computed(() => addUnit(props.width));
const heightStr = computed(() => addUnit(props.height));

const contentStyle = computed(() => {
  return {
    zIndex: zIndex + 1,
    width: widthStr.value,
    height: heightStr.value,
  };
});

const transitionConfig = computed<TransitionConfig>(() => ({
  name: 'zoom-in',
  duration: 220,
  easing: 'ease-out',
}));

const { classes: contentClasses, styles: contentStyles, display } = useTransition(
  () => props.show,
  transitionConfig.value
);

const onOverlayClick = () => {
  emit('click-overlay');
  if (props.closeOnClickOverlay) {
    onClose();
  }
};

const onClose = () => {
  emit('update:show', false);
  emit('close');
};

const onClick = () => {
  emit('click');
  if (props.link) {
    // @ts-ignore
    uni[props.linkType]({
      url: props.link,
    });
  }
};
</script>

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
  z-index: 10090;
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

  &__close {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 64rpx;
    border: 2rpx solid #fff;
    border-radius: 50%;
    z-index: 1;

    &--top-left {
      top: -40rpx;
      left: 0;
    }

    &--top-right {
      top: -40rpx;
      right: 0;
    }

    &--bottom-left {
      bottom: -40rpx;
      left: 0;
    }

    &--bottom-right {
      bottom: -40rpx;
      right: 0;
    }

    &--bottom {
      bottom: -56rpx;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
