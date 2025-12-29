<template>
  <view class="component-demo">
    <!-- Button 按钮演示 -->
    <demo-block title="基础按钮">
      <view class="demo-row">
        <lk-button @click="showToast('默认按钮')">默认按钮</lk-button>
      </view>
    </demo-block>

    <demo-block title="文本按钮">
      <view class="demo-row">
        <lk-button variant="text">文本按钮</lk-button>
        <lk-button variant="text" @click="showToast('点击成功')">可点击</lk-button>
        <lk-button variant="text" :disabled="true">禁用文本</lk-button>
      </view>
    </demo-block>

    <demo-block title="按钮状态">
      <view class="demo-row">
        <lk-button :disabled="true">禁用按钮</lk-button>
        <lk-button :loading="buttonLoading" @click="triggerLoading">
          {{ buttonLoading ? '加载中...' : '点击加载' }}
        </lk-button>
      </view>
    </demo-block>

    <demo-block title="按钮尺寸">
      <view class="demo-row">
        <lk-button size="sm">小按钮</lk-button>
        <lk-button size="md">中等按钮</lk-button>
        <lk-button size="lg">大型按钮</lk-button>
      </view>
      <lk-button size="lg" block shape="round" style="margin-top: 16rpx">块级胶囊按钮</lk-button>
    </demo-block>

    <demo-block title="按钮形状">
      <view class="demo-row">
        <lk-button shape="default">默认</lk-button>
        <lk-button shape="square">方形</lk-button>
        <lk-button shape="round">胶囊</lk-button>
      </view>
    </demo-block>

    <demo-block title="图标按钮">
      <view class="demo-row">
        <lk-button> <lk-icon name="search" class="mr-8" />搜索 </lk-button>
        <lk-button> <lk-icon name="download" class="mr-8" />下载 </lk-button>
        <lk-button> <lk-icon name="upload" class="mr-8" />上传 </lk-button>
      </view>
    </demo-block>

    <demo-block title="圆形按钮">
      <view class="demo-row">
        <lk-button shape="circle">
          <lk-icon name="heart" />
        </lk-button>
        <lk-button shape="circle">
          <lk-icon name="star" />
        </lk-button>
        <lk-button shape="circle">
          <lk-icon name="bell" />
        </lk-button>
        <lk-button shape="circle">
          <lk-icon name="gear" />
        </lk-button>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const buttonLoading = ref(false);

const showToast = (message: string) => {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000,
  });
};

const triggerLoading = () => {
  buttonLoading.value = true;
  setTimeout(() => {
    buttonLoading.value = false;
    showToast('加载完成');
  }, 2000);
};
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

.mr-8 {
  margin-right: 8rpx;
}
</style>
