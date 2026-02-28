<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import { rateProps, rateEmits } from './rate.props';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkRate' });

const props = defineProps(rateProps);
const emit = defineEmits(rateEmits);

const form = inject(formContextKey, null);

// 内部值：半星用小数表示（如 2.5 = 两个半星）
const innerValue = ref<number>(props.modelValue);

watch(
  () => props.modelValue,
  val => {
    innerValue.value = val;
  }
);

// 尺寸归一化µ支持 40 / '40' / '40rpx'）
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
const halfIcon = computed(() => props.iconHalf || 'star-half-fill');

// 生成 1~count 的数组
const stars = computed(() => Array.from({ length: props.count }, (_, i) => i + 1));

// 获取每个星的状态：full | half | void
function getStarStatus(index: number): 'full' | 'half' | 'void' {
  const val = innerValue.value;
  if (val >= index) return 'full';
  if (props.allowHalf && val >= index - 0.5) return 'half';
  return 'void';
}

function getStarIcon(index: number) {
  const status = getStarStatus(index);
  if (status === 'full') return activeIcon.value;
  if (status === 'half') return halfIcon.value;
  return voidIcon.value;
}

function getStarColor(index: number) {
  const status = getStarStatus(index);
  return status === 'void' ? voidColor.value : activeColor.value;
}

// 点击或半星选择
function select(index: number, isHalf = false) {
  if (props.disabled || props.readonly) return;

  let newValue = isHalf && props.allowHalf ? index - 0.5 : index;

  // 尚将 allowClear 判断：点击当前已选中的星才清零
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

// 半星：检测点击位置是否在左半区域
function onTap(e: any, index: number) {
  if (!props.allowHalf) {
    select(index, false);
    return;
  }
  // 通过点击坐标判断左半/右半
  const touch = e.touches?.[0] || e.changedTouches?.[0] || e;
  const target = e.currentTarget || e.target;
  if (target?.getBoundingClientRect) {
    // H5
    const rect = target.getBoundingClientRect();
    const isLeft = (touch.clientX - rect.left) / rect.width < 0.5;
    select(index, isLeft);
  } else if (e.detail?.x != null && e.currentTarget?.offsetWidth) {
    // 小程序
    const isLeft = e.detail.x < e.currentTarget.offsetWidth / 2;
    select(index, isLeft);
  } else {
    select(index, false);
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
@use './index.scss';
</style>
