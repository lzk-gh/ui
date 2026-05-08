<script setup lang="ts">
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkEmpty from '@/uni_modules/lucky-ui/components/lk-empty/lk-empty.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const customImage =
  'https://cdn.prod.website-files.com/69b15b68fb5a0ea0e6ef48b6/69b15b68fb5a0ea0e6ef7572_9VPIJG783rBG_-H7bascPpZIfWM-B0Lq-ZgHgpeiDrA.svg';

function handleRetry() {
  uni.showToast({
    title: '重新加载',
    icon: 'none',
  });
}
</script>

<template>
  <view class="component-demo">
    <demo-block title="基础空态">
      <lk-empty />
    </demo-block>

    <demo-block title="搜索无结果">
      <lk-empty name="search" title="没有匹配内容" description="调整筛选条件后重新搜索" />
    </demo-block>

    <demo-block title="网络异常">
      <lk-empty name="network">
        <template #action>
          <lk-button size="sm" @click="handleRetry">重试</lk-button>
        </template>
      </lk-empty>
    </demo-block>

    <demo-block title="自定义图片">
      <lk-empty
        name="cart"
        :image="customImage"
        title="门店暂未营业"
        description="自定义图片地址会优先于内置 name"
      />
    </demo-block>

    <demo-block title="紧凑布局">
      <lk-empty name="inbox" layout="compact" :image-size="160" />
    </demo-block>

    <demo-block title="跟随品牌色">
      <view class="brand-row">
        <lk-empty name="favorite" layout="compact" :image-size="150" title="品牌色" description="默认跟随当前品牌色" />
        <lk-empty
          name="favorite"
          layout="compact"
          :image-size="150"
          color="#13c2c2"
          title="自定义色"
          description="color 可覆盖品牌色"
        />
      </view>
    </demo-block>

    <demo-block title="页面级空态">
      <view class="page-panel">
        <lk-empty name="permission" layout="page" title="需要授权" description="授权后即可查看完整数据">
          <template #action>
            <lk-button size="sm" variant="soft">稍后再说</lk-button>
            <lk-button size="sm" @click="handleRetry">去授权</lk-button>
          </template>
        </lk-empty>
      </view>
    </demo-block>
  </view>
</template>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.page-panel {
  min-height: 560rpx;
  background: var(--lk-bg-page);
  border-radius: var(--lk-radius-lg);
  overflow: hidden;
}

.brand-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
</style>
