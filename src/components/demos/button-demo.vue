<template>
  <view class="component-demo">
    <!-- Button 按钮演示 -->
    <demo-block title="基础按钮">
      <view class="demo-row">
        <lk-button @click="showToast('默认按钮')">默认按钮</lk-button>
        <lk-button>常规按钮</lk-button>
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
        <lk-button :loading="true">持续加载</lk-button>
      </view>
    </demo-block>

    <demo-block title="按钮尺寸">
      <view class="demo-row">
        <lk-button size="medium">中等按钮</lk-button>
        <lk-button size="large">大型按钮</lk-button>
      </view>
      <lk-button size="large" block style="margin-top: 16rpx;">块级按钮</lk-button>
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
        <lk-button>
          <lk-icon name="search" class="mr-8" />搜索
        </lk-button>
        <lk-button>
          <lk-icon name="download" class="mr-8" />下载
        </lk-button>
        <lk-button>
          <lk-icon name="upload" class="mr-8" />上传
        </lk-button>
      </view>
    </demo-block>

    <demo-block title="圆形按钮">
      <view class="demo-row">
        <lk-button shape="circle">
          <lk-icon name="heart-fill" />
        </lk-button>
        <lk-button shape="circle">
          <lk-icon name="star-fill" />
        </lk-button>
        <lk-button shape="circle">
          <lk-icon name="bell-fill" />
        </lk-button>
        <lk-button shape="circle">
          <lk-icon name="gear-fill" />
        </lk-button>
      </view>
    </demo-block>

    <demo-block title="渐变按钮">
      <view class="demo-row">
        <lk-button class="gradient-btn gradient-purple">紫色</lk-button>
        <lk-button class="gradient-btn gradient-pink">粉色</lk-button>
        <lk-button class="gradient-btn gradient-blue">蓝色</lk-button>
      </view>
    </demo-block>

    <demo-block title="触摸反馈">
      <view class="demo-row">
        <lk-button class="touch-feedback">
          <lk-icon name="hand-index-thumb" class="mr-8" />长按试试
        </lk-button>
        <lk-button class="ripple-btn">
          <lk-icon name="water" class="mr-8" />涟漪效果
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
    duration: 2000
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

.button-group {
  display: flex;
  gap: 0;
  
  :deep(.lk-button) {
    border-radius: 0;
    
    &:first-child {
      border-top-left-radius: var(--lk-radius-md);
      border-bottom-left-radius: var(--lk-radius-md);
    }
    
    &:last-child {
      border-top-right-radius: var(--lk-radius-md);
      border-bottom-right-radius: var(--lk-radius-md);
    }
  }
}

.gradient-btn {
  border: none;
  color: #fff;
  
  &.gradient-purple {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  &.gradient-pink {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  
  &.gradient-blue {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  
  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.touch-feedback {
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.15);
  }
}

.ripple-btn {
  position: relative;
  overflow: hidden;
  
  &:active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transform: translate(-50%, -50%);
    animation: ripple 0.6s ease-out;
  }
}

@keyframes ripple {
  to {
    width: 200%;
    height: 200%;
    opacity: 0;
  }
}
</style>
