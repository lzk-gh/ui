<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { keyboardProps, keyboardEmits, type KeyboardKey } from './keyboard.props';
import {
  resolveKeyboardClass,
  resolveKeyboardKeyClass,
  resolveKeyboardKeyStyle,
  resolveKeyboardLayout,
  resolveKeyboardPressAction,
  resolveKeyboardStyle,
  type KeyboardPlateMode,
} from './keyboard.utils';
import LkIcon from '../lk-icon/lk-icon.vue';
import { useLocale } from '../../composables/useLocale';

defineOptions({ name: 'LkKeyboard' });

const props = defineProps(keyboardProps);
const emit = defineEmits(keyboardEmits);
const { t } = useLocale('keyboard');

// 内部显示状态
const isVisible = ref(props.visible);

watch(
  () => props.visible,
  val => {
    isVisible.value = val;
  }
);

// 车牌模式：省份 or 字母数字
const plateMode = ref<KeyboardPlateMode>('province');

// 当前键盘布局
const currentLayout = computed((): KeyboardKey[][] => resolveKeyboardLayout({
  type: props.type,
  random: props.random,
  showDot: props.showDot,
  extraKey: props.extraKey,
  showDelete: props.showDelete,
  keys: props.keys,
  plateMode: plateMode.value,
  abcText: t('abc'),
  provinceText: t('province'),
}));

// 触感反馈
function triggerHaptic() {
  if (props.vibrate) {
    // #ifdef APP-PLUS || MP-WEIXIN
    uni.vibrateShort({ type: 'light' });
    // #endif
  }
}

// 按键点击
function onKeyPress(key: KeyboardKey) {
  const action = resolveKeyboardPressAction({
    key,
    modelValue: props.modelValue,
    maxLength: props.maxLength,
    plateMode: plateMode.value,
  });

  if (action.kind === 'ignore') return;

  triggerHaptic();
  emit('key-press', key);

  // 删除
  if (action.kind === 'delete') {
    emit('delete');
    if (props.modelValue.length > 0) {
      emit('update:modelValue', action.nextValue);
    }
    return;
  }

  // 确认
  if (action.kind === 'confirm') {
    emit('confirm', props.modelValue);
    closeKeyboard();
    return;
  }

  // 车牌切换
  if (action.kind === 'switch') {
    plateMode.value = action.nextPlateMode;
    return;
  }

  // 普通输入
  if (action.kind === 'input') {
    emit('input', action.input);
    emit('update:modelValue', action.nextValue);
  }
}

// 确认按钮
function onConfirm() {
  triggerHaptic();
  emit('confirm', props.modelValue);
  closeKeyboard();
}

// 关闭键盘
function closeKeyboard() {
  isVisible.value = false;
  emit('update:visible', false);
  emit('close');
}

// 遮罩点击
function onOverlayClick() {
  if (props.closeOnOverlay) {
    closeKeyboard();
  }
}

// 安全区域高度
const safeBottom = uni.getSystemInfoSync().safeAreaInsets?.bottom || 0;

const resolvedConfirmText = computed(() => props.confirmText || t('confirm'));

// 样式计算
const keyboardClass = computed(() => resolveKeyboardClass({
  theme: props.theme,
  type: props.type,
  isVisible: isVisible.value,
  blur: props.blur,
}));

const keyboardStyle = computed(() => resolveKeyboardStyle({
  zIndex: props.zIndex,
  safeAreaInsetBottom: props.safeAreaInsetBottom,
  safeBottom,
}));

// 按键样式
function getKeyClass(key: KeyboardKey) {
  return resolveKeyboardKeyClass(key);
}

function getKeyStyle(key: KeyboardKey) {
  return resolveKeyboardKeyStyle(key);
}
</script>

<template>
  <!-- 遮罩 -->
  <view
    v-if="overlay"
    class="lk-keyboard__overlay"
    :class="{ 'is-visible': isVisible }"
    :style="{ zIndex: zIndex - 1 }"
    @click="onOverlayClick"
  />

  <!-- 键盘主体 -->
  <view :class="keyboardClass" :style="keyboardStyle">
    <!-- 标题栏 -->
    <view v-if="title || showClose || showConfirm" class="lk-keyboard__header">
      <view class="lk-keyboard__header-left">
        <view v-if="showClose" class="lk-keyboard__close" @click="closeKeyboard">
          <text class="lk-keyboard__close-text">{{ t('hide') }}</text>
        </view>
      </view>
      <view class="lk-keyboard__title">
        <text v-if="title">{{ title }}</text>
      </view>
      <view class="lk-keyboard__header-right">
        <view v-if="showConfirm" class="lk-keyboard__done" @click="onConfirm">
          <text class="lk-keyboard__done-text">{{ resolvedConfirmText }}</text>
        </view>
      </view>
    </view>

    <!-- 拖拽指示条 -->
    <view class="lk-keyboard__indicator">
      <view class="lk-keyboard__indicator-bar" />
    </view>

    <!-- 键盘区域 -->
    <view class="lk-keyboard__body">
      <view v-for="(row, rowIndex) in currentLayout" :key="rowIndex" class="lk-keyboard__row">
        <view
          v-for="(key, keyIndex) in row"
          :key="keyIndex"
          :class="getKeyClass(key)"
          :style="getKeyStyle(key)"
          @click="onKeyPress(key)"
        >
          <template v-if="key.type === 'delete'">
            <LkIcon name="arrow-left" :size="40" />
          </template>
          <template v-else-if="key.type === 'empty'">
            <!-- 空按键 -->
          </template>
          <template v-else>
            <text class="lk-keyboard__key-text">{{ key.text }}</text>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './lk-keyboard.scss';
</style>
