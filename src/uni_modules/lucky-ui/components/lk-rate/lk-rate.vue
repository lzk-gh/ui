<script setup lang="ts">
import type { StyleValue } from 'vue';
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import { rateProps, rateEmits } from './rate.props';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkRate' });

const props = defineProps(rateProps);
const emit = defineEmits(rateEmits);

const form = inject(formContextKey, null);

const innerValue = ref<number>(props.modelValue);

watch(
  () => props.modelValue,
  val => {
    innerValue.value = val;
  }
);

// 尺寸归一化µ支持 40 / '40' / 'var(--lk-rpx-40)'）
const iconSize = computed(() => {
  const s = props.size;
  if (typeof s === 'number') return `${s}rpx`;
  if (/^\d+$/.test(s)) return `${s}rpx`;
  return s;
});

// 颜色
const activeColor = computed(() => props.color || 'var(--lk-color-warning)');
const voidColor = computed(() => props.colorVoid || 'var(--lk-color-border)');

// 图标名
const activeIcon = computed(() => props.icon || 'star-fill');
const voidIcon = computed(() => props.iconVoid || 'star');
const rootStyle = computed<StyleValue>(() => props.customStyle as StyleValue);

// 生成 1~count 的数组
const stars = computed(() => Array.from({ length: props.count }, (_, i) => i + 1));

// 获取每个星的状态：full | void
function getStarStatus(index: number): 'full' | 'void' {
  const val = innerValue.value;
  if (val >= index) return 'full';
  return 'void';
}

function getStarIcon(index: number) {
  const status = getStarStatus(index);
  if (status === 'full') return activeIcon.value;
  return voidIcon.value;
}

function getStarColor(index: number) {
  const status = getStarStatus(index);
  return status === 'void' ? voidColor.value : activeColor.value;
}

function select(index: number, event?: unknown) {
  if (props.disabled || props.readonly) {
    emit('click-disabled', {
      value: innerValue.value,
      index,
      disabled: props.disabled,
      readonly: props.readonly,
      event,
    });
    return;
  }

  let newValue = index;
  const oldValue = innerValue.value;
  emit('click', { value: newValue, oldValue, index, event });

  // 点击当前已选中的星才清零
  if (props.allowClear && innerValue.value === newValue) {
    newValue = 0;
    emit('clear', { oldValue, index, event });
  }

  if (newValue === oldValue) return;

  innerValue.value = newValue;
  emit('update:modelValue', newValue);
  emit('change', newValue, oldValue);

  // 表单联动
  if (props.prop) {
    form?.emitFieldChange(props.prop, newValue);
  }
}

function onTap(_e: unknown, index: number) {
  select(index, _e);
}
</script>

<template>
  <view
    :id="id"
    class="lk-rate"
    :class="[
      customClass,
      {
        'is-disabled': props.disabled,
        'is-readonly': props.readonly,
      },
    ]"
    :style="rootStyle"
  >
    <view
      v-for="item in stars"
      :key="item"
      class="lk-rate__item"
      @tap="onTap($event, item)"
    >
      <lk-icon
        :name="getStarIcon(item)"
        :size="iconSize"
        :color="getStarColor(item)"
      />
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-rate.scss';
</style>
