<template>
  <view class="component-demo">
    <!-- 输入展示区 -->
    <view class="input-display" @click="showNumberKeyboard">
      <view class="input-label">当前输入</view>
      <view class="input-value" :class="{ 'is-placeholder': !inputValue }">
        {{ inputValue || '点击输入' }}
      </view>
    </view>

    <demo-block title="数字键盘">
      <view class="desc">标准数字键盘，适用于金额、数量等输入场景。</view>
      <view class="row">
        <lk-button size="sm" @click="showKeyboard('number')">数字键盘</lk-button>
        <lk-button size="sm" @click="showKeyboard('number', { showDot: true })">带小数点</lk-button>
        <lk-button size="sm" @click="showKeyboard('number', { random: true })">随机排列</lk-button>
      </view>
    </demo-block>

    <demo-block title="身份证键盘">
      <view class="desc">支持输入身份证号码，包含数字和 X。</view>
      <view class="row">
        <lk-button size="sm" @click="showKeyboard('idcard')">身份证键盘</lk-button>
      </view>
    </demo-block>

    <demo-block title="车牌号键盘">
      <view class="desc">支持输入车牌号，包含省份简称和字母数字。</view>
      <view class="row">
        <lk-button size="sm" @click="showKeyboard('plate')">车牌号键盘</lk-button>
      </view>
    </demo-block>

    <demo-block title="键盘主题">
      <view class="desc">支持浅色和深色主题。</view>
      <view class="row">
        <lk-button size="sm" @click="showKeyboard('number', { theme: 'light' })"
          >浅色主题</lk-button
        >
        <lk-button size="sm" @click="showKeyboard('number', { theme: 'dark' })">深色主题</lk-button>
      </view>
    </demo-block>

    <demo-block title="带标题">
      <view class="desc">可以显示标题栏和操作按钮。</view>
      <view class="row">
        <lk-button size="sm" @click="showKeyboard('number', { title: '输入金额' })"
          >带标题</lk-button
        >
        <lk-button
          size="sm"
          @click="showKeyboard('number', { title: '输入密码', showClose: false })"
          >隐藏关闭</lk-button
        >
      </view>
    </demo-block>

    <demo-block title="限制输入长度">
      <view class="desc">可以限制最大输入长度。</view>
      <view class="row">
        <lk-button size="sm" @click="showKeyboard('number', { maxLength: 6 })">最多6位</lk-button>
        <lk-button size="sm" @click="showKeyboard('idcard', { maxLength: 18 })"
          >身份证18位</lk-button
        >
      </view>
    </demo-block>

    <view class="tips">
      <lk-icon name="info-circle" size="28" color="var(--lk-color-primary)" />
      <text>提示：键盘采用苹果风格设计，支持毛玻璃效果和触感反馈。</text>
    </view>

    <!-- 键盘组件 -->
    <lk-keyboard
      v-model:visible="keyboardVisible"
      v-model="inputValue"
      :type="keyboardType"
      :theme="keyboardTheme"
      :title="keyboardTitle"
      :show-dot="keyboardShowDot"
      :random="keyboardRandom"
      :max-length="keyboardMaxLength"
      :show-close="keyboardShowClose"
      @input="onInput"
      @delete="onDelete"
      @confirm="onConfirm"
      @close="onClose"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkKeyboard from '@/uni_modules/lucky-ui/components/lk-keyboard/lk-keyboard.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import type {
  KeyboardType,
  KeyboardTheme,
} from '@/uni_modules/lucky-ui/components/lk-keyboard/keyboard.props';

const inputValue = ref('');
const keyboardVisible = ref(false);
const keyboardType = ref<KeyboardType>('number');
const keyboardTheme = ref<KeyboardTheme>('light');
const keyboardTitle = ref('');
const keyboardShowDot = ref(false);
const keyboardRandom = ref(false);
const keyboardMaxLength = ref(0);
const keyboardShowClose = ref(true);

interface KeyboardOptions {
  theme?: KeyboardTheme;
  title?: string;
  showDot?: boolean;
  random?: boolean;
  maxLength?: number;
  showClose?: boolean;
}

function showKeyboard(type: KeyboardType, options: KeyboardOptions = {}) {
  keyboardType.value = type;
  keyboardTheme.value = options.theme || 'light';
  keyboardTitle.value = options.title || '';
  keyboardShowDot.value = options.showDot || false;
  keyboardRandom.value = options.random || false;
  keyboardMaxLength.value = options.maxLength || 0;
  keyboardShowClose.value = options.showClose !== false;
  keyboardVisible.value = true;
}

function showNumberKeyboard() {
  showKeyboard('number');
}

function onInput(key: string) {
  console.log('输入:', key);
}

function onDelete() {
  console.log('删除');
}

function onConfirm(value: string) {
  console.log('确认:', value);
  uni.showToast({
    title: `输入完成: ${value}`,
    icon: 'none',
  });
}

function onClose() {
  console.log('关闭');
}
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 400rpx;
}

.input-display {
  background: var(--lk-color-bg-elevated);
  border-radius: var(--lk-radius-lg);
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.input-label {
  font-size: var(--lk-font-size-sm);
  color: var(--lk-color-text-secondary);
  margin-bottom: 12rpx;
}

.input-value {
  font-size: 48rpx;
  font-weight: 600;
  color: var(--lk-color-text);
  min-height: 64rpx;
  line-height: 64rpx;
  word-break: break-all;

  &.is-placeholder {
    color: var(--lk-color-text-tertiary);
    font-weight: 400;
    font-size: var(--lk-font-size-lg);
  }
}

.desc {
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
  margin-bottom: 16rpx;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tips {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 24rpx;
  background: var(--lk-color-fill-secondary);
  border-radius: var(--lk-radius-lg);
  font-size: 24rpx;
  color: var(--lk-color-text-secondary);
  line-height: 1.6;
}
</style>
