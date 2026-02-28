<script setup lang="ts">
import { computed, ref, inject } from 'vue';
import { switchProps, switchEmits } from './switch.props';
import { formContextKey } from '../lk-form/context';

defineOptions({ name: 'LkSwitch' });

const props = defineProps(switchProps);
const emit = defineEmits(switchEmits);

const form = inject(formContextKey, null);

// 是否选中
const isChecked = computed(() => props.modelValue === props.activeValue);

// 防重复触发标记
const changing = ref(false);

// 动态样式：支持自定义颜色
const rootStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.activeColor) {
    style['--switch-active-color'] = props.activeColor;
  }
  if (props.inactiveColor) {
    style['--switch-inactive-color'] = props.inactiveColor;
  }
  return style;
});

// 内嵌文字
const promptText = computed(() => {
  if (!props.inlinePrompt) return '';
  if (isChecked.value) return props.activeText || 'ON';
  return props.inactiveText || 'OFF';
});

// 切换逻辑
async function toggle() {
  if (props.disabled || props.loading || changing.value) return;

  const nextValue = isChecked.value ? props.inactiveValue : props.activeValue;

  // 轻震动反馈（只在支持的平台上触发）
  if (props.hapticFeedback) {
    try {
      uni.vibrateShort({ type: 'light', success: () => {} });
    } catch {
      // 不支持时静默失败
    }
  }

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

  // 表单联动验证
  if (props.validateEvent && props.prop) {
    form?.emitFieldChange(props.prop, nextValue);
  }
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
        'has-prompt': inlinePrompt,
      },
    ]"
    :style="rootStyle"
    :aria-checked="isChecked"
    role="switch"
    @click="onClick"
  >
    <view class="lk-switch__knob">
      <view v-if="loading" class="lk-switch__spinner" />
      <text v-else-if="inlinePrompt && promptText" class="lk-switch__prompt">{{ promptText }}</text>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
