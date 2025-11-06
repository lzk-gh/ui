<template>
  <scroll-view class="basic-page" :style="{ height: contentHeight }" scroll-y>
    <!-- 渐变头部 -->
    <view class="page-header">
      <lk-icon name="box-seam-fill" size="80" color="#fff" />
      <text class="header-title">基础组件</text>
  <text class="header-desc">10 个常用基础组件</text>
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
              <lk-icon :name="comp.icon" size="40" color="primary" />
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
  { name: 'button', title: 'Button 按钮', desc: '常用的操作按钮', icon: 'app-indicator' },
  { name: 'icon', title: 'Icon 图标', desc: '语义化的矢量图形', icon: 'emoji-smile' },
  { name: 'tag', title: 'Tag 标签', desc: '用于标记和选择', icon: 'tag-fill' },
  { name: 'badge', title: 'Badge 徽标', desc: '展示新消息数量', icon: 'bell-fill' },
  { name: 'avatar', title: 'Avatar 头像', desc: '用户头像展示', icon: 'person-circle' },
  { name: 'divider', title: 'Divider 分割线', desc: '区隔内容的分割线', icon: 'hr' },
  { name: 'notice-bar', title: 'NoticeBar 通知栏', desc: '滚动播放的消息通知', icon: 'megaphone-fill' },
  { name: 'image', title: 'Image 图片', desc: '增强的图片组件', icon: 'image-fill' },
  { name: 'grid', title: 'Grid 栅格', desc: '24 栅格布局', icon: 'grid-3x3-gap' },
  { name: 'space', title: 'Space 间距', desc: '设置子元素间距', icon: 'arrows-expand' }
];

const navigateToDetail = (componentName: string) => {
  uni.navigateTo({
    url: `/pages/component-detail/index?name=${componentName}`
  });
};
</script>

<style scoped lang="scss">
.basic-page {
  width: 100%;
  background: var(--lk-color-bg-page);
}

.page-header {
  background: linear-gradient(135deg, var(--lk-color-primary) 0%, var(--lk-color-primary-hover) 100%);
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
  color: rgba(255,255,255,0.9);
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
  background: var(--lk-color-primary-bg-soft);
  border-radius: var(--lk-radius-md);
  margin-right: 24rpx;
}
</style>
