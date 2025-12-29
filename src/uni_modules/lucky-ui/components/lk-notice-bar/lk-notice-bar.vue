<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { noticeBarProps, type NoticeBarProps } from './notice-bar.props';

defineOptions({ name: 'LkNoticeBar' });

const props = defineProps(noticeBarProps);

const emit = defineEmits(['close', 'click']);

// 计算最终要绑定的样式：当用户希望无背景时，不设置 background 和 color
const styleObj = computed(() => {
  const noBg = props.noBackground;

  // 当为无背景模式时：
  // - 不注入 background 与 color（由父级继承）
  // - 自动移除 padding 与圆角以获得更“扁平”的外观
  if (noBg) {
    return {
      padding: '0',
      borderRadius: '0',
    } as Record<string, string>;
  }

  return {
    background: props.background,
    color: props.color,
  } as Record<string, string>;
});

// 判断滚动方向
const scrollMode = computed(() => {
  if (props.scrollable === false) return 'none';
  if (props.scrollable === true || props.scrollable === 'horizontal') return 'horizontal';
  if (props.scrollable === 'vertical') return 'vertical';
  return 'none';
});

// 显示的消息列表（用于竖向滚动）
const displayMessages = computed(() => {
  if (scrollMode.value === 'vertical') {
    return props.messages.length > 0 ? props.messages : [props.text];
  }
  return [];
});

// 竖向逐条滚动相关状态
const currentIndex = ref(0); // 当前可视的索引
const verticalTimer = ref<number | ReturnType<typeof setInterval> | null>(null);
const enableTransition = ref(true); // 用于无缝重置时临时关闭过渡
const verticalListEl = ref<HTMLElement | null>(null);

// 竖向渲染列表（最后追加第一项以实现无缝滚动）
const verticalList = computed(() => {
  if (displayMessages.value.length === 0) return [] as string[];
  return [...displayMessages.value, displayMessages.value[0]] as string[];
});

function stopVerticalLoop() {
  if (verticalTimer.value) {
    clearInterval(verticalTimer.value as number);
    verticalTimer.value = null;
  }
}

function startVerticalLoop() {
  stopVerticalLoop();
  // 单条不滚动
  if (scrollMode.value !== 'vertical' || displayMessages.value.length <= 1) return;
  const interval = Math.max(0.5, props.speed) * 1000; // 每条停留时长（秒）
  verticalTimer.value = setInterval(() => {
    // 检查是否即将到达补位项（最后一项）
    if (currentIndex.value === displayMessages.value.length - 1) {
      // 先滚动到补位项（视觉上是第一条）
      enableTransition.value = true;
      currentIndex.value += 1;
      // 在过渡完成后立即无缝重置到真正的第一条
      setTimeout(() => {
        enableTransition.value = false;
        currentIndex.value = 0;
        // 强制重绘
        if (verticalListEl.value) {
          void verticalListEl.value.offsetHeight;
        }
        // 立即恢复过渡能力，为下一次步进做准备
        setTimeout(() => {
          enableTransition.value = true;
        }, 20);
      }, 300); // 与过渡时长一致
    } else {
      // 正常步进到下一条
      enableTransition.value = true;
      currentIndex.value += 1;
    }
  }, interval);
}

// 监听相关依赖，切换/更新时重启竖向轮播
watch([scrollMode, () => props.speed, displayMessages], () => {
  currentIndex.value = 0;
  enableTransition.value = true;
  startVerticalLoop();
});

onMounted(() => {
  startVerticalLoop();
});

onBeforeUnmount(() => {
  stopVerticalLoop();
});

function close() {
  emit('close');
}

function click() {
  emit('click');
}
</script>

<template>
  <view class="lk-notice-bar" :style="styleObj" @click="click">
    <view v-if="icon || $slots['left-icon']" class="lk-notice-bar__icon">
      <slot name="left-icon">
        <lk-icon v-if="icon" :name="icon" size="32" />
      </slot>
    </view>

    <view class="lk-notice-bar__wrap">
      <view
        v-if="scrollMode === 'horizontal'"
        class="lk-notice-bar__content lk-notice-bar__content--horizontal"
        :style="{ animationDuration: speed + 's' }"
      >
        <slot>{{ text }}</slot>
      </view>

      <view
        v-else-if="scrollMode === 'vertical'"
        class="lk-notice-bar__content lk-notice-bar__content--vertical"
      >
        <view
          class="lk-notice-bar__vertical-list"
          ref="verticalListEl"
          :style="{
            transform: `translateY(-${verticalList.length ? (currentIndex * 100) / verticalList.length : 0}%)`,
            transition: enableTransition ? 'transform 0.3s ease-in-out' : 'none',
          }"
        >
          <view v-for="(msg, index) in verticalList" :key="index" class="lk-notice-bar__message">
            {{ msg }}
          </view>
        </view>
      </view>

      <view v-else class="lk-notice-bar__content">
        <slot>{{ text }}</slot>
      </view>
    </view>

    <template v-if="$slots.right || $slots['right-icon']">
      <view class="lk-notice-bar__right">
        <slot name="right" />
        <template v-if="!$slots.right">
          <slot name="right-icon" />
        </template>
      </view>
    </template>

    <view v-if="closeable" class="lk-notice-bar__close" @click.stop="close">
      <lk-icon name="x" size="32" />
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
