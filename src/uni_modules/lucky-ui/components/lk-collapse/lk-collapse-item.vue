<script setup lang="ts">
import { computed, inject } from 'vue';
import type { PropType } from 'vue';
import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';
import { collapseInjectionKey, type CollapseName } from './collapse.props';

defineOptions({ name: 'LkCollapseItem' });

const props = defineProps({
  name: { type: [String, Number] as PropType<CollapseName>, required: true },
  title: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits({
  click: (_payload: { name: CollapseName; expanded: boolean; event?: unknown }) => true,
  'click-disabled': (_payload: { name: CollapseName; event?: unknown }) => true,
});
const collapse = inject(collapseInjectionKey);
const open = computed(() => collapse?.active.value.includes(props.name) ?? false);

const { rippleActive, rippleWaveStyle, triggerRipple } = useRipple({ duration: 800 });

function toggle(event?: unknown) {
  if (props.disabled) {
    const payload = { name: props.name, event };
    emit('click-disabled', payload);
    collapse?.clickDisabled(props.name, event);
    return;
  }
  collapse?.toggle(props.name, event);
}

function onHeaderTap(e: unknown) {
  emit('click', { name: props.name, expanded: open.value, event: e });
  if (props.disabled) {
    toggle(e);
    return;
  }
  triggerRipple(e);
  toggle(e);
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
    <view
      v-show="open"
      class="lk-collapse-item__body"
      :style="{
        '--lk-collapse-anim-duration': collapse?.animationDuration,
        '--lk-collapse-anim-timing': collapse?.animationTiming,
      }"
    >
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
