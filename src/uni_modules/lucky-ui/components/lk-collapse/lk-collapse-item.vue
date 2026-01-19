<script setup lang="ts">
import { computed, defineProps, inject } from 'vue';
import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';

defineOptions({ name: 'LkCollapseItem' });

const props = defineProps({
  name: { type: [String, Number], required: true },
  title: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});
const collapse = inject<any>('LkCollapse');
const open = computed(() => collapse.active.value.includes(props.name));

const { rippleActive, rippleWaveStyle, triggerRipple } = useRipple({ duration: 600 });

function toggle() {
  if (props.disabled) return;
  collapse.toggle(props.name);
}

function onHeaderTap(e: unknown) {
  if (props.disabled) return;
  triggerRipple(e);
  toggle();
}
</script>

<template>
  <view class="lk-collapse-item" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <view
      class="lk-collapse-item__header lk-ripple"
      :class="{ 'lk-ripple--active': rippleActive }"
      @tap="onHeaderTap"
    >
      <view class="lk-ripple__content">
        <text class="lk-collapse-item__title">
          <slot name="title">{{ title }}</slot>
        </text>
        <lk-icon
          name="chevron-down"
          size="28"
          class="lk-collapse-item__arrow"
          :class="{ 'is-open': open }"
        />
      </view>
      <view class="lk-ripple__wave" :style="rippleWaveStyle" />
    </view>
    <view v-show="open" class="lk-collapse-item__body">
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
