<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkRate' });

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  count: { type: Number, default: 5 },
  allowHalf: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  // 支持数字或字符串，纯数字会自动拼接 rpx
  size: { type: [String, Number], default: 40 },
  // 选中部分颜色（前景色），为空时使用主题色
  color: { type: String, default: '' },
  // 使用自定义图标名（lk-icon），为空时使用内置 SVG 星形
  icon: { type: String, default: '' },
  prop: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue', 'change', 'hover']);

const form = inject(formContextKey, null);

const value = ref(props.modelValue);
watch(
  () => props.modelValue,
  v => (value.value = v)
);

function set(val: number) {
  if (props.disabled || props.readonly) return;
  if (val < 0) val = 0;
  if (val > props.count) val = props.count;
  if (val !== value.value) {
    value.value = val;
    emit('update:modelValue', val);
    emit('change', val);
    if (props.prop) form?.emitFieldChange(props.prop, val);
  }
}

function onTap(i: number, e: any) {
  if (props.disabled || props.readonly) return;
  if (props.allowHalf) {
    const rect = e.target.getBoundingClientRect?.() || {};
    const x = e.changedTouches?.[0]?.clientX || e.clientX;
    const isHalf = x - rect.left < rect.width / 2;
    set(i - (isHalf ? 0.5 : 0));
  } else {
    set(i);
  }
}

const stars = computed(() => Array.from({ length: props.count }, (_, i) => i + 1));

// 归一化尺寸（rpx）
const normSize = computed(() => {
  const s = String(props.size);
  return /^\d+$/.test(s) ? `${s}rpx` : s;
});

// 有效的前景色
const activeColor = computed(() => props.color || 'var(--lk-color-primary)');
</script>

<template>
  <view class="lk-rate" :class="{ 'is-disabled': disabled, 'is-readonly': readonly }">
    <view
      v-for="i in stars"
      :key="i"
      class="lk-rate__item"
      @click="onTap(i, $event)"
      @touchend="onTap(i, $event)"
    >
      <view
        class="lk-rate__icon"
        :class="{
          'is-full': value >= i,
          'is-half': allowHalf && value + 1 > i && value < i,
        }"
        :style="{ width: normSize, height: normSize }"
      >
        <!-- 自定义图标模式 -->
        <template v-if="icon">
          <lk-icon
            class="lk-rate__layer lk-rate__icon-bg"
            :name="icon"
            :size="size"
            :color="'var(--lk-color-primary-bg-soft)'"
          />
          <lk-icon
            class="lk-rate__layer lk-rate__icon-fg"
            :name="icon"
            :size="size"
            :color="activeColor"
            :custom-style="{
              clipPath:
                allowHalf && value + 1 > i && value < i
                  ? 'inset(0 50% 0 0)'
                  : value >= i
                    ? 'inset(0 0 0 0)'
                    : 'inset(0 100% 0 0)',
            }"
          />
        </template>
        <!-- 默认 SVG 星形模式 -->
        <template v-else>
          <svg viewBox="0 0 24 24" class="lk-rate__svg">
            <path
              class="lk-rate__star-bg"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
            <path
              class="lk-rate__star-fg"
              :style="{
                clipPath:
                  allowHalf && value + 1 > i && value < i
                    ? 'inset(0 50% 0 0)'
                    : value >= i
                      ? 'inset(0 0 0 0)'
                      : 'inset(0 100% 0 0)',
                fill: color || undefined,
              }"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-rate {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  &__item {
    display: inline-flex;
  }
  &__icon {
    position: relative;
  }
  &__layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  &__svg {
    width: 100%;
    height: 100%;
  }
  &__star-bg {
    fill: var(--lk-color-primary-bg-soft);
  }
  &__star-fg {
    fill: var(--lk-color-primary);
    transition: clip-path var(--lk-transition-fast);
  }
  &.is-disabled {
    opacity: 0.5;
  }
}
</style>
