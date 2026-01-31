<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { keyboardProps, keyboardEmits, type KeyboardKey } from './keyboard.props';
import LkIcon from '../lk-icon/lk-icon.vue';

defineOptions({ name: 'LkKeyboard' });

const props = defineProps(keyboardProps);
const emit = defineEmits(keyboardEmits);

// 内部显示状态
const isVisible = ref(props.visible);

watch(
  () => props.visible,
  val => {
    isVisible.value = val;
  }
);

// 生成数字键（可随机）
function generateNumberKeys(): string[] {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if (props.random) {
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
  }
  return digits;
}

// 数字键盘布局
const numberLayout = computed((): KeyboardKey[][] => {
  const digits = generateNumberKeys();
  return [
    [
      { text: digits[0], value: digits[0] },
      { text: digits[1], value: digits[1] },
      { text: digits[2], value: digits[2] },
    ],
    [
      { text: digits[3], value: digits[3] },
      { text: digits[4], value: digits[4] },
      { text: digits[5], value: digits[5] },
    ],
    [
      { text: digits[6], value: digits[6] },
      { text: digits[7], value: digits[7] },
      { text: digits[8], value: digits[8] },
    ],
    [
      props.showDot
        ? { text: '.', value: '.' }
        : props.extraKey
          ? { text: props.extraKey, value: props.extraKey, type: 'extra' }
          : { text: '', type: 'empty' },
      { text: '0', value: '0' },
      props.showDelete ? { text: '', type: 'delete' } : { text: '', type: 'empty' },
    ],
  ];
});

// 身份证键盘布局
const idCardLayout = computed((): KeyboardKey[][] => {
  const digits = generateNumberKeys();
  return [
    [
      { text: digits[0], value: digits[0] },
      { text: digits[1], value: digits[1] },
      { text: digits[2], value: digits[2] },
    ],
    [
      { text: digits[3], value: digits[3] },
      { text: digits[4], value: digits[4] },
      { text: digits[5], value: digits[5] },
    ],
    [
      { text: digits[6], value: digits[6] },
      { text: digits[7], value: digits[7] },
      { text: digits[8], value: digits[8] },
    ],
    [
      { text: 'X', value: 'X' },
      { text: '0', value: '0' },
      { text: '', type: 'delete' },
    ],
  ];
});

// 车牌号键盘 - 省份简称
const plateProvinces = [
  '京',
  '津',
  '沪',
  '渝',
  '冀',
  '豫',
  '云',
  '辽',
  '黑',
  '湘',
  '皖',
  '鲁',
  '新',
  '苏',
  '浙',
  '赣',
  '鄂',
  '桂',
  '甘',
  '晋',
  '蒙',
  '陕',
  '吉',
  '闽',
  '贵',
  '粤',
  '青',
  '藏',
  '川',
  '宁',
  '琼',
];

// 车牌号字母数字
const plateAlphaNum = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

// 车牌模式：省份 or 字母数字
const plateMode = ref<'province' | 'alphanum'>('province');

// 车牌省份布局
const plateProvinceLayout = computed((): KeyboardKey[][] => {
  const rows: KeyboardKey[][] = [];
  const itemsPerRow = 10;

  for (let i = 0; i < plateProvinces.length; i += itemsPerRow) {
    const row = plateProvinces.slice(i, i + itemsPerRow).map(p => ({
      text: p,
      value: p,
    }));
    rows.push(row);
  }

  // 最后一行：切换按钮 + 删除
  rows.push([
    { text: 'ABC', type: 'extra', value: '__switch__' },
    { text: '', type: 'delete' },
  ]);

  return rows;
});

// 车牌字母数字布局
const plateAlphaNumLayout = computed((): KeyboardKey[][] => {
  const rows: KeyboardKey[][] = [];
  const itemsPerRow = 10;

  for (let i = 0; i < plateAlphaNum.length; i += itemsPerRow) {
    const row = plateAlphaNum.slice(i, i + itemsPerRow).map(c => ({
      text: c,
      value: c,
    }));
    rows.push(row);
  }

  // 最后一行：切换按钮 + 删除
  rows.push([
    { text: '省份', type: 'extra', value: '__switch__' },
    { text: '', type: 'delete' },
  ]);

  return rows;
});

// 当前键盘布局
const currentLayout = computed((): KeyboardKey[][] => {
  switch (props.type) {
    case 'number':
      return numberLayout.value;
    case 'idcard':
      return idCardLayout.value;
    case 'plate':
      return plateMode.value === 'province' ? plateProvinceLayout.value : plateAlphaNumLayout.value;
    case 'custom':
      return props.keys;
    default:
      return numberLayout.value;
  }
});

// 是否可继续输入
const canInput = computed(() => {
  if (props.maxLength <= 0) return true;
  return props.modelValue.length < props.maxLength;
});

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
  if (key.disabled) return;
  if (key.type === 'empty') return;

  triggerHaptic();
  emit('key-press', key);

  // 删除
  if (key.type === 'delete') {
    emit('delete');
    if (props.modelValue.length > 0) {
      emit('update:modelValue', props.modelValue.slice(0, -1));
    }
    return;
  }

  // 确认
  if (key.type === 'confirm') {
    emit('confirm', props.modelValue);
    closeKeyboard();
    return;
  }

  // 车牌切换
  if (key.value === '__switch__') {
    plateMode.value = plateMode.value === 'province' ? 'alphanum' : 'province';
    return;
  }

  // 普通输入
  if (key.value && canInput.value) {
    const newValue = props.modelValue + key.value;
    emit('input', key.value);
    emit('update:modelValue', newValue);
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

// 样式计算
const keyboardClass = computed(() => [
  'lk-keyboard',
  `lk-keyboard--${props.theme}`,
  `lk-keyboard--${props.type}`,
  {
    'is-visible': isVisible.value,
    'is-blur': props.blur,
  },
]);

const keyboardStyle = computed(() => ({
  zIndex: props.zIndex,
  paddingBottom: props.safeAreaInsetBottom ? `${safeBottom}px` : '0',
}));

// 按键样式
function getKeyClass(key: KeyboardKey) {
  return [
    'lk-keyboard__key',
    {
      'lk-keyboard__key--delete': key.type === 'delete',
      'lk-keyboard__key--confirm': key.type === 'confirm',
      'lk-keyboard__key--extra': key.type === 'extra',
      'lk-keyboard__key--empty': key.type === 'empty',
      'lk-keyboard__key--disabled': key.disabled,
      'lk-keyboard__key--wide': (key.flex || 1) > 1,
    },
  ];
}

function getKeyStyle(key: KeyboardKey) {
  if (key.flex && key.flex !== 1) {
    return { flex: key.flex };
  }
  return {};
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
          <text class="lk-keyboard__close-text">收起</text>
        </view>
      </view>
      <view class="lk-keyboard__title">
        <text v-if="title">{{ title }}</text>
      </view>
      <view class="lk-keyboard__header-right">
        <view v-if="showConfirm" class="lk-keyboard__done" @click="onConfirm">
          <text class="lk-keyboard__done-text">{{ confirmText }}</text>
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
            <LkIcon name="backspace" :size="44" />
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
@use './index.scss';
</style>
