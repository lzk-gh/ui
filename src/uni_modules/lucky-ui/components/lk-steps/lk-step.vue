<script setup lang="ts">
import { inject, computed, onMounted } from 'vue';
defineOptions({ name: 'LkStep' });

const props = defineProps({
  title: { type: String, default: '' },
  sub: { type: String, default: '' },
  index: { type: Number, default: 0 },
  icon: { type: String, default: '' },
});

const ctx = inject<any>('LkSteps');
const active = computed(() => ctx?.props.current === props.index);
const finished = computed(() => ctx?.props.current > props.index);
const error = computed(() => ctx?.props.status === 'error' && active.value);
const showNumber = computed(() => ctx?.props.showNumber);
const type = computed(() => ctx?.props.type || 'default');

onMounted(() => {
  ctx?.register?.(props);
});
</script>

<template>
  <view
    class="lk-step"
    :class="{
      'is-active': active,
      'is-finished': finished,
      'is-error': error,
    }"
    :style="{
      '--step-index': index,
    }"
  >
    <!-- 图标/数字区域 -->
    <view class="lk-step__icon">
      <!-- 涟漪动画（激活态） -->
      <view v-if="active" class="lk-step__ripple" />

      <!-- 圆点内容 -->
      <view class="lk-step__circle">
        <!-- 完成图标 -->
        <lk-icon v-if="finished" name="check" size="28" class="lk-step__check" />
        <!-- 错误图标 -->
        <lk-icon v-else-if="error" name="x" size="28" class="lk-step__error-icon" />
        <!-- 自定义图标 -->
        <lk-icon v-else-if="icon" :name="icon" size="28" class="lk-step__custom-icon" />
        <!-- 数字序号 -->
        <text v-else-if="showNumber || type === 'default'" class="lk-step__number">
          {{ index + 1 }}
        </text>
        <!-- 默认圆点 -->
        <view v-else class="lk-step__dot" />
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="lk-step__content">
      <text class="lk-step__title">{{ title }}</text>
      <text v-if="sub" class="lk-step__sub">{{ sub }}</text>
    </view>

    <!-- 连接线 -->
    <view class="lk-step__line">
      <view class="lk-step__line-fill" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
