<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, ref, inject } from 'vue';
import type { TextareaEventPayload } from './textarea.props';
import { textareaProps, textareaEmits } from './textarea.props';
import { formContextKey } from '../lk-form/context';
import { useLocale } from '../../composables/useLocale';

defineOptions({ name: 'LkTextarea' });

const props = defineProps(textareaProps);
const emit = defineEmits(textareaEmits);
const { t } = useLocale('textarea');

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
  props.customClass,
]);

const style = computed(() => props.customStyle as StyleValue);
const currentCount = computed(() => String(props.modelValue || '').length);
const isTextareaFocused = computed(() => props.focus || props.autofocus);
const resolvedPlaceholder = computed(() => props.placeholder || t('placeholder'));

function readTextareaValue(e: TextareaEventPayload): string {
  if (typeof e === 'object' && e !== null && 'detail' in e) {
    const detail = e.detail as { value?: string } | undefined;
    if (detail?.value !== undefined) return detail.value;
  }
  if (typeof e === 'object' && e !== null && 'target' in e) {
    const target = e.target as { value?: string } | null | undefined;
    if (target?.value !== undefined) return target.value;
  }
  return '';
}

function onInput(e: TextareaEventPayload) {
  let val = readTextareaValue(e);
  if (props.maxlength !== -1 && val.length > props.maxlength) {
    val = val.substring(0, props.maxlength);
  }
  emit('update:modelValue', val);
  emit('input', val);
}

function onFocus(e: TextareaEventPayload) {
  if (props.disabled) return;
  isFocused.value = true;
  emit('focus', e);
}

function onBlur(e: TextareaEventPayload) {
  setTimeout(() => {
    isFocused.value = false;
    emit('blur', e);
    emit('change', props.modelValue);
    if (props.validateEvent && props.prop) {
      form?.emitFieldBlur(props.prop);
    }
  }, 100);
}

function onConfirm(e: TextareaEventPayload) {
  emit('confirm', e);
}

function onLineChange(e: TextareaEventPayload) {
  emit('linechange', e);
}

function onKeyboardHeightChange(e: TextareaEventPayload) {
  emit('keyboardheightchange', e);
}

function onCompositionStart(e: TextareaEventPayload) {
  emit('compositionstart', e);
}

function onCompositionUpdate(e: TextareaEventPayload) {
  emit('compositionupdate', e);
}

function onCompositionEnd(e: TextareaEventPayload) {
  emit('compositionend', e);
  onInput(e);
}

function onClear() {
  if (props.disabled || props.readonly) return;
  emit('update:modelValue', '');
  emit('input', '');
  emit('change', '');
  emit('clear');
  if (props.validateEvent && props.prop) {
    form?.emitFieldChange(props.prop, '');
  }
}
</script>

<template>
  <view :id="id" :class="cls" :style="style">
    <!-- Label -->
    <view v-if="label" class="lk-textarea__label">{{ label }}</view>

    <view class="lk-textarea__wrapper">
      <textarea
        class="lk-textarea__inner"
        :name="name"
        :value="modelValue"
        :placeholder="resolvedPlaceholder"
        :placeholder-style="placeholderStyle"
        :placeholder-class="placeholderClass"
        :disabled="disabled || readonly"
        :maxlength="maxlength"
        :auto-height="autoHeight"
        :focus="isTextareaFocused"
        :cursor-spacing="cursorSpacing"
        :cursor="cursor"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :fixed="fixed"
        :confirm-type="confirmType"
        :confirm-hold="confirmHold"
        :adjust-position="adjustPosition"
        :show-confirm-bar="showConfirmBar"
        :disable-default-padding="disableDefaultPadding"
        :hold-keyboard="holdKeyboard"
        :auto-blur="autoBlur"
        :inputmode="inputmode"
        :ignore-composition-event="ignoreCompositionEvent"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        @linechange="onLineChange"
        @keyboardheightchange="onKeyboardHeightChange"
        @compositionstart="onCompositionStart"
        @compositionupdate="onCompositionUpdate"
        @compositionend="onCompositionEnd"
      />

      <!-- 清空按钮 -->
      <view v-if="clearable || $slots.suffix" class="lk-textarea__suffix">
        <view
          v-if="clearable && modelValue && !disabled && !readonly"
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
