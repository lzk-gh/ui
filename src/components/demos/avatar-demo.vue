<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <view class="demo-row">
        <lk-avatar text="A" />
        <lk-avatar text="用" />
        <lk-avatar text="Lucky" />
        <lk-avatar text="UI" />
      </view>
    </demo-block>

    <demo-block title="头像形状">
      <view class="demo-row">
        <lk-avatar text="圆形" shape="circle" />
        <lk-avatar text="圆角" shape="rounded" />
        <lk-avatar text="方形" shape="square" />
      </view>
    </demo-block>

    <demo-block title="头像尺寸">
      <view class="demo-row" style="align-items: flex-end">
        <lk-avatar text="S" size="48" />
        <lk-avatar text="M" size="64" />
        <lk-avatar text="L" size="88" />
        <lk-avatar text="XL" size="112" />
      </view>
    </demo-block>

    <demo-block title="自定义颜色">
      <view class="demo-row">
        <lk-avatar text="默" />
        <lk-avatar text="主" color="var(--lk-color-primary)" />
        <lk-avatar text="成" color="var(--lk-color-success)" />
        <lk-avatar text="警" color="var(--lk-color-warning)" />
      </view>
    </demo-block>

    <demo-block title="带图标">
      <view class="demo-row">
        <lk-avatar>
          <lk-icon name="house" size="32" />
        </lk-avatar>
        <lk-avatar>
          <lk-icon name="upload" size="32" />
        </lk-avatar>
        <lk-avatar shape="square">
          <lk-icon name="house" size="32" />
        </lk-avatar>
      </view>
    </demo-block>

    <demo-block title="带徽章">
      <view class="demo-row">
        <lk-badge dot type="danger">
          <lk-avatar text="A" />
        </lk-badge>
        <lk-badge :value="8" type="danger">
          <lk-avatar text="B" />
        </lk-badge>
        <lk-badge :value="'VIP'" type="warning">
          <lk-avatar text="C" />
        </lk-badge>
      </view>
    </demo-block>

    <demo-block title="带图片">
      <view class="demo-row">
        <lk-avatar src="https://picsum.photos/800/600?random=12" size="64" />
        <lk-avatar src="https://picsum.photos/800/600?random=13" size="64" />
        <lk-avatar src="https://picsum.photos/800/600?random=14" size="64" />
        <lk-avatar src="https://picsum.photos/800/600?random=15" size="64" />
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkBadge from '@/uni_modules/lucky-ui/components/lk-badge/lk-badge.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.demo-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
}
</style>
