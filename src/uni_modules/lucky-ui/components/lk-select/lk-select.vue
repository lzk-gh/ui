<script setup lang="ts">
import { ref, computed, provide, watch, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
import { selectProps, selectEmits } from './select.props';
import { useTransition } from '@/uni_modules/lucky-ui/composables/useTransition';
import LkOption from './lk-option.vue';

defineOptions({ name: 'LkSelect' });

const props = defineProps(selectProps);
const emit = defineEmits(selectEmits);

const form = inject(formContextKey, null);
const open = ref(false);
const focused = ref(false);
const internal = ref<any[]>([]);
const options = ref<any[]>([]);

// 动画配置 - 参考 shadcn 风格
const { classes: transitionClasses, styles: transitionStyles, display } = useTransition(
  () => open.value,
  {
    name: 'fade',
    duration: 200,
    easing: 'ease-out',
    enterFrom: { opacity: 0, transform: 'scale(0.95) translateY(-10rpx)' },
    enterTo: { opacity: 1, transform: 'scale(1) translateY(0)' },
    leaveFrom: { opacity: 1, transform: 'scale(1) translateY(0)' },
    leaveTo: { opacity: 0, transform: 'scale(0.95) translateY(-10rpx)' },
  }
);

watch(() => props.modelValue, syncFromValue, { immediate: true });

function syncFromValue() {
  if (props.multiple) {
    internal.value = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  } else {
    internal.value =
      props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
        ? [props.modelValue]
        : [];
  }
}

function toggle(openState?: boolean) {
  if (props.disabled) return;
  const target = openState !== undefined ? openState : !open.value;
  if (target === open.value) return;
  open.value = target;
  emit(target ? 'open' : 'close');
  if (target) focused.value = true;
  else focused.value = false;
}

function onSelect(val: any, label: string) {
  if (props.multiple) {
    const set = new Set(internal.value);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    const arr = Array.from(set);
    internal.value = arr;
    emit('update:modelValue', arr);
    emit('change', arr);
  } else {
    internal.value = [val];
    emit('update:modelValue', val);
    emit('change', val);
    if (props.closeOnSelect) toggle(false);
  }
  if (props.prop) form?.emitFieldChange(props.prop);
}

function removeTag(val: any) {
  const arr = internal.value.filter(v => v !== val);
  internal.value = arr;
  emit('update:modelValue', arr);
  emit('change', arr);
  if (props.prop) form?.emitFieldChange(props.prop);
}

function clear() {
  if (props.disabled) return;
  internal.value = [];
  emit('update:modelValue', props.multiple ? [] : '');
  emit('clear');
  emit('change', props.multiple ? [] : '');
  if (props.prop) form?.emitFieldChange(props.prop);
}

const displayText = computed(() => {
  if (!internal.value.length) return '';
  if (props.multiple)
    return internal.value.map(v => {
      const opt = options.value.find(o => o.value === v);
      return opt?.label ?? v;
    });
  const single = options.value.find(o => o.value === internal.value[0]);
  return single?.label ?? internal.value[0];
});

// 获取选项标签
function getOptionLabel(val: any) {
  const opt = options.value.find(o => o.value === val);
  return opt?.label ?? val;
}

function register(option: any) {
  options.value.push(option);
}
function unregister(option: any) {
  options.value = options.value.filter(o => o !== option);
}

provide('LkSelect', {
  register,
  unregister,
  selectedValues: internal,
  multiple: props.multiple,
  select: onSelect,
});

function onWrapperClick() {
  toggle();
}

function onBlur() {
  focused.value = false;
  emit('blur');
  if (props.prop) form?.emitFieldBlur(props.prop);
}
</script>

<template>
  <view
    class="lk-select"
    :class="[
      `lk-select--${size}`,
      { 'is-open': open, 'is-disabled': disabled, 'is-focused': focused },
    ]"
  >
    <!-- 透明遮罩，用于点击外部关闭 -->
    <view v-if="open" class="lk-select__mask" @click.stop="toggle(false)" />

    <view class="lk-select__control" @click="onWrapperClick">
      <!-- 内容区域 -->
      <view class="lk-select__content">
        <!-- 单选已选值（包含清除按钮） -->
        <view v-if="displayText && !multiple" class="lk-select__value">
          <text class="lk-select__value-text">{{ displayText }}</text>
          <view
            v-if="clearable"
            class="lk-select__value-clear"
            @click.stop="clear"
          >
            <lk-icon name="x" :size="24" />
          </view>
        </view>

        <!-- 多选标签 -->
        <template v-else-if="multiple && internal.length">
          <view
            v-for="val in internal.slice(0, maxTagCount)"
            :key="val"
            class="lk-select__value"
          >
            <text class="lk-select__value-text">{{ getOptionLabel(val) }}</text>
            <view
              class="lk-select__value-clear"
              @click.stop="removeTag(val)"
            >
              <lk-icon name="x" :size="24" />
            </view>
          </view>
          <!-- 超出数量提示 -->
          <view v-if="internal.length > maxTagCount" class="lk-select__value lk-select__value--more">
            <text class="lk-select__value-text">+{{ internal.length - maxTagCount }}</text>
          </view>
        </template>

        <!-- 占位符 -->
        <text v-if="!internal.length" class="lk-select__placeholder">{{ placeholder }}</text>
      </view>

      <!-- 箭头（始终在最右侧） -->
      <view class="lk-select__arrow" :class="{ 'is-up': open }">
        <lk-icon name="chevron-down" :size="32" />
      </view>
    </view>

    <view
      v-if="display"
      class="lk-select__dropdown"
      :class="transitionClasses"
      :style="transitionStyles"
    >
      <slot />
      <lk-option
        v-for="opt in props.options"
        :key="opt.value"
        :value="opt.value"
        :label="opt.label"
        :disabled="opt.disabled"
      />
      <view v-if="!options.length && (!props.options || !props.options.length)" class="lk-select__empty">无数据</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-select {
  // 控件尺寸变量
  --_h: var(--lk-control-height-md);
  --_fs: var(--lk-control-font-size-md);
  --_px: 24rpx;
  --_gap: 12rpx; // value 内部间距（xy一致）
  --_radius: var(--lk-radius-lg);
  --_value-radius: var(--lk-radius-md); // value 圆角

  position: relative;
  width: 100%;
  font-size: var(--_fs);

  &--sm {
    --_h: var(--lk-control-height-sm);
    --_fs: var(--lk-control-font-size-sm);
    --_px: 20rpx;
    --_gap: 8rpx;
    --_radius: var(--lk-radius-md);
    --_value-radius: var(--lk-radius-sm);
  }

  &--lg {
    --_h: var(--lk-control-height-lg);
    --_fs: var(--lk-control-font-size-lg);
    --_px: 28rpx;
    --_gap: 16rpx;
    --_radius: var(--lk-radius-xl);
    --_value-radius: var(--lk-radius-lg);
  }

  &__control {
    display: flex;
    align-items: center;
    min-height: var(--_h);
    border: 2rpx solid var(--lk-input-border-color);
    border-radius: var(--_radius);
    font-size: var(--_fs);
    padding: 12rpx var(--_px);
    gap: 16rpx;
    background: var(--lk-color-bg-surface);
    transition: border-color var(--lk-transition-fast), box-shadow var(--lk-transition-fast);
  }

  &.is-open &__control,
  &.is-focused &__control {
    border-color: var(--lk-input-border-color-active);
    box-shadow: var(--lk-input-shadow-focus);
  }

  // 内容区域（占据剩余空间）
  &__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8rpx;
  }

  &__placeholder {
    color: var(--lk-color-text-placeholder);
    line-height: 1.4;
  }

  // 统一的 value 样式（单选和多选共用）
  &__value {
    display: inline-flex;
    align-items: center;
    gap: var(--_gap);
    padding: var(--_gap);
    background: var(--lk-color-primary-bg-soft);
    border-radius: var(--_value-radius);
    max-width: 100%;

    &--more {
      background: var(--lk-color-fill-secondary);

      .lk-select__value-text {
        color: var(--lk-color-text-secondary);
      }
    }
  }

  &__value-text {
    color: var(--lk-color-primary);
    font-size: var(--_fs);
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__value-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 28rpx;
    height: 28rpx;
    color: var(--lk-color-primary);
    opacity: 0.6;
    border-radius: var(--lk-radius-full);
    transition: all var(--lk-transition-fast);

    &:active {
      opacity: 1;
      background: var(--lk-color-primary-bg-hover);
    }
  }

  // 箭头（固定在右侧）
  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--lk-color-text-tertiary);
    transform: rotate(0deg);
    transition: transform var(--lk-transition-fast);

    &.is-up {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: absolute;
    left: 0;
    top: calc(100% + 8rpx);
    width: 100%;
    background: var(--lk-color-bg-elevated);
    border: 2rpx solid var(--lk-color-border-weak);
    box-shadow: var(--lk-shadow-lg);
    border-radius: var(--lk-radius-lg);
    max-height: 480rpx;
    overflow-y: auto;
    z-index: 2000;
    padding: 8rpx;
    transform-origin: top center;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48rpx 24rpx;
    font-size: 26rpx;
    color: var(--lk-color-text-tertiary);
  }

  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1999;
    background: transparent;
  }

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;

    .lk-select__control {
      background: var(--lk-color-fill-secondary);
      cursor: not-allowed;
    }
  }
}

// 表单错误状态
.lk-form-item.is-error .lk-select .lk-select__control {
  border-color: var(--lk-color-danger);

  &:focus,
  .lk-select.is-open &,
  .lk-select.is-focused & {
    box-shadow: 0 0 0 4rpx var(--lk-color-danger-bg-soft);
  }
}
</style>
