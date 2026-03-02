<script setup lang="ts">
import { reactive, provide, computed } from 'vue';
import { formProps } from './form.props';
import type { FormContext, FormItemContext, ValidateError } from './context';
import { formContextKey } from './context';

defineOptions({ name: 'LkForm' });
const props = defineProps(formProps);
const emit = defineEmits<{
  /** 验证完成事件。ok: 是否全部通过；errors: 错误列表（全部通过时为 null） */
  validate: [ok: boolean, errors: ValidateError[] | null];
}>();

// 使用 reactive 注册表存储所有 FormItem
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
  const target = opts?.fields?.length
    ? fields.filter(f => f.prop && opts.fields!.includes(f.prop))
    : fields;
  const errors: ValidateError[] = [];
  for (const f of target) {
    try {
      await f.validate();
    } catch (e: any) {
      if (Array.isArray(e)) {
        errors.push(...e);
      } else if (e) {
        errors.push(e);
      }
    }
  }
  emit('validate', errors.length === 0, errors.length ? errors : null);
  if (errors.length) {
    // 滚动到第一个错误字段
    if (props.scrollToError) {
      scrollToField(errors[0].field);
    }
    return Promise.reject(errors);
  }
}

/** 重置指定或全部字段到初始状态，并清除验证结果 */
function resetFields(list?: string[]) {
  (list?.length ? fields.filter(f => f.prop && list.includes(f.prop)) : fields).forEach(f =>
    f.reset()
  );
}

/** 清除指定或全部字段的验证状态（不重置值） */
function clearValidate(list?: string[]) {
  (list?.length ? fields.filter(f => f.prop && list.includes(f.prop)) : fields).forEach(f =>
    f.setValidateStatus('idle')
  );
}

/** 触发 blur 验证 */
function emitFieldBlur(prop: string) {
  fields
    .find(f => f.prop === prop)
    ?.validate('blur')
    .catch(() => {});
}

/** 触发 change 验证（签名与 context.ts 一致，value 参数保留供扩展） */
function emitFieldChange(prop: string, _value?: unknown) {
  fields
    .find(f => f.prop === prop)
    ?.validate('change')
    .catch(() => {});
}

/** 验证单个字段 */
async function validateField(prop: string) {
  const f = fields.find(f => f.prop === prop);
  if (f) await f.validate();
}

/** 滚动到指定字段（H5 & 小程序通用：uni.pageScrollTo + 节点查询） */
function scrollToField(prop: string) {
  // 通过节点查询找到对应 form-item 的位置
  const query = uni.createSelectorQuery();
  query
    .select(`.lk-form-item[data-prop="${prop}"]`)
    .boundingClientRect((rect: any) => {
      if (rect?.top != null) {
        uni.pageScrollTo({
          scrollTop: Math.max(0, rect.top - 20),
          duration: 300,
        });
      }
    })
    .exec();
}

// 响应式上下文：使用 computed 确保 rules/labelWidth/showMessage 变化时 FormItem 能感知
const formContext = computed<FormContext>(() => ({
  model: props.model,          // 对象引用，天然响应式
  rules: props.rules,
  labelWidth: props.labelWidth,
  labelAlign: props.labelAlign,
  showMessage: props.showMessage,
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

// 暴露公共方法，支持 ref 调用
defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
});
</script>

<template>
  <view class="lk-form" :data-lk-form="true"><slot /></view>
</template>

<style lang="scss">
@use './index.scss';
</style>
