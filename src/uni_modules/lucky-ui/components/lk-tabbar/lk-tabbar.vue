<script setup lang="ts">
import { computed, provide } from 'vue';
import { tabbarEmits, tabbarProps } from './tabbar.props';
import { tabbarContextKey } from './context';

defineOptions({ name: 'LkTabbar' });

const props = defineProps(tabbarProps);
const emit = defineEmits(tabbarEmits);

const rootStyle = computed(() => {
  const style: Record<string, string | number> = { 
    zIndex: props.zIndex,
    // 硬件加速，防止切换时闪烁
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  if (props.backgroundColor) style['--lk-tabbar-bg'] = props.backgroundColor;
  if (props.activeColor) style['--lk-tabbar-active-color'] = props.activeColor;
  if (props.inactiveColor) style['--lk-tabbar-inactive-color'] = props.inactiveColor;

  return style;
});

function setActive(val: string | number) {
  if (val === props.modelValue) return;
  emit('update:modelValue', val);
  emit('change', val);
}

provide(tabbarContextKey, {
  active: computed(() => props.modelValue),
  setActive,
});
</script>

<template>
  <view
    :id="id"
    class="lk-tabbar"
    :class="[
      customClass,
      {
        'lk-tabbar--fixed': fixed,
        'lk-tabbar--safe-area': safeArea,
        'lk-tabbar--border': border,
      },
    ]"
    :style="[rootStyle, customStyle]"
  >
    <view class="lk-tabbar__wrapper">
      <slot />
    </view>
  </view>

  <!-- fixed 时撑起占位，避免内容被遮挡 -->
  <view v-if="fixed" class="lk-tabbar__placeholder" />
</template>

<style lang="scss">
@use './index.scss';
</style>
