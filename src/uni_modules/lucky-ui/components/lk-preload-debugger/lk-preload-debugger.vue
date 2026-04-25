<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { preloadDebuggerProps } from './preload-debugger.props';
import {
  getPreloadManager,
  type PreloadStats,
  type PreloadEventHandler,
} from '../../core/src/preload';

const props = defineProps(preloadDebuggerProps);

const manager = getPreloadManager();
const isExpanded = ref(false);
const isPaused = ref(false);
const stats = ref<PreloadStats>({
  total: 0,
  pending: 0,
  running: 0,
  completed: 0,
  failed: 0,
  cancelled: 0,
});

interface LogItem {
  id: string;
  type: 'start' | 'complete' | 'error' | 'info';
  time: string;
  message: string;
}

const logs = ref<LogItem[]>([]);
const lastLogId = ref('');

const positionClass = computed(() => `lk-preload-debugger--${props.position}`);

const statusClass = computed(() => {
  if (stats.value.running > 0) return 'lk-preload-debugger__badge--running';
  if (stats.value.pending > 0) return 'lk-preload-debugger__badge--pending';
  return 'lk-preload-debugger__badge--idle';
});

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function addLog(type: LogItem['type'], message: string) {
  const id = `log_${Date.now()}`;
  logs.value.push({
    id,
    type,
    time: formatTime(new Date()),
    message,
  });

  // 保持最多 50 条日志
  if (logs.value.length > 50) {
    logs.value.shift();
  }

  lastLogId.value = id;
}

