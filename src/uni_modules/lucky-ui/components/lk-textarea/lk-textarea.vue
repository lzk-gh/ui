<script setup lang="ts">
import { computed, ref, inject } from 'vue';
import { textareaProps, textareaEmits } from './textarea.props';
import { formContextKey } from '../lk-form/context';

defineOptions({ name: 'LkTextarea' });

const props = defineProps(textareaProps);
const emit = defineEmits(textareaEmits);

const form = inject(formContextKey, null);
const isFocused = ref(false);

const cls = computed(() => [
  'lk-textarea',
  `lk-textarea--${props.variant}`,
  {
    'is-disabled': props.disabled,
    'is-focused': isFocused.value,
    'is-auto-height': props.autoHeight,
    'has-label': !!props.label,
  },
]);

const currentCount = computed(() => String(props.modelValue || '').length);

function onInput(e: any) {
  let val = e.detail.value;
  if (props.maxlength !== -1 && val.length > props.maxlength) {
    val = val.substring(0, props.maxlength);
  }
  emit('update:modelValue', val);
  emit('input', val);
}

function onFocus(e: any) {
  if (props.disabled) return;
  isFocused.value = true;
  emit('focus', e);
}

function onBlur(e: any) {
  // 延迟失焦，防止点击 clear 按钮时先触发 blur 导致按钮消失
  setTimeout(() => {
    isFocused.value = false;
    emit('blur', e);
    // 失焦时触发 change 和表单验证
    emit('change', props.modelValue);
    if (props.validateEvent && props.prop) {
      form?.emitFieldBlur(props.prop);
    }
  }, 100);
}

function onConfirm(e: any) {
  emit('confirm', e);
}

function onLineChange(e: any) {
  emit('linechange', e);
}

function onClear() {
  if (props.disabled) return;
  emit('update:modelValue', '');
  emit('input', '');
  emit('change', '');
  emit('clear');
  // 表单验证联动
  if (props.validateEvent && props.prop) {
    form?.emitFieldChange(props.prop, '');
  }
}
</script>

<template>
  <view :class="cls">
    <!-- Label -->
    <view v-if="label" class="lk-textarea__label">{{ label }}</view>

    <view class="lk-textarea__wrapper">
      <textarea
        class="lk-textarea__inner"
        :value="modelValue"
        :placeholder="placeholder"
        :placeholder-class="placeholderClass"
        :disabled="disabled"
        :maxlength="maxlength"
        :auto-height="autoHeight"
        :cursor-spacing="cursorSpacing"
        :fixed="fixed"
        :confirm-type="confirmType"
        :adjust-position="adjustPosition"
        disable-default-padding
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        @linechange="onLineChange"
      />

      <!-- 清空按钮 -->
      <view v-if="clearable || $slots.suffix" class="lk-textarea__suffix">
        <view
          v-if="clearable && modelValue && !disabled"
          class="lk-textarea__clear"
          @tap.stop.prevent="onClear"
        >
          <view class="lk-icon-close" />
        </view>
        <slot name="suffix" />
      </view>
    </view>

    <!-- 底部栏：左侧 footer 插槽，右侧计数 -->
    <view v-if="(showCount && maxlength !== -1) || $slots.footer" class="lk-textarea__footer">
      <view class="lk-textarea__footer-slot">
        <slot name="footer" />
      </view>
      <view v-if="showCount && maxlength !== -1" class="lk-textarea__count">
        {{ currentCount }} / {{ maxlength }}
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>