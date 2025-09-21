<script setup lang="ts">
import { inject, computed } from 'vue';
defineOptions({ name:'LkStep' });

const props = defineProps({
  title: { type:String, default:'' },
  sub: { type:String, default:'' },
  index: { type:Number, default:0 }
});
const ctx = inject<any>('LkSteps');
const active = computed(()=> ctx?.props.current === props.index);
const finished = computed(()=> ctx?.props.current > props.index);
const error = computed(()=> ctx?.props.status==='error' && active.value);
</script>

<template>
  <view class="lk-step" :class="{ 'is-active': active, 'is-finished': finished, 'is-error': error }">
    <view class="lk-step__icon">
      <view class="lk-step__dot" />
      <lk-icon v-if="finished" name="check" size="26" class="lk-step__done" />
      <lk-icon v-if="error" name="x" size="26" class="lk-step__err" />
    </view>
    <view class="lk-step__content">
      <text class="lk-step__title">{{ title }}</text>
      <text v-if="sub" class="lk-step__sub">{{ sub }}</text>
    </view>
    <view class="lk-step__line" />
  </view>
</template>

<style scoped lang="scss">
.lk-step {
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:center;
  flex:1;
  min-width:140rpx;
  &__icon {
    width: 52rpx; height:52rpx;
    border-radius:50%;
    background: var(--lk-color-primary-bg-soft);
    display:flex; align-items:center; justify-content:center;
    position:relative;
  }
  &__dot {
    width: 18rpx; height:18rpx;
    background: var(--lk-color-primary);
    border-radius:50%;
  }
  &__done, &__err { position:absolute; color: var(--lk-color-text-inverse); }
  &__done { background: var(--lk-color-primary); width:100%; height:100%; border-radius:50%; display:flex; align-items:center; justify-content:center; }
  &__err { background: var(--lk-color-primary-active); width:100%; height:100%; border-radius:50%; display:flex; align-items:center; justify-content:center; }
  &__content { margin-top: 12rpx; text-align:center; display:flex; flex-direction:column; gap:4rpx; }
  &__title { font-size:24rpx; }
  &__sub { font-size:22rpx; color: var(--lk-color-text-secondary); }
  &__line {
    position:absolute;
    top:26rpx;
    left:calc(50% + 26rpx);
    right:-50%;
    height:4rpx;
    background: var(--lk-color-border-weak);
    z-index:-1;
  }
  &:last-child .lk-step__line { display:none; }
  &.is-finished .lk-step__line { background: var(--lk-color-primary); }
}
</style>