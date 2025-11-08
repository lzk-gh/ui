<script setup lang="ts">
import { ref, computed, provide, watch, onMounted, onBeforeUnmount, nextTick, inject } from 'vue';
import { formContextKey } from '../lk-form/context';
defineOptions({ name: 'LkSelect' });

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: '' },
  multiple: { type: Boolean, default: false },
  placeholder: { type: String, default: '请选择' },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  prop: { type: String, default: '' },
  size: { type: String, default: 'md' },
  maxTagCount: { type: Number, default: 3 },
  closeOnSelect: { type: Boolean, default: true },
});
const emit = defineEmits([
  'update:modelValue',
  'change',
  'focus',
  'blur',
  'clear',
  'open',
  'close',
]);

const form = inject(formContextKey, null);
const open = ref(false);
const focused = ref(false);
const internal = ref<any[]>([]);
const options = ref<any[]>([]);
const selectRef = ref<any>();

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
    <view class="lk-select__control" @click="onWrapperClick">
      <view class="lk-select__value" v-if="displayText && !multiple">
        <text>{{ displayText }}</text>
      </view>

      <view class="lk-select__tags" v-else-if="multiple && internal.length">
        <lk-tag
          v-for="(val, i) in internal.slice(0, maxTagCount)"
          :key="val"
          type="soft"
          size="sm"
          >{{ (options.find(o => o.value === val) || {}).label || val }}</lk-tag
        >
        <lk-tag v-if="internal.length > maxTagCount" size="sm" type="soft">
          +{{ internal.length - maxTagCount }}
        </lk-tag>
      </view>

      <text v-if="!internal.length" class="lk-select__placeholder">{{ placeholder }}</text>
      <view v-if="clearable && internal.length" class="lk-select__clear" @click.stop="clear"
        >×</view
      >
      <view class="lk-select__arrow" :class="{ 'is-up': open }">⌄</view>
    </view>

    <view v-if="open" class="lk-select__dropdown">
      <slot />
      <view v-if="!options.length" class="lk-select__empty">无数据</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-select {
  --_h: var(--lk-control-height-md);
  --_fs: var(--lk-control-font-size-md);
  --_px: var(--lk-control-padding-x-md);
  --_radius: var(--lk-radius-lg);

  position: relative;
  width: 100%;

  &--sm {
    --_h: var(--lk-control-height-sm);
    --_fs: var(--lk-control-font-size-sm);
    --_px: var(--lk-control-padding-x-sm);
    --_radius: var(--lk-radius-md);
  }
  &--lg {
    --_h: var(--lk-control-height-lg);
    --_fs: var(--lk-control-font-size-lg);
    --_px: var(--lk-control-padding-x-lg);
    --_radius: var(--lk-radius-pill);
  }

  &__control {
    display: flex;
    align-items: center;
    min-height: var(--_h);
    background: var(--lk-input-bg);
    border: 2rpx solid var(--lk-input-border-color);
    border-radius: var(--_radius);
    font-size: var(--_fs);
    padding: 0 var(--_px);
    position: relative;
    transition:
      border-color var(--lk-transition-fast),
      box-shadow var(--lk-transition-fast);
  }
  &.is-open .lk-select__control,
  &.is-focused .lk-select__control {
    border-color: var(--lk-input-border-color-active);
    box-shadow: var(--lk-input-shadow-focus);
  }
  &__placeholder {
    color: var(--lk-color-text-placeholder);
  }
  &__value {
    display: inline-flex;
    align-items: center;
    color: var(--lk-color-text);
  }
  &__tags {
    display: flex;
    flex-wrap: nowrap;
    gap: 8rpx;
    overflow: hidden;
  }
  &__clear {
    margin-left: 16rpx;
    font-size: 32rpx;
    color: var(--lk-color-text-secondary);
    padding: 8rpx;
    border-radius: var(--lk-radius-sm);
    &:active {
      background: var(--lk-color-primary-bg-soft);
      color: var(--lk-color-primary-active);
    }
  }
  &__arrow {
    margin-left: auto;
    font-size: 28rpx;
    transform: rotate(0deg);
    transition: transform var(--lk-transition-fast);
    color: var(--lk-color-text-secondary);
    &.is-up {
      transform: rotate(180deg);
    }
  }
  &__dropdown {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    margin-top: 8rpx;
    background: var(--lk-color-bg-surface);
    border: 2rpx solid var(--lk-color-border-weak);
    box-shadow: var(--lk-shadow-base);
    border-radius: var(--lk-radius-lg);
    max-height: 480rpx;
    overflow-y: auto;
    z-index: 2000;
    padding: 12rpx 0;
  }
  &__empty {
    text-align: center;
    padding: 40rpx 0;
    font-size: 24rpx;
    color: var(--lk-color-text-secondary);
  }
  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  .lk-form-item.is-error & .lk-select__control {
    border-color: var(--lk-input-border-color-error);
    box-shadow: 0 0 0 4rpx var(--lk-color-primary-bg-soft);
  }
}
</style>
