<script setup lang="ts">
import { reactive, provide } from 'vue';
import { formProps } from './form.props';
import type { FormContext, FormItemContext, ValidateError } from './context';
import { formContextKey } from './context';

defineOptions({ name: 'LkForm' });
const props = defineProps(formProps);
const emit = defineEmits(['validate']);

const fields: FormItemContext[] = reactive([]);

function addField(f: FormItemContext) {
  if (f && !fields.includes(f)) fields.push(f);
}
function removeField(f: FormItemContext) {
  const i = fields.indexOf(f);
  if (i > -1) fields.splice(i, 1);
}
async function validate(opts?: { fields?: string[] }) {
  const target = opts?.fields?.length
    ? fields.filter(f => f.prop && opts.fields!.includes(f.prop))
    : fields;
  const errors: ValidateError[] = [];
  for (const f of target) {
    try {
      await f.validate();
    } catch (e: any) {
      Array.isArray(e) ? errors.push(...e) : errors.push(e);
    }
  }
  emit('validate', errors.length === 0, errors.length ? errors : null);
  if (errors.length) return Promise.reject(errors);
}
function resetFields(list?: string[]) {
  (list?.length ? fields.filter(f => f.prop && list.includes(f.prop)) : fields).forEach(f =>
    f.reset()
  );
}
function emitFieldBlur(prop: string) {
  fields
    .find(f => f.prop === prop)
    ?.validate('blur')
    .catch(() => {});
}
function emitFieldChange(prop: string) {
  fields
    .find(f => f.prop === prop)
    ?.validate('change')
    .catch(() => {});
}
async function validateField(prop: string) {
  const f = fields.find(f => f.prop === prop);
  if (f) await f.validate();
}

provide(formContextKey, {
  model: props.model,
  rules: props.rules,
  labelWidth: props.labelWidth,
  showMessage: props.showMessage,
  addField,
  removeField,
  validateField,
  emitFieldBlur,
  emitFieldChange,
  validate,
  resetFields,
} as FormContext);
</script>

<template>
  <view class="lk-form"><slot /></view>
</template>

<style lang="scss">
.lk-form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
