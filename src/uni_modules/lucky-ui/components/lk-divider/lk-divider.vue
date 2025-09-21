<script setup lang="ts">
defineOptions({ name:'LkDivider' });
const props = defineProps({
  dashed: { type:Boolean, default:false },
  vertical: { type:Boolean, default:false },
  text: { type:String, default:'' },
  hairline: { type:Boolean, default:true }
});
</script>

<template>
  <view
      class="lk-divider"
      :class="[{ 'is-vertical': vertical, 'is-dashed': dashed, 'is-hairline': hairline, 'has-text': text || $slots.default }]"
  >
    <text class="lk-divider__text"><slot>{{ text }}</slot></text>
  </view>
</template>

<style scoped lang="scss">
.lk-divider {
  position: relative;
  height: 2rpx;
  background: var(--lk-color-border-weak);
  margin: 40rpx 0;
  &.is-hairline { height:1rpx; }
  &.is-dashed { background: none; border-top: 2rpx dashed var(--lk-color-border-weak); }
  &.has-text {
    text-align:center;
    .lk-divider__text {
      position:relative;
      top: -26rpx;
      background: var(--lk-color-bg-body);
      padding: 0 20rpx;
      font-size: 24rpx;
      color: var(--lk-color-text-secondary);
    }
  }
  &.is-vertical {
    width:2rpx;
    height:100%;
    background: var(--lk-color-border-weak);
    margin:0 24rpx;
    display:inline-block;
  }
}
</style>