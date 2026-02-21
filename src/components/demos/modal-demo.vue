<script setup lang="ts">
import { ref } from 'vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const visible1 = ref(false);
const visible2 = ref(false);
const visible3 = ref(false);
const visible4 = ref(false);
const visibleScale = ref(false);
const visibleBounce = ref(false);
const visibleNoHeader = ref(false);
const visibleLong = ref(false);
const visibleDynamic = ref(false);

// 动态参数
const dynamicType = ref('zoom-in');
const dynamicDuration = ref(400);
const dynamicEasing = ref('ease-out');

const handleConfirm = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      uni.showToast({ title: '删除成功' });
      resolve(true);
    }, 1000);
  });
};
</script>

<template>
  <view class="component-demo">
    <demo-block title="预设动画">
      <view class="demo-row">
        <lk-button @click="visible1 = true">缩放弹出（scale）</lk-button>
        <lk-modal v-model="visible1" animation="scale" title="Scale"> 我是缩放进来的！ </lk-modal>

        <lk-button @click="visible2 = true">弹跳（bounce）</lk-button>
        <lk-modal v-model="visible2" animation="bounce" title="Bounce"> 弹弹弹～ </lk-modal>

        <lk-button @click="visible3 = true">从下方滑入</lk-button>
        <lk-modal
          v-model="visible3"
          animation-type="slide-up"
          :duration="400"
          easing="ease-out-back"
          title="Slide Up"
        >
          我从下面飞上来！
        </lk-modal>
      </view>
    </demo-block>

    <demo-block title="异步确认">
      <view class="demo-row">
        <lk-button @click="visible4 = true">异步确认</lk-button>
        <lk-modal v-model="visible4" animation="quick" @confirm="handleConfirm"
          >确定删除吗？</lk-modal
        >
      </view>
    </demo-block>

    <demo-block title="更多预设与形态">
      <view class="demo-row">
        <lk-button @click="visibleScale = true">缩放 (scale 预设)</lk-button>
        <lk-modal v-model="visibleScale" animation="scale" title="Scale 预设">
          <text>使用 animation="scale"，来自预设映射。</text>
        </lk-modal>

        <lk-button @click="visibleBounce = true">弹跳 (bounce 预设)</lk-button>
        <lk-modal v-model="visibleBounce" animation="bounce" title="Bounce 预设">
          <text>使用 animation="bounce"，强调进入动势。</text>
        </lk-modal>

        <lk-button @click="visibleNoHeader = true">无头无脚 (纯内容)</lk-button>
        <lk-modal
          v-model="visibleNoHeader"
          :show-header="false"
          :show-footer="false"
          animation-type="zoom-in"
        >
          <view style="padding: 24rpx">
            <text>一个没有 header / footer 的轻量弹窗。</text>
          </view>
        </lk-modal>
      </view>
    </demo-block>

    <demo-block title="长内容滚动">
      <view class="demo-row">
        <lk-button @click="visibleLong = true">长内容滚动</lk-button>
        <lk-modal v-model="visibleLong" title="长内容" animation-type="fade-up" :duration="500">
          <view style="max-height: 400rpx; overflow-y: auto; padding-right: 12rpx">
            <text v-for="i in 30" :key="i" style="display: block; margin-bottom: 12rpx"
              >第 {{ i }} 行示例内容，滚动测试。</text
            >
          </view>
        </lk-modal>
      </view>
    </demo-block>

    <demo-block title="动态修改动画参数">
      <view class="demo-row">
        <lk-button @click="visibleDynamic = true">动态修改动画参数</lk-button>
        <lk-modal
          v-model="visibleDynamic"
          title="动态参数"
          :animation-type="dynamicType"
          :duration="dynamicDuration"
          :easing="dynamicEasing"
        >
          <view style="display: flex; flex-direction: column; gap: 16rpx; padding: 16rpx">
            <text
              >当前动画: {{ dynamicType }} 时长: {{ dynamicDuration }}ms 缓动:
              {{ dynamicEasing }}</text
            >
            <view style="display: flex; flex-wrap: wrap; gap: 12rpx">
              <lk-button size="sm" @click="dynamicType = 'zoom-in'">zoom-in</lk-button>
              <lk-button size="sm" @click="dynamicType = 'slide-up'">slide-up</lk-button>
              <lk-button size="sm" @click="dynamicType = 'fade-up'">fade-up</lk-button>
              <lk-button size="sm" @click="dynamicType = 'bounce-in'">bounce-in</lk-button>
            </view>
            <lk-slider v-model="dynamicDuration" :min="100" :max="1000" :step="100" />
            <lk-segmented
              v-model="dynamicEasing"
              :options="['ease', 'ease-out', 'ease-in', 'ease-in-out', 'ease-out-back']"
            />
          </view>
        </lk-modal>
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
.demo-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
}
</style>
