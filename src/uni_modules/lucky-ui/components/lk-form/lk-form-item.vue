<script setup lang="ts">
import type { StyleValue } from 'vue';
import { inject, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { formItemProps } from './form.props';
import LkIcon from '../lk-icon/lk-icon.vue';
import {
  formContextKey,
  type FormContext,
  type FormRule,
  type ValidateError,
  type FormItemContext,
} from './context';
import { useLocale } from '../../composables/useLocale';

defineOptions({ name: 'LkFormItem' });
const props = defineProps(formItemProps);
const form = inject(formContextKey, null as FormContext | null);
const { t } = useLocale('form');

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
  const prop = props.prop;
  if (!prop || !form) return;
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
  const val = form.model[prop];
  status.value = 'validating';
  msg.value = '';
  const errs: ValidateError[] = [];
  for (const rule of list) {
    const m: string = rule.message || t<string>('validationFailed');
    if (rule.required) {
      const empty =
        val === undefined ||
        val === null ||
        (typeof val === 'string' && val.trim() === '') ||
        (Array.isArray(val) && !val.length) ||
        (typeof val === 'number' && isNaN(val));
      if (empty) {
        errs.push({ field: prop, message: m, rule });
        continue;
      }
    }
    if (rule.min != null && typeof val === 'string' && val.length < rule.min) {
      errs.push({ field: prop, message: m, rule });
      continue;
    }
    if (rule.max != null && typeof val === 'string' && val.length > rule.max) {
      errs.push({ field: prop, message: m, rule });
      continue;
    }
    if (rule.min != null && typeof val === 'number' && val < rule.min) {
      errs.push({ field: prop, message: m, rule });
      continue;
    }
    if (rule.max != null && typeof val === 'number' && val > rule.max) {
      errs.push({ field: prop, message: m, rule });
      continue;
    }
    if (rule.pattern && typeof val === 'string' && !rule.pattern.test(val)) {
      errs.push({ field: prop, message: m, rule });
      continue;
    }
    if (rule.validator) {
      try {
        const r = await rule.validator(val, rule, form.model);
        if (r === false) errs.push({ field: prop, message: m, rule });
        else if (typeof r === 'string') errs.push({ field: prop, message: r, rule });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : m;
        errs.push({ field: prop, message: errorMessage || m, rule });
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
const isTopLayout = computed(() => resolvedLabelAlign.value === 'top' || props.vertical);

// 表单是否开启 border/card
const hasBorder = computed(() => form?.border);
const style = computed(() => props.customStyle as StyleValue);

defineExpose({ validate: doValidate, resetField: itemCtx.reset, clearValidate: () => itemCtx.setValidateStatus('idle') });
</script>

<template>
  <view
    :id="id"
    class="lk-form-item"
    :class="[
      customClass,
      `is-${status}`,
      `lk-form-item--${resolvedLabelAlign}`,
      {
        'lk-form-item--top': isTopLayout,
        'lk-form-item--border': hasBorder,
        'lk-form-item--link': isLink,
      },
    ]"
    :style="style"
    :data-prop="prop"
  >
    <view class="lk-form-item__body">
      <view v-if="label || $slots.label" class="lk-form-item__label" :style="labelStyle">
        <text class="lk-form-item__star" :class="{ 'is-hidden': !requiredMark }">*</text>
        <slot name="label">
          <text class="lk-form-item__label-text">{{ label }}</text>
        </slot>
      </view>
      <view class="lk-form-item__content">
        <slot />
      </view>
      <view v-if="isLink" class="lk-form-item__arrow">
        <lk-icon name="chevron-right" size="32" />
      </view>
    </view>
    <view
      v-if="(showMessage ?? form?.showMessage) !== false && status === 'error' && msg"
      class="lk-form-item__error"
    >
      {{ msg }}
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
