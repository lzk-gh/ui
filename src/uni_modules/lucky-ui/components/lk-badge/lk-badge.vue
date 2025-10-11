<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
defineOptions({ name: 'LkBadge' });

const props = defineProps({
  value: { type: [Number, String], default: '' },
  max: { type: Number, default: 99 },
  dot: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  offset: { 
    type: Array, 
    default: () => [0,0], 
    validator: (value: any) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
  },
  type: { type: String, default: 'primary' },
  color: { type: String, default: '' },
  bgColor: { type: String, default: '' }
});

const displayValue = computed(()=> {
  if(props.dot) return '';
  const val = props.value;
  if(typeof val === 'number' && val > props.max) return props.max + '+';
  return val;
});
</script>

<template>
  <view class="lk-badge-wrapper">
    <slot />
    <view
        v-if="!hidden && (dot || value !== '' )"
        class="lk-badge"
        :class="{'is-dot': dot}"
        :style="{
          right: (offset as [number, number])[0] + 'rpx',
          top: (offset as [number, number])[1] + 'rpx',
          color: color,
          background: bgColor
        }"
    >
      <text v-if="!dot">{{ displayValue }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-badge-wrapper {
  position: relative;
  display: inline-block;
}
.lk-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--lk-color-primary);
  color: var(--lk-color-text-inverse);
  font-size: 20rpx;
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 10rpx;
  border-radius: var(--lk-radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: var(--lk-shadow-sm);
  transform: translate(50%, -50%);
  &.is-dot {
    width: 20rpx;
    height: 20rpx;
    min-width: 20rpx;
    padding: 0;
  }
}
</style>