function updateStats() {
  stats.value = manager.getStats();
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function togglePause() {
  if (isPaused.value) {
    manager.resume();
    addLog('info', '队列已恢复');
  } else {
    manager.pause();
    addLog('info', '队列已暂停');
  }
  isPaused.value = !isPaused.value;
}

function handleClear() {
  manager.clear();
  addLog('info', '队列已清空');
  updateStats();
}

// 事件处理器
function handleTaskStart(event: Parameters<PreloadEventHandler>[0]) {
  addLog('start', `开始: ${event.task?.resource || 'unknown'}`);
  updateStats();
}

function handleTaskComplete(event: Parameters<PreloadEventHandler>[0]) {
  addLog('complete', `完成: ${event.task?.resource || 'unknown'}`);
  updateStats();
}

function handleTaskError(event: Parameters<PreloadEventHandler>[0]) {
  addLog('error', `失败: ${event.task?.resource || 'unknown'} - ${event.error?.message || ''}`);
  updateStats();
}

onMounted(() => {
  updateStats();

  manager.on('task:start', handleTaskStart);
  manager.on('task:complete', handleTaskComplete);
  manager.on('task:error', handleTaskError);

  addLog('info', '调试面板已启动');
});

onUnmounted(() => {
  manager.off('task:start', handleTaskStart);
  manager.off('task:complete', handleTaskComplete);
  manager.off('task:error', handleTaskError);
});
</script>

<template>
  <view v-if="props.visible" class="lk-preload-debugger" :class="positionClass">
    <view class="lk-preload-debugger__header" @click="toggleExpand">
      <text class="lk-preload-debugger__title">预加载调试</text>
      <view class="lk-preload-debugger__badge" :class="statusClass">
        {{ stats.running > 0 ? '运行中' : stats.pending > 0 ? '等待中' : '空闲' }}
      </view>
    </view>

    <view v-if="isExpanded" class="lk-preload-debugger__body">
      <!-- 统计信息 -->
      <view class="lk-preload-debugger__stats-wrapper">
        <view class="lk-preload-debugger__stats">
          <view class="stat-item">
            <text class="stat-label">总任务</text>
            <text class="stat-value">{{ stats.total }}</text>
          </view>
          <view class="stat-item stat-item--running">
            <text class="stat-label">运行中</text>
            <text class="stat-value">{{ stats.running }}</text>
          </view>
          <view class="stat-item stat-item--pending">
            <text class="stat-label">等待中</text>
            <text class="stat-value">{{ stats.pending }}</text>
          </view>
          <view class="stat-item stat-item--completed">
            <text class="stat-label">已完成</text>
            <text class="stat-value">{{ stats.completed }}</text>
          </view>
          <view class="stat-item stat-item--failed">
            <text class="stat-label">失败</text>
            <text class="stat-value">{{ stats.failed }}</text>
          </view>
        </view>
      </view>

      <!-- 控制按钮 -->
      <view class="lk-preload-debugger__actions">
        <view class="action-btn" :class="{ 'action-btn--active': isPaused }" @click="togglePause">
          {{ isPaused ? '恢复' : '暂停' }}
        </view>
        <view class="action-btn action-btn--danger" @click="handleClear"> 清空 </view>
      </view>

      <!-- 日志列表 -->
      <scroll-view class="lk-preload-debugger__logs" scroll-y :scroll-into-view="lastLogId">
        <view
          v-for="log in logs"
          :id="log.id"
          :key="log.id"
          class="log-item"
          :class="`log-item--${log.type}`"
        >
          <text class="log-time">{{ log.time }}</text>
          <text class="log-message">{{ log.message }}</text>
        </view>
        <view v-if="logs.length === 0" class="log-empty"> 暂无日志 </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.lk-preload-debugger {
  position: fixed;
  z-index: 9999;
  background: var(--lk-preload-debugger-bg);
  border-radius: 16rpx;
  color: var(--lk-preload-debugger-text);
  font-size: 24rpx;
  min-width: 280rpx;
  max-width: 600rpx;
  box-shadow: var(--lk-shadow-lg);

  &--top-left {
    top: calc(env(safe-area-inset-top) + 20rpx);
    left: 20rpx;
  }

  &--top-right {
    top: calc(env(safe-area-inset-top) + 20rpx);
    right: 20rpx;
  }

  &--bottom-left {
    bottom: calc(env(safe-area-inset-bottom) + 140rpx);
    left: 20rpx;
  }

  &--bottom-right {
    bottom: calc(env(safe-area-inset-bottom) + 140rpx);
    right: 20rpx;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 24rpx;
    border-bottom: 1px solid var(--lk-preload-debugger-border);
  }

  &__title {
    font-weight: 600;
    font-size: 26rpx;
  }

  &__badge {
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    font-size: 20rpx;

    &--running {
      background: var(--lk-color-success);
      animation: pulse 1.5s infinite;
    }

    &--pending {
      background: var(--lk-color-warning);
    }

    &--idle {
      background: var(--lk-text-secondary);
    }
  }

  &__body {
    padding: 16rpx;

    & > view:not(:first-child) {
      margin-top: 16rpx;
    }
  }

  &__stats-wrapper {
    width: 100%;
    overflow: hidden;
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    margin: -6rpx;

    .stat-item {
      flex: 1;
      min-width: 80rpx;
      text-align: center;
      padding: 12rpx 8rpx;
      margin: 6rpx;
      background: var(--lk-preload-debugger-item-bg);
      border-radius: 8rpx;
      box-sizing: border-box;

      &--running {
        background: var(--lk-color-success-soft);
      }

      &--pending {
        background: var(--lk-color-warning-soft);
      }

      &--completed {
        background: var(--lk-color-info-soft);
      }

      &--failed {
        background: var(--lk-color-danger-soft);
      }
    }

    .stat-label {
      display: block;
      font-size: 20rpx;
      color: var(--lk-preload-debugger-text-muted);
      margin-bottom: 4rpx;
    }

    .stat-value {
      display: block;
      font-size: 28rpx;
      font-weight: 600;
    }
  }

  &__actions {
    display: flex;
    margin: 0 -6rpx;

    .action-btn {
      flex: 1;
      text-align: center;
      padding: 12rpx;
      margin: 0 6rpx;
      background: var(--lk-preload-debugger-btn-bg);
      border-radius: 8rpx;
      transition: all 0.2s;

      &:active {
        transform: scale(0.95);
        background: var(--lk-preload-debugger-btn-bg-active);
      }

      &--active {
        background: var(--lk-color-success);
      }

      &--danger {
        background: var(--lk-color-danger);
      }
    }
  }

  &__logs {
    max-height: 300rpx;
    background: var(--lk-preload-debugger-log-bg);
    border-radius: 8rpx;
    padding: 8rpx;
    box-sizing: border-box;

    .log-item {
      display: flex;
      align-items: flex-start;
      padding: 8rpx;
      border-bottom: 1px solid var(--lk-preload-debugger-log-border);

      &:last-child {
        border-bottom: none;
      }

      &--start {
        .log-message {
          color: var(--lk-color-primary-soft);
        }
      }

      &--complete {
        .log-message {
          color: var(--lk-color-success);
        }
      }

      &--error {
        .log-message {
          color: var(--lk-color-danger);
        }
      }

      &--info {
        .log-message {
          color: var(--lk-color-info);
        }
      }
    }

    .log-time {
      flex-shrink: 0;
      color: var(--lk-preload-debugger-text-faint);
      font-size: 20rpx;
      margin-right: 12rpx;
    }

    .log-message {
      flex: 1;
      word-break: break-all;
      font-size: 22rpx;
    }

    .log-empty {
      text-align: center;
      padding: 24rpx;
      color: var(--lk-preload-debugger-text-faint);
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
