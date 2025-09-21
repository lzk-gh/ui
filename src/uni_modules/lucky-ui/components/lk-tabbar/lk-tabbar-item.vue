<script setup lang="ts">
/**
 * LkTabbarItem - 与“FAB 浮动测量方案”配套
 * 不再依赖 flex order；所有 item 顺序即 slot 顺序
 * 仍支持 activeEffect / labelPosition / 自定义颜色
 */
import {computed, onMounted, inject, onBeforeUnmount, ref, nextTick} from 'vue';
import {LkBadge} from "@/uni_modules/lucky-ui/components";
import LkIcon from "@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue";

defineOptions({name: 'LkTabbarItem'});

/** 属性（中文注释） */
const props = defineProps({
  /** 唯一标识（与父 Tabbar modelValue 对应） */
  name: {type: [String, Number], required: true},
  /** 图标名称 */
  icon: {type: String, default: ''},
  /** 小红点 */
  dot: {type: Boolean, default: false},
  /** 角标数字/文本 */
  badge: {type: [String, Number], default: ''},
  /** 单项激活颜色（覆盖父 activeColor） */
  activeColor: {type: String, default: ''},
  /** 单项未激活颜色（覆盖父 inactiveColor） */
  inactiveColor: {type: String, default: ''},
  /** 单项激活背景色（覆盖父 activeBgColor） */
  activeBgColor: {type: String, default: ''}
});

const tabbar = inject<any>('LkTabbar');
if (!tabbar) console.warn('[LkTabbarItem] 必须放在 LkTabbar 内使用');

const rootRef = ref<HTMLElement|null>(null);
const isActive = computed(()=> tabbar?.active.value === props.name);

const colors = computed(()=> {
  const ac = props.activeColor || tabbar?.activeColor?.value;
  const ic = props.inactiveColor || tabbar?.inactiveColor?.value;
  return {ac, ic};
});
const effect = computed(()=> tabbar?.activeEffect?.value || 'background');
const labelPos = computed(()=> tabbar?.labelPosition?.value || 'below');
const transitionMs = computed(()=> tabbar?.transitionMs?.value || 240);
const activeBg = computed(()=> props.activeBgColor || tabbar?.activeBgColor?.value);

const itemClass = computed(()=>[
  'lk-tabbar-item',
  `lk-tabbar-item--effect-${effect.value}`,
  `lk-tabbar-item--labels-${labelPos.value}`,
  { 'is-active': isActive.value }
]);

const itemStyle = computed(()=> {
  const st:any = {
    flex: '1 1 0',
    minWidth: '0',
    color: isActive.value ? colors.value.ac : colors.value.ic,
    transition: `color ${transitionMs.value}ms, background ${transitionMs.value}ms, transform ${transitionMs.value}ms`
  };
  if (effect.value === 'background') {
    st.background = isActive.value ? activeBg.value : 'transparent';
    st.borderRadius = 'var(--lk-radius-pill)';
  }
  if (effect.value === 'lift' && isActive.value) {
    st.transform = 'translateY(-8rpx)';
    st.boxShadow = '0 6rpx 18rpx rgba(0,0,0,0.15)';
    st.background = activeBg.value;
    st.borderRadius = 'var(--lk-radius-pill)';
  }
  if (effect.value === 'scale' && isActive.value) {
    st.transform = 'scale(1.12)';
  }
  return st;
});

function click() {
  tabbar?.select(props.name);
}

onMounted(()=> {
  tabbar?.register({ name: props.name, el: rootRef.value });
  nextTick(()=> {
    // underline / FAB 重新测量由父调度（父在注册时已有 schedule）
  });
});
onBeforeUnmount(()=> tabbar?.unregister(props.name));
</script>

<template>
  <view ref="rootRef" :class="itemClass" :style="itemStyle" @click="click">
    <view
        v-if="props.icon"
        class="lk-tabbar-item__icon"
        :class="{ 'icon-beside': labelPos==='beside' }"
    >
      <lk-badge v-if="props.badge || props.dot" :value="props.badge" :dot="props.dot">
        <lk-icon :name="props.icon" size="44" />
      </lk-badge>
      <lk-icon v-else :name="props.icon" size="44" />
    </view>
    <text
        v-if="labelPos!=='hidden' || (labelPos==='hidden' && isActive)"
        class="lk-tabbar-item__text"
        :class="{ 'text-beside': labelPos==='beside' }"
    >
      <slot />
    </text>
  </view>
</template>

<style scoped lang="scss">
.lk-tabbar-item {
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  font-size:22rpx;
  padding:8rpx 6rpx;
  position:relative;
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  min-width:0;
  gap:4rpx; /* 某些小程序不完全支持 gap，可改用 margin-bottom 兼容 */

  &__icon {
    line-height:1;
    display:flex;
    align-items:center;
    justify-content:center;
    transition:transform var(--lk-transition-fast);
  }

  &--labels-beside {
    flex-direction:row;
    gap:8rpx;
    .lk-tabbar-item__icon.icon-beside {
      margin-right:6rpx;
    }
    .lk-tabbar-item__text.text-beside {
      font-size:24rpx;
    }
  }

  &:active:not(.is-active) {
    background: var(--lk-color-primary-bg-soft);
  }

  &--effect-background,
  &--effect-lift,
  &--effect-scale {
    padding:8rpx 12rpx;
  }

  &.is-active {
    font-weight:600;
  }

  &__text {
    max-width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
}
</style>