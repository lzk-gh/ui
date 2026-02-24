<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkSlider from '@/uni_modules/lucky-ui/components/lk-slider/lk-slider.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import { useTransition } from '@/uni_modules/lucky-ui/composables';
import { addUnit, debounce, throttle, isH5, isMpWeixin } from '@/uni_modules/lucky-ui/core/src';

const visible = ref(false);
const transition = useTransition(() => visible.value, {
  name: 'fade-up',
  duration: 280,
});

const transitionDisplay = computed(() => transition.display.value);
const transitionClasses = computed(() => transition.classes.value);
const transitionStyles = computed(() => transition.styles.value);

const toggleVisible = () => {
  visible.value = !visible.value;
};

const keyword = ref('');
const debouncedKeyword = ref('');
const setDebouncedKeyword = debounce((...args: unknown[]) => {
  debouncedKeyword.value = String(args[0] ?? '');
}, 300);

watch(keyword, value => {
  setDebouncedKeyword(value);
});

const throttleCount = ref(0);
const increaseThrottleCount = throttle(() => {
  throttleCount.value += 1;
}, 500);

const handleThrottleClick = () => {
  increaseThrottleCount();
};

const boxSize = ref(120);
const sizeBoxStyle = computed(() => {
  const unitSize = addUnit(boxSize.value) || '120rpx';
  return {
    width: unitSize,
    height: unitSize,
  };
});

const platformText = computed(() => {
  if (isMpWeixin()) return '微信小程序';
  if (isH5()) return 'H5';
  return '其他平台';
});
</script>

<template>
  <view class="component-demo">
    <demo-block title="useTransition：显隐动画">
      <lk-button type="primary" @click="toggleVisible">
        {{ visible ? '隐藏内容' : '显示内容' }}
      </lk-button>
      <view
        v-if="transitionDisplay"
        class="transition-box"
        :class="transitionClasses"
        :style="transitionStyles"
      >
        <text class="transition-text">Hooks & Utils</text>
      </view>
    </demo-block>

    <demo-block title="debounce / throttle">
      <lk-input v-model="keyword" placeholder="输入关键字（300ms 防抖）" />
      <text class="demo-text">防抖结果：{{ debouncedKeyword || '（暂无）' }}</text>

      <lk-button style="margin-top: 16rpx" @click="handleThrottleClick">
        点击节流计数（500ms）
      </lk-button>
      <text class="demo-text">节流触发次数：{{ throttleCount }}</text>
    </demo-block>

    <demo-block title="addUnit / platform">
      <view class="size-row">
        <text class="size-label">方块尺寸：{{ boxSize }} (number)</text>
      </view>
      <lk-slider v-model="boxSize" :min="60" :max="260" :step="10" />

      <view class="size-box" :style="sizeBoxStyle">
        <text class="size-box-text">{{ sizeBoxStyle.width }}</text>
      </view>

      <text class="demo-text">当前平台：{{ platformText }}</text>
    </demo-block>
  </view>
</template>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.transition-box {
  margin-top: 16rpx;
  border-radius: 16rpx;
  padding: 28rpx;
  background: var(--lk-color-primary);
}

.transition-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.demo-text {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
}

.size-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.size-label {
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
}

.size-box {
  margin-top: 20rpx;
  border-radius: 16rpx;
  background: var(--lk-color-primary-light-8);
  border: 1rpx solid var(--lk-color-primary-light-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-box-text {
  font-size: 24rpx;
  color: var(--lk-color-primary);
}
</style>
