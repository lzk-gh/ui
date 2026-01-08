<template>
  <scroll-view class="mine-page" :style="{ height: contentHeight }" scroll-y>

    <lk-space direction="vertical" :gap="24" fill>
    <lk-notice-bar text="欢迎使用 Lucky UI，点击头像可以修改个人资料哦！" scrollable :no-background="true" />
      <!-- 头部用户信息 -->
        <lk-cell clickable arrow @click="handleUserClick">
          <template #title>
            <lk-space align="center" :gap="24" fill>
              <lk-badge :value="2" :offset="[-6, 6]">
                <lk-avatar
                  src="https://picsum.photos/200/200"
                  size="120"
                  shape="circle"
                />
              </lk-badge>
              <lk-space direction="vertical" :gap="8" fill>
                <text style="font-size: 36rpx; font-weight: bold;">Lucky User</text>
                <lk-space :gap="8">
                  <lk-tag type="light" size="sm" bg-color="var(--lk-color-primary-bg-soft)" text-color="var(--lk-color-primary)">V3 会员</lk-tag>
                  <lk-tag type="light" size="sm" bg-color="var(--lk-color-success-bg-soft)" text-color="var(--lk-color-success)">已认证</lk-tag>
                </lk-space>
                <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">探索 Lucky UI 的无限可能</text>
              </lk-space>
            </lk-space>
          </template>
        </lk-cell>

        <lk-grid :columns="4">
          <lk-space direction="vertical" align="center" :gap="4">
            <text style="font-size: 32rpx; font-weight: bold;">128</text>
            <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">收藏</text>
          </lk-space>
          <lk-space direction="vertical" align="center" :gap="4">
            <text style="font-size: 32rpx; font-weight: bold;">356</text>
            <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">关注</text>
          </lk-space>
          <lk-space direction="vertical" align="center" :gap="4">
            <text style="font-size: 32rpx; font-weight: bold;">1,204</text>
            <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">积分</text>
          </lk-space>
          <lk-space direction="vertical" align="center" :gap="4">
            <text style="font-size: 32rpx; font-weight: bold;">12</text>
            <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">优惠券</text>
          </lk-space>
        </lk-grid>

      <!-- 常用菜单 -->
      <lk-cell-group title="常用功能">
        <lk-cell title="消息通知" icon="calendar" value="2 条未读" clickable arrow />
        <lk-cell title="我的待办" icon="calendar" value="3 条待办" clickable arrow @click="goToTodo" />
        <lk-cell title="我的订单" icon="calendar" clickable arrow @click="goToOrderDetail" />
        <lk-cell title="浏览历史" icon="calendar" clickable arrow />
        <lk-cell title="切换主题" icon="calendar" clickable arrow @click="showThemeSheet = true" />
      </lk-cell-group>

      <lk-cell-group title="其他">
        <lk-cell title="帮助中心" icon="question" clickable arrow />
        <lk-cell title="关于我们" icon="info" value="v1.0.0" clickable arrow />
        <lk-cell title="分享给朋友" icon="share" clickable arrow />
      </lk-cell-group>

      <!-- 退出按钮 -->
      <lk-button block type="danger" plain @click="showLogoutModal = true">退出登录</lk-button>

      <lk-divider text="Lucky UI 提供技术支持" />
    </lk-space>

    <!-- 反馈组件 -->
    <lk-modal v-model="showLogoutModal" title="提示">
      <lk-space direction="vertical" :gap="12" fill>
        <text>确定要退出登录吗？</text>
      </lk-space>
      <template #footer>
        <lk-space justify="end" :gap="12" fill>
          <lk-button size="sm" variant="outline" @click="showLogoutModal = false">取消</lk-button>
          <lk-button size="sm" variant="solid" @click="handleLogoutConfirm">退出</lk-button>
        </lk-space>
      </template>
    </lk-modal>

    <lk-action-sheet
      v-model="showThemeSheet"
      :actions="themeActions"
      title="选择主题"
      @select="handleThemeSelect"
    />

    <lk-backtop />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import LkGrid from '@/uni_modules/lucky-ui/components/lk-grid/lk-grid.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';
import LkBadge from '@/uni_modules/lucky-ui/components/lk-badge/lk-badge.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkSpace from '@/uni_modules/lucky-ui/components/lk-space/lk-space.vue';
import LkDivider from '@/uni_modules/lucky-ui/components/lk-divider/lk-divider.vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkNoticeBar from '@/uni_modules/lucky-ui/components/lk-notice-bar/lk-notice-bar.vue';
import LkBacktop from '@/uni_modules/lucky-ui/components/lk-backtop/lk-backtop.vue';
import LkModal from '@/uni_modules/lucky-ui/components/lk-modal/lk-modal.vue';
import LkActionSheet from '@/uni_modules/lucky-ui/components/lk-action-sheet/lk-action-sheet.vue';
import type { Action } from '@/uni_modules/lucky-ui/components/lk-action-sheet/action-sheet.props';

defineProps<{ contentHeight: string }>();

const showLogoutModal = ref(false);
const showThemeSheet = ref(false);

const themeActions = [
  { name: '默认蓝', color: '#409eff' },
  { name: '活力绿', color: '#67c23a' },
  { name: '热情红', color: '#f56c6c' },
  { name: '深邃黑', color: '#303133' },
];

const handleUserClick = () => {
  uni.showToast({ title: '点击了用户信息', icon: 'none' });
};

const goToOrderDetail = () => {
  uni.navigateTo({
    url: '/pages/order-detail/index'
  });
};

const goToTodo = () => {
  uni.navigateTo({
    url: '/pages/todo/index'
  });
};

const handleLogoutConfirm = () => {
  uni.showToast({ title: '退出成功', icon: 'none' });
};

const handleThemeSelect = (payload: { action: Action; index: number }) => {
  uni.showToast({ title: `已切换至 ${payload.action.name}`, icon: 'none' });
};
</script>
