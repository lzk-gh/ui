<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-timeline>
        <lk-timeline-item>创建项目</lk-timeline-item>
        <lk-timeline-item>代码开发</lk-timeline-item>
        <lk-timeline-item>测试上线</lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="不同颜色">
      <lk-timeline>
        <lk-timeline-item color="primary">项目启动</lk-timeline-item>
        <lk-timeline-item color="success">开发完成</lk-timeline-item>
        <lk-timeline-item color="warning">测试中</lk-timeline-item>
        <lk-timeline-item color="danger">待修复</lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="自定义节点">
      <lk-timeline>
        <lk-timeline-item>
          <template #dot>
            <lk-icon name="check-circle-fill" color="success" size="32" />
          </template>
          <text>已完成</text>
        </lk-timeline-item>
        <lk-timeline-item>
          <template #dot>
            <lk-icon name="clock-fill" color="warning" size="32" />
          </template>
          <text>进行中</text>
        </lk-timeline-item>
        <lk-timeline-item>
          <template #dot>
            <lk-icon name="circle" color="textSecondary" size="32" />
          </template>
          <text>未开始</text>
        </lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="时间轴">
      <lk-timeline>
        <lk-timeline-item timestamp="2024-01-15 10:00">用户注册</lk-timeline-item>
        <lk-timeline-item timestamp="2024-01-15 10:30">完善信息</lk-timeline-item>
        <lk-timeline-item timestamp="2024-01-15 11:00">开始使用</lk-timeline-item>
      </lk-timeline>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkTimeline from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline.vue';
import LkTimelineItem from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline-item.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
