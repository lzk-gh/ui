<script setup lang="ts">
import { ref, provide, watch, onMounted, nextTick } from 'vue';

defineOptions({ name: 'LkTabs' });

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  lazy: { type: Boolean, default: true },
  type: { type: String, default: 'line' }, // line | card
  stretch: { type: Boolean, default: true }
});
const emit = defineEmits(['update:modelValue','change']);

const current = ref(props.modelValue);
watch(()=>props.modelValue, v => current.value = v);

const panes = ref<any[]>([]);

function register(pane:any) {
  if(!panes.value.includes(pane)) {
    panes.value.push(pane);
    if(!current.value) {
      current.value = pane.name;
      emit('update:modelValue', current.value);
    }
  }
}
function unregister(pane:any) {
  panes.value = panes.value.filter(p=>p!==pane);
}

function setActive(name:any) {
  if(name === current.value) return;
  current.value = name;
  emit('update:modelValue', name);
  emit('change', name);
}

provide('LkTabs', {
  register,
  unregister,
  active: current,
  lazy: props.lazy
});

const lineStyle = ref<any>({});
function updateLine(){
  if(props.type!=='line') return;
  nextTick(()=>{
    const idx = panes.value.findIndex(p=>p.name===current.value);
    if(idx<0) return;
    const nav = (uni as any)?.createSelectorQuery ? uni.createSelectorQuery().in?.(null) : null;
  });
}
watch(current, updateLine);
onMounted(updateLine);
</script>

<template>
  <view class="lk-tabs" :class="[`lk-tabs--${type}`, { 'is-stretch': stretch }]">
    <scroll-view scroll-x class="lk-tabs__nav">
      <view
          v-for="pane in panes"
          :key="pane.name"
          class="lk-tabs__nav-item"
          :class="{ 'is-active': pane.name === current }"
          @click="setActive(pane.name)"
      >
        <text class="lk-tabs__label">{{ pane.label }}</text>
      </view>
      <view v-if="type==='line'" class="lk-tabs__line" :style="lineStyle"></view>
    </scroll-view>
    <view class="lk-tabs__content">
      <slot />
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-tabs {
  display: flex;
  flex-direction: column;
  --_nav-bg: var(--lk-color-bg-surface);
  --_active-color: var(--lk-color-primary);
  &__nav {
    white-space: nowrap;
    display: flex;
    background: var(--_nav-bg);
    border-bottom: 2rpx solid var(--lk-color-border-weak);
    padding: 0 8rpx;
  }
  &__nav-item {
    position: relative;
    padding: 24rpx 36rpx;
    font-size: 28rpx;
    color: var(--lk-color-text-secondary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    &.is-active {
      color: var(--_active-color);
      font-weight: 600;
    }
  }
  &--card &__nav-item {
    margin: 12rpx 12rpx 0;
    background: var(--lk-color-primary-bg-soft);
    border-radius: var(--lk-radius-pill);
    padding: 18rpx 32rpx;
    &.is-active {
      background: var(--lk-color-primary);
      color: var(--lk-color-text-inverse);
    }
  }
  &__line {
    position: absolute;
    bottom: 0;
    height: 4rpx;
    background: var(--lk-color-primary);
    border-radius: 2rpx;
    transition: left var(--lk-transition-fast), width var(--lk-transition-fast);
  }
  &__content {
    padding: 24rpx 4rpx;
  }
  &.is-stretch &__nav-item {
    flex: 1;
    justify-content: center;
  }
}
</style>