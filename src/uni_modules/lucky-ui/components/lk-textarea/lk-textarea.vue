<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { textareaProps, textareaEmits } from './textarea.props';

defineOptions({ name: 'LkTextarea' });

const props = defineProps(textareaProps);
const emit = defineEmits(textareaEmits);

const isFocused = ref(false);

const cls = computed(() => [
  'lk-textarea',
  `lk-textarea--${props.variant}`, // 动态变体类名
  {
    'is-disabled': props.disabled,
    'is-focused': isFocused.value,
    'is-auto-height': props.autoHeight,
    'has-label': !!props.label,
  },
]);

const currentCount = computed(() => String(props.modelValue || '').length);

function onInput(e: any) {
  let val = e.detail.value;

  // 手动处理 maxlength，确保在所有平台都生效
  if (props.maxlength !== -1 && val.length > props.maxlength) {
    val = val.substring(0, props.maxlength);
  }

  emit('update:modelValue', val);
  emit('input', val);
}

function onFocus(e: any) {
  if (props.disabled) return;
  isFocused.value = true;
  emit('focus', e);
}

function onBlur(e: any) {
  // 延迟失焦，防止点击 clear 按钮时先触发 blur 导致按钮消失
  setTimeout(() => {
    isFocused.value = false;
    emit('blur', e);
  }, 100);
}

function onConfirm(e: any) {
  emit('confirm', e);
}

function onLineChange(e: any) {
  emit('linechange', e);
}

// 👑 极致的清空体验
function onClear() {
  if (props.disabled) return;

  // 1. 震动反馈 (提升高级感)
  uni.vibrateShort({ success: () => {} });

  // 2. 更新值
  emit('update:modelValue', '');
  emit('input', '');
  emit('clear');

  // 3. 这里的逻辑是为了确保清空后，键盘尽可能保持
  // 注意：在某些小程序平台，点击非 input 区域可能会收起键盘，这是原生限制
}
</script>

<template>
  <view :class="cls">
    <!-- Label -->
    <view v-if="label" class="lk-textarea__label">{{ label }}</view>

    <view class="lk-textarea__wrapper">
      <textarea
        class="lk-textarea__inner"
        :value="modelValue"
        :placeholder="placeholder"
        :placeholder-class="placeholderClass"
        :disabled="disabled"
        :maxlength="maxlength"
        :auto-height="autoHeight"
        :cursor-spacing="cursorSpacing"
        :fixed="fixed"
        :confirm-type="confirmType"
        :adjust-position="adjustPosition"
        disable-default-padding
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        @linechange="onLineChange"
      />

      <!-- 清空按钮 -->
      <!-- 逻辑：开启clearable && 有内容 && 非禁用 -->
      <!-- 使用 transition 增加出现消失的动画 -->
      <view v-if="clearable || $slots.suffix" class="lk-textarea__suffix">
        <transition name="fade">
          <view
            v-if="clearable && modelValue && !disabled"
            class="lk-textarea__clear"
            @tap.stop.prevent="onClear"
          >
            <!-- 推荐使用 SVG 图标或 font-icon，这里用 CSS 画一个优雅的叉 -->
            <view class="lk-icon-close" />
          </view>
        </transition>
        <slot name="suffix" />
      </view>
    </view>

    <!-- 底部栏：左侧 footer 插槽，右侧计数 -->
    <view v-if="(showCount && maxlength !== -1) || $slots.footer" class="lk-textarea__footer">
      <view class="lk-textarea__footer-slot">
        <slot name="footer" />
      </view>
      <view v-if="showCount && maxlength !== -1" class="lk-textarea__count">
        {{ currentCount }} / {{ maxlength }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use './index.scss';

// 简单的过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
