<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name:'LkDivider' });

const props = defineProps({
  dashed: { type:Boolean, default:false },
  vertical: { type:Boolean, default:false },
  text: { type:String, default:'' },
  hairline: { type:Boolean, default:true },
  textPosition: { type: [String, Number], default: 'center' }
});

const textStyle = computed(()=> {
  const base: Record<string,string> = {
    position: 'absolute',
    top: '50%'
  };

  base.background = 'var(--lk-color-bg-body)';
  base.padding = '0 20rpx';

  const pos = props.textPosition as string | number;
  if (typeof pos === 'number') {
    base.left = `${pos}%`;
    base.transform = 'translateX(-50%) translateY(-50%)';
  } else if (typeof pos === 'string') {
    const pctMatch = /^\d+(\.\d+)?%$/.test(pos);
    if (pctMatch) {
      base.left = pos;
      base.transform = 'translateX(-50%) translateY(-50%)';
    } else if (pos === 'left') {
      base.left = '0%';
      base.transform = 'translateX(0) translateY(-50%)';
    } else if (pos === 'right') {
      base.left = '100%';
      base.transform = 'translateX(-100%) translateY(-50%)';
    } else {
      base.left = '50%';
      base.transform = 'translateX(-50%) translateY(-50%)';
    }
  } else {
    base.left = '50%';
    base.transform = 'translateX(-50%) translateY(-50%)';
  }
  return base;
});
</script>

<template>
  <view
      class="lk-divider"
      :class="[{ 
        'is-vertical': vertical, 
        'is-dashed': dashed, 
        'is-hairline': hairline, 
        'has-text': text || $slots.default 
      }]"
  >
    <text class="lk-divider__text" :style="textStyle">
      <slot>{{ text }}</slot>
    </text>
  </view>
</template>

<style scoped lang="scss">
.lk-divider {
  position: relative;
  height: 2rpx;
  background: var(--lk-color-border-weak);
  margin: 40rpx 0;
  &.is-hairline { height:1rpx; }
  &.is-dashed { 
    background: none; 
    border-top: 2rpx dashed var(--lk-color-border-weak); 
  }
  &.has-text {
    .lk-divider__text {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--lk-color-bg-body);
      padding: 0 20rpx;
      font-size: 24rpx;
      color: var(--lk-color-text-secondary);
      white-space: nowrap;
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