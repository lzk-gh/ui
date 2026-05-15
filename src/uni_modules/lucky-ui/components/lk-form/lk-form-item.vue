<script setup lang="ts">
import type { StyleValue } from 'vue';
import { inject, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { formItemProps } from './form.props';
import LkIcon from '../lk-icon/lk-icon.vue';
import {
  formContextKey,
  type FormContext,
  type FormRule,
  type FormItemContext,
} from './context';
import { useLocale } from '../../composables/useLocale';
import {
  filterFormRulesByTrigger,
  getFormFieldRules,
  resolveFormItemClass,
  resolveFormItemLabelStyle,
  resolveFormItemRequired,
  resolveFormItemResetValue,
  validateFormValue,
  type FormValidateStatus,
} from './form.utils';

defineOptions({ name: 'LkFormItem' });
const props = defineProps(formItemProps);
const form = inject(formContextKey, null as FormContext | null);
const { t } = useLocale('form');

const status = ref<FormValidateStatus>('idle');
const msg = ref('');
const requiredMark = ref(false);

function rules(): FormRule[] {
  return getFormFieldRules(form?.rules, props.prop);
}
function computeReq() {
  return resolveFormItemRequired({
    explicitRequired: props.required,
    rules: rules(),
  });
}

async function doValidate(trigger?: 'blur' | 'change') {
  const prop = props.prop;
  if (!prop || !form) return;
  const list = filterFormRulesByTrigger(rules(), trigger);
  if (!list.length) {
    status.value = 'success';
    msg.value = '';
    return;
  }
  const val = form.model[prop];
  status.value = 'validating';
  msg.value = '';
  const errs = await validateFormValue({
    field: prop,
    value: val,
    rules: list,
    model: form.model,
    fallbackMessage: t<string>('validationFailed'),
  });
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
      form.model[props.prop] = resolveFormItemResetValue(v);
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
  return resolveFormItemLabelStyle(w);
});

// 继承表单的 labelAlign
const resolvedLabelAlign = computed(() => props.labelAlign || form?.labelAlign || 'left');

// 是否 top 布局
const isTopLayout = computed(() => resolvedLabelAlign.value === 'top' || props.vertical);

// 表单是否开启 border/card
const hasBorder = computed(() => form?.border);
const style = computed(() => props.customStyle as StyleValue);
const classes = computed(() => resolveFormItemClass({
  customClass: props.customClass,
  status: status.value,
  labelAlign: resolvedLabelAlign.value,
  topLayout: isTopLayout.value,
  border: hasBorder.value,
  link: props.isLink,
}));

defineExpose({ validate: doValidate, resetField: itemCtx.reset, clearValidate: () => itemCtx.setValidateStatus('idle') });
</script>

<template>
  <view
    :id="id"
    class="lk-form-item"
    :class="classes"
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
@use './lk-form.scss';
</style>
