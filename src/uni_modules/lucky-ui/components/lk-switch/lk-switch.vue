<script setup lang="ts">
import { computed, ref } from 'vue';
import { switchProps, switchEmits } from './switch.props';

defineOptions({ name: 'LkSwitch' });

const props = defineProps(switchProps);
const emit = defineEmits(switchEmits);

// 是否选中
const isChecked = computed(() => props.modelValue === props.activeValue);

// 防重复触发标记
const changing = ref(false);

// 动态样式：支持自定义颜色
const customStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.activeColor) {
    style['--switch-active-color'] = props.activeColor;
  }
  if (props.inactiveColor) {
    style['--switch-inactive-color'] = props.inactiveColor;
  }
  return style;
});

// 切换逻辑
async function toggle() {
  if (props.disabled || props.loading || changing.value) return;

  const nextValue = isChecked.value ? props.inactiveValue : props.activeValue;

  // beforeChange 拦截
  if (props.beforeChange) {
    changing.value = true;
    try {
      const allowed = await props.beforeChange(nextValue);
      if (!allowed) return;
    } catch {
      return;
    } finally {
      changing.value = false;
    }
  }

  emit('update:modelValue', nextValue);
  emit('change', nextValue);
}

function onClick(e: Event) {
  emit('click', e);
  toggle();
}
</script>

<template>
  <view
    class="lk-switch"
    :class="[
      `lk-switch--${size}`,
      {
        'is-checked': isChecked,
        'is-disabled': disabled,
        'is-loading': loading,
      },
    ]"
    :style="customStyle"
    @click="onClick"
  >
    <view class="lk-switch__knob">
      <view v-if="loading" class="lk-switch__spinner" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
