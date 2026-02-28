<script setup lang="ts">
import { ref, provide, watch, computed } from 'vue';
import { dropdownProps, dropdownEmits } from './dropdown.props';
import {
  useTransition,
  ANIMATION_PRESETS,
  type TransitionConfig,
} from '@/uni_modules/lucky-ui/composables/useTransition';

defineOptions({ name: 'LkDropdown' });

const props = defineProps(dropdownProps);
const emit = defineEmits(dropdownEmits);

const open = ref(false);
const active = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => (active.value = v)
);

function toggle(v?: boolean) {
  const next = v !== undefined ? v : !open.value;
  if (next === open.value) return;
  open.value = next;
  emit(next ? 'show' : 'hide');
}
function selectItem(name: any, payload: any) {
  active.value = name;
  emit('update:modelValue', name);
  emit('select', payload);
  emit('change', name);
  if (props.closeOnSelect) toggle(false);
}

function onTriggerEnter() {
  if (props.trigger === 'hover') toggle(true);
}
function onTriggerLeave() {
  if (props.trigger === 'hover') toggle(false);
}
function onTriggerClick() {
  if (props.trigger === 'click') toggle();
}

provide('LkDropdown', {
  active,
  selectItem,
  closeOnSelect: props.closeOnSelect,
});

const defaultByPlacement: Record<string, NonNullable<TransitionConfig['name']>> = {
  bottom: 'fade-up',
  top: 'fade-down',
  left: 'fade-right',
  right: 'fade-left',
};
const transitionConfig = computed<TransitionConfig>(() => {
  if (props.animationType)
    return {
      name: props.animationType,
      duration: props.duration,
      delay: props.delay,
      easing: props.easing,
    };
  if (props.animation && ANIMATION_PRESETS[props.animation]) {
    const p = ANIMATION_PRESETS[props.animation];
    return {
      name: p.animation,
      duration: props.duration ?? p.duration ?? 180,
      delay: props.delay ?? p.delay ?? 0,
      easing: props.easing ?? p.easing ?? 'ease-out',
    };
  }
  return {
    name: defaultByPlacement[props.placement] || 'fade',
    duration: props.duration,
    delay: props.delay,
    easing: props.easing,
  };
});
const {
  classes: menuClasses,
  styles: menuStyles,
  display,
} = useTransition(() => open.value, transitionConfig.value);
</script>

<template>
  <view class="lk-dropdown" @mouseenter="onTriggerEnter" @mouseleave="onTriggerLeave">
    <view
      v-if="display && trigger === 'click' && closeOnClickOutside"
      class="lk-dropdown__mask"
      :style="{ zIndex }"
      @tap="toggle(false)"
    />

    <view class="lk-dropdown__trigger" @click="onTriggerClick">
      <slot />
    </view>
    <view
      v-if="display"
      class="lk-dropdown__menu lk-elevated"
      :class="menuClasses"
      :style="[menuStyles, { zIndex: zIndex + 2 }]"
    >
      <slot name="menu" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
