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

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const addLog = (type: LogItem['type'], message: string) => {
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
};

const updateStats = () => {
  stats.value = manager.getStats();
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const togglePause = () => {
  if (isPaused.value) {
    manager.resume();
    addLog('info', '队列已恢复');
  } else {
    manager.pause();
    addLog('info', '队列已暂停');
  }
  isPaused.value = !isPaused.value;
};

const handleClear = () => {
  manager.clear();
  addLog('info', '队列已清空');
  updateStats();
};

// 事件处理器
const handleTaskStart: PreloadEventHandler = event => {
  addLog('start', `开始: ${event.task?.resource || 'unknown'}`);
  updateStats();
};

const handleTaskComplete: PreloadEventHandler = event => {
  addLog('complete', `完成: ${event.task?.resource || 'unknown'}`);
  updateStats();
};

const handleTaskError: PreloadEventHandler = event => {
  addLog('error', `失败: ${event.task?.resource || 'unknown'} - ${event.error?.message || ''}`);
  updateStats();
};

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

<style lang="scss" scoped>
.lk-preload-debugger {
  position: fixed;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 16rpx;
  color: #fff;
  font-size: 24rpx;
  min-width: 280rpx;
  max-width: 600rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);

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
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
      background: #10b981;
      animation: pulse 1.5s infinite;
    }

    &--pending {
      background: #f59e0b;
    }

    &--idle {
      background: #6b7280;
    }
  }

  &__body {
    padding: 16rpx;
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-bottom: 16rpx;

    .stat-item {
      flex: 1;
      min-width: 80rpx;
      text-align: center;
      padding: 12rpx 8rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8rpx;

      &--running {
        background: rgba(16, 185, 129, 0.2);
      }

      &--pending {
        background: rgba(245, 158, 11, 0.2);
      }

      &--completed {
        background: rgba(59, 130, 246, 0.2);
      }

      &--failed {
        background: rgba(239, 68, 68, 0.2);
      }
    }

    .stat-label {
      display: block;
      font-size: 20rpx;
      color: rgba(255, 255, 255, 0.6);
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
    gap: 12rpx;
    margin-bottom: 16rpx;

    .action-btn {
      flex: 1;
      text-align: center;
      padding: 12rpx;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 8rpx;
      transition: all 0.2s;

      &:active {
        transform: scale(0.95);
        background: rgba(255, 255, 255, 0.25);
      }

      &--active {
        background: #10b981;
      }

      &--danger {
        background: rgba(239, 68, 68, 0.5);
      }
    }
  }

  &__logs {
    max-height: 300rpx;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8rpx;
    padding: 8rpx;

    .log-item {
      display: flex;
      align-items: flex-start;
      gap: 12rpx;
      padding: 8rpx;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &:last-child {
        border-bottom: none;
      }

      &--start {
        .log-message {
          color: #a78bfa;
        }
      }

      &--complete {
        .log-message {
          color: #34d399;
        }
      }

      &--error {
        .log-message {
          color: #f87171;
        }
      }

      &--info {
        .log-message {
          color: #60a5fa;
        }
      }
    }

    .log-time {
      flex-shrink: 0;
      color: rgba(255, 255, 255, 0.4);
      font-size: 20rpx;
    }

    .log-message {
      flex: 1;
      word-break: break-all;
      font-size: 22rpx;
    }

    .log-empty {
      text-align: center;
      padding: 24rpx;
      color: rgba(255, 255, 255, 0.4);
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
