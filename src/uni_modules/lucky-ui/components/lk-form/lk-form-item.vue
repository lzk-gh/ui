<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { lkFormItemProps } from './types';
import {
  formContextKey,
  type FormContext,
  type FormRule,
  type ValidateError,
  type FormItemContext,
} from './context';

defineOptions({ name: 'LkFormItem' });
const props = defineProps(lkFormItemProps);
const form = inject(formContextKey, null as FormContext | null);

const status = ref<'idle' | 'validating' | 'success' | 'error'>('idle');
const msg = ref('');
const requiredMark = ref(false);

function rules(): FormRule[] {
  if (!props.prop || !form?.rules) return [];
  const r = form.rules[props.prop];
  return r ? (Array.isArray(r) ? r : [r]) : [];
}
function computeReq() {
  if (props.required !== undefined) return props.required;
  return rules().some(r => r.required);
}

async function doValidate(trigger?: 'blur' | 'change') {
  if (!props.prop || !form) return;
  const list = rules().filter(r => {
    if (!trigger || !r.trigger) return true;
    const arr = Array.isArray(r.trigger) ? r.trigger : [r.trigger];
    return arr.includes(trigger);
  });
  if (!list.length) {
    status.value = 'success';
    msg.value = '';
    return;
  }
  const val = form.model[props.prop];
  status.value = 'validating';
  msg.value = '';
  const errs: ValidateError[] = [];
  for (const rule of list) {
    const m = rule.message || '验证失败';
    if (rule.required) {
      const empty =
        val === undefined ||
        val === null ||
        (typeof val === 'string' && val.trim() === '') ||
        (Array.isArray(val) && !val.length);
      if (empty) {
        errs.push({ field: props.prop, message: m, rule });
        continue;
      }
    }
    if (rule.min != null && typeof val === 'string' && val.length < rule.min) {
      errs.push({ field: props.prop, message: m, rule });
      continue;
    }
    if (rule.max != null && typeof val === 'string' && val.length > rule.max) {
      errs.push({ field: props.prop, message: m, rule });
      continue;
    }
    if (rule.pattern && typeof val === 'string' && !rule.pattern.test(val)) {
      errs.push({ field: props.prop, message: m, rule });
      continue;
    }
    if (rule.validator) {
      try {
        const r = await rule.validator(val, rule, form.model);
        if (r === false) errs.push({ field: props.prop, message: m, rule });
        else if (typeof r === 'string') errs.push({ field: props.prop, message: r, rule });
      } catch (e: any) {
        errs.push({ field: props.prop, message: e?.message || m, rule });
      }
    }
  }
  if (errs.length) {
    status.value = 'error';
    msg.value = errs[0].message;
    return Promise.reject(errs);
  }
  status.value = 'success';
  msg.value = '';
}

const itemCtx: FormItemContext = {
  prop: props.prop || undefined,
  setValidateStatus(s, m) {
    status.value = s;
    if (m !== undefined) msg.value = m;
  },
  validate: doValidate,
  reset() {
    if (props.prop && form) {
      const v = form.model[props.prop];
      if (Array.isArray(v)) form.model[props.prop] = [];
      else if (typeof v === 'number') form.model[props.prop] = 0;
      else form.model[props.prop] = '';
    }
    status.value = 'idle';
    msg.value = '';
  },
};

onMounted(() => {
  requiredMark.value = computeReq();
  form?.addField(itemCtx);
});
onBeforeUnmount(() => form?.removeField(itemCtx));
watch(
  () => props.required,
  () => (requiredMark.value = computeReq())
);

const labelStyle = computed(() => {
  const w = props.labelWidth || form?.labelWidth;
  if (!w) return {};
  return { width: typeof w === 'number' ? `${w}rpx` : w };
});
</script>

<template>
  <view class="lk-form-item" :class="[`is-${status}`]">
    <view v-if="label || $slots.label" class="lk-form-item__label" :style="labelStyle">
      <text v-if="requiredMark" class="lk-form-item__star">*</text>
      <slot name="label">{{ label }}</slot>
    </view>
    <view class="lk-form-item__content">
      <slot />
      <view
        v-if="(showMessage ?? form?.showMessage) !== false && status === 'error' && msg"
        class="lk-form-item__error"
      >
        {{ msg }}
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.lk-form-item {
  --_gap-x: 20rpx;
  --_label-color: var(--lk-color-text-secondary);
  --_error-color: var(--lk-color-primary-active);

  display: flex;
  align-items: flex-start;
  gap: var(--_gap-x);

  &__label {
    flex-shrink: 0;
    min-width: 140rpx;
    font-size: 26rpx;
    line-height: 1.4;
    padding-top: 12rpx;
    color: var(--_label-color);
    display: flex;
    align-items: flex-start;
  }
  &__star {
    color: var(--lk-color-primary);
    margin-right: 6rpx;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }
  &__error {
    font-size: 24rpx;
    line-height: 1.3;
    color: var(--_error-color);
  }

  &.is-error &__label {
    color: var(--_error-color);
  }
}
</style>
