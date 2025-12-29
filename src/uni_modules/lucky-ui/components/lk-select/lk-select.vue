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
  if (target) emit('open');
  else emit('close');
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
    if (props.prop) form?.emitFieldChange(props.prop, arr);
  } else {
    internal.value = [val];
    emit('update:modelValue', val);
    emit('change', val);
    if (props.closeOnSelect) toggle(false);
    if (props.prop) form?.emitFieldChange(props.prop, val);
  }
}

function removeTag(val: any) {
  const arr = internal.value.filter(v => v !== val);
  internal.value = arr;
  emit('update:modelValue', arr);
  emit('change', arr);
  if (props.prop) form?.emitFieldChange(props.prop, arr);
}

function clear() {
  if (props.disabled) return;
  internal.value = [];
  const val = props.multiple ? [] : '';
  emit('update:modelValue', val);
  emit('clear');
  emit('change', val);
  if (props.prop) form?.emitFieldChange(props.prop, val);
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

function onBlur(e?: any) {
  focused.value = false;
  emit('blur', e);
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

<style lang="scss">
@use './index.scss';
</style>
