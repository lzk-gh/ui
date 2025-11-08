<template>
  <scroll-view class="feedback-page" :style="{ height: contentHeight }" scroll-y>
    <!-- 渐变头部 -->
    <view class="page-header">
      <lk-icon name="chat-square-dots-fill" size="80" color="#fff" />
      <text class="header-title">反馈组件</text>
      <text class="header-desc">8 个常用反馈组件</text>
    </view>

    <!-- 组件列表 -->
    <view class="component-list">
      <lk-cell-group>
        <lk-cell
          v-for="comp in components"
          :key="comp.name"
          :title="comp.title"
          :label="comp.desc"
          is-link
          @click="navigateToDetail(comp.name)"
        >
          <template #icon>
            <view class="cell-icon">
              <lk-icon :name="comp.icon" size="40" color="danger" />
            </view>
          </template>
        </lk-cell>
      </lk-cell-group>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkCellGroup from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell-group.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';

defineProps<{
  contentHeight: string;
}>();

const components = [
  {
    name: 'modal',
    title: 'Modal 对话框',
    desc: '模态对话框组件',
    icon: 'window',
  },
  {
    name: 'popup',
    title: 'Popup 弹出层',
    desc: '从底部/顶部弹出',
    icon: 'window-stack',
  },
  {
    name: 'toast',
    title: 'Toast 轻提示',
    desc: '轻量级消息提示',
    icon: 'chat-right-text',
  },
  {
    name: 'action-sheet',
    title: 'ActionSheet 动作面板',
    desc: '底部动作选择菜单',
    icon: 'list-task',
  },
  {
    name: 'drawer',
    title: 'Drawer 抽屉',
    desc: '侧边滑出的面板',
    icon: 'layout-sidebar',
  },
  {
    name: 'overlay',
    title: 'Overlay 遮罩',
    desc: '创建一层遮罩',
    icon: 'bounding-box',
  },
  {
    name: 'tooltip',
    title: 'Tooltip 气泡提示',
    desc: '简单的文字提示气泡',
    icon: 'chat-square-quote',
  },
  {
    name: 'dropdown',
    title: 'Dropdown 下拉菜单',
    desc: '向下弹出的菜单',
    icon: 'caret-down-square-fill',
  },
];

const navigateToDetail = (componentName: string) => {
  uni.navigateTo({
    url: `/pages/component-detail/index?name=${componentName}`,
  });
};
</script>

<style scoped lang="scss">
.feedback-page {
  width: 100%;
  background: var(--lk-color-bg-page);
}

.page-header {
  background: linear-gradient(135deg, var(--lk-color-danger) 0%, var(--lk-color-danger-hover) 100%);
  padding: 64rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.header-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.component-list {
  padding: 0 24rpx 24rpx;
}

.cell-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lk-color-danger-bg-soft);
  border-radius: var(--lk-radius-md);
  margin-right: 24rpx;
}
</style>
