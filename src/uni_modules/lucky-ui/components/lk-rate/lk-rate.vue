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

watch(
  () => props.modelValue,
  val => {
    innerValue.value = val;
  }
);

// 尺寸归一化
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

// 点击选择
function select(index: number) {
  if (props.disabled || props.readonly) return;

  let newValue = index;

  // allowClear 判断：点击当前已选中的星才清零
  if (props.allowClear && innerValue.value === newValue) {
    newValue = 0;
  }

  innerValue.value = newValue;
  emit('update:modelValue', newValue);
  emit('change', newValue);

  // 表单联动
  if (props.prop) {
    form?.emitFieldChange(props.prop, newValue);
  }
}
</script>

<template>
  <view
    class="lk-rate"
    :class="{
      'is-disabled': props.disabled,
      'is-readonly': props.readonly,
    }"
  >
    <view
      v-for="item in stars"
      :key="item"
      class="lk-rate__item"
      @tap="select(item)"
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
@use './index.scss';
</style>
