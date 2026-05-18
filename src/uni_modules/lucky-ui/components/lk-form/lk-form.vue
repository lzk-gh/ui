<script setup lang="ts">
import type { StyleValue } from 'vue';
import { reactive, provide, computed } from 'vue';
import { formProps, formEmits } from './form.props';
import type { FormContext, FormItemContext, ValidateError } from './context';
import { formContextKey } from './context';
import {
  normalizeValidateErrors,
  resolveFormClass,
  resolveTargetFormFields,
} from './form.utils';

defineOptions({ name: 'LkForm' });
const props = defineProps(formProps);
const emit = defineEmits(formEmits);

const fields: FormItemContext[] = reactive([]);

function addField(f: FormItemContext) {
  if (f && !fields.includes(f)) fields.push(f);
}
function removeField(f: FormItemContext) {
  const i = fields.indexOf(f);
  if (i > -1) fields.splice(i, 1);
}

/** 验证全部或指定字段，返回 Promise。失败时 reject 携带 ValidateError[] */
async function validate(opts?: { fields?: string[]; silent?: boolean }) {
  const target = resolveTargetFormFields(fields, opts?.fields);
  const errors: ValidateError[] = [];
  for (const f of target) {
    try {
      await f.validate();
      if (f.prop) emit('validate-field', f.prop, true, null);
    } catch (e: unknown) {
      const fieldErrors = normalizeValidateErrors(e);
      errors.push(...fieldErrors);
      if (f.prop) emit('validate-field', f.prop, false, fieldErrors.length ? fieldErrors : null);
    }
  }
  emit('validate', errors.length === 0, errors.length ? errors : null);
  if (errors.length) {
    if (props.scrollToError) {
      scrollToField(errors[0].field);
    }
    return Promise.reject(errors);
  }
}

/** 重置指定或全部字段到初始状态，并清除验证结果 */
function resetFields(list?: string[]) {
  resolveTargetFormFields(fields, list).forEach(f => f.reset());
  emit('reset', list);
}

/** 清除指定或全部字段的验证状态（不重置值） */
function clearValidate(list?: string[]) {
  resolveTargetFormFields(fields, list).forEach(f =>
    f.setValidateStatus('idle')
  );
  emit('clear-validate', list);
}

/** 触发 blur 验证 */
function emitFieldBlur(prop: string) {
  emit('field-blur', prop);
  const field = fields.find(f => f.prop === prop);
  field
    ?.validate('blur')
    .then(() => emit('validate-field', prop, true, null))
    .catch((error: ValidateError[]) => emit('validate-field', prop, false, error));
}

/** 触发 change 验证（签名与 context.ts 一致，value 参数保留供扩展） */
function emitFieldChange(prop: string, _value?: unknown) {
  emit('field-change', prop, _value);
  const field = fields.find(f => f.prop === prop);
  field
    ?.validate('change')
    .then(() => emit('validate-field', prop, true, null))
    .catch((error: ValidateError[]) => emit('validate-field', prop, false, error));
}

/** 验证单个字段 */
async function validateField(prop: string) {
  const f = fields.find(f => f.prop === prop);
  if (!f) return;
  try {
    await f.validate();
    emit('validate-field', prop, true, null);
  } catch (error) {
    const errors = normalizeValidateErrors(error);
    emit('validate-field', prop, false, errors);
    return Promise.reject(errors);
  }
}

/** 滚动到指定字段（H5 & 小程序通用：uni.pageScrollTo + 节点查询） */
function scrollToField(prop: string) {
  const query = uni.createSelectorQuery();
  query
    .select(`.lk-form-item[data-prop="${prop}"]`)
    .boundingClientRect(rect => {
      const node = Array.isArray(rect) ? rect[0] : rect;
      if (node?.top != null) {
        uni.pageScrollTo({
          scrollTop: Math.max(0, node.top - 20),
          duration: 300,
        });
      }
    })
    .exec();
}

const classes = computed(() => [
  ...resolveFormClass({
    border: props.border,
    card: props.card,
    customClass: props.customClass,
  }),
]);

const style = computed(() => props.customStyle as StyleValue);

const formContext = computed<FormContext>(() => ({
  model: props.model,
  rules: props.rules,
  labelWidth: props.labelWidth,
  labelAlign: props.labelAlign,
  showMessage: props.showMessage,
  border: props.border,
  card: props.card,
  addField,
  removeField,
  validateField,
  emitFieldBlur,
  emitFieldChange,
  validate,
  resetFields,
  clearValidate,
  scrollToField,
}));

provide(formContextKey, formContext.value);

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
});
</script>

<template>
  <view :id="id" :class="classes" :style="style" :data-lk-form="true"><slot /></view>
</template>

<style lang="scss">
@use './lk-form.scss';
</style>
