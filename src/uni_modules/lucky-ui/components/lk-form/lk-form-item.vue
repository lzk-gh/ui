<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { formItemProps } from './form.props';
import {
  formContextKey,
  type FormContext,
  type FormRule,
  type ValidateError,
  type FormItemContext,
} from './context';

defineOptions({ name: 'LkFormItem' });
const props = defineProps(formItemProps);
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
        (Array.isArray(val) && !val.length) ||
        (typeof val === 'number' && isNaN(val));
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
    if (rule.min != null && typeof val === 'number' && val < rule.min) {
      errs.push({ field: props.prop, message: m, rule });
      continue;
    }
    if (rule.max != null && typeof val === 'number' && val > rule.max) {
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
      // 按字段的当前类型正确还原初始值
      if (Array.isArray(v)) {
        form.model[props.prop] = [];
      } else if (typeof v === 'boolean' || v === true || v === false) {
        form.model[props.prop] = false;
      } else if (typeof v === 'number') {
        form.model[props.prop] = 0;
      } else if (v === null || v === undefined) {
        // null / undefined 字段保留为 null
        form.model[props.prop] = null;
      } else {
        form.model[props.prop] = '';
      }
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
  [() => props.required, () => form?.rules],
  () => (requiredMark.value = computeReq()),
  { deep: true }
);

const labelStyle = computed(() => {
  const w = props.labelWidth || form?.labelWidth;
  if (!w) return {};
  return { width: typeof w === 'number' ? `${w}rpx` : w };
});

// 继承表单的 labelAlign
const resolvedLabelAlign = computed(() => props.labelAlign || form?.labelAlign || 'left');

// 是否 top 布局
const isTopLayout = computed(() => resolvedLabelAlign.value === 'top');

defineExpose({ validate: doValidate, resetField: itemCtx.reset, clearValidate: () => itemCtx.setValidateStatus('idle') });
</script>

<template>
  <view
    class="lk-form-item"
    :class="[
      `is-${status}`,
      `lk-form-item--${resolvedLabelAlign}`,
      { 'lk-form-item--top': isTopLayout },
    ]"
    :data-prop="prop"
  >
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
@use './index.scss';
</style>
