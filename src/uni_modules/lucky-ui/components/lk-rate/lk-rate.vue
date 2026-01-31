<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import { rateProps, rateEmits } from './rate.props';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkRate' });

const props = defineProps(rateProps);
const emit = defineEmits(rateEmits);

const form = inject(formContextKey, null);

// 内部值
const innerValue = ref<number>(props.modelValue);

// 监听外部变化
watch(
  () => props.modelValue,
  val => {
    innerValue.value = val;
  }
);

// 点击选择评分
function select(value: number) {
  if (props.disabled || props.readonly) return;

  // 支持 allowClear：点已选中的星时清零
  const newValue = innerValue.value === value ? 0 : value;

  innerValue.value = newValue;
  emit('update:modelValue', newValue);
  emit('change', newValue);

  // 表单联动
  if (props.prop) {
    form?.emitFieldChange(props.prop, newValue);
  }
}

// 生成 1~count 的数组
const stars = computed(() => Array.from({ length: props.count }, (_, i) => i + 1));

// 尺寸归一化（支持 40 / '40' / '40rpx'）
const iconSize = computed(() => {
  const s = props.size;
  if (typeof s === 'number') return `${s}rpx`;
  if (/^\d+$/.test(s)) return `${s}rpx`;
  return s;
});

// 颜色
const activeColor = computed(() => props.color || 'var(--lk-color-warning)');
</script>

<template>
  <view
    class="lk-rate"
    :class="{
      'is-disabled': props.disabled,
      'is-readonly': props.readonly,
    }"
  >
    <view v-for="item in stars" :key="item" class="lk-rate__item" @click="select(item)">
      <lk-icon
        :name="innerValue >= item ? props.icon || 'star-fill' : 'star'"
        :size="iconSize"
        :color="innerValue >= item ? activeColor : 'var(--lk-color-border)'"
      />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
