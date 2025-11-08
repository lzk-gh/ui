<template>
  <view class="component-demo">
    <demo-block title="基础用法（竖向，实线）">
      <lk-timeline>
        <lk-timeline-item title="创建项目">
          <view
            class="lk-timeline-item__content"
            hover-class="none"
            hover-stop-propagation="false"
          >
            项目立项，需求评审与任务分配
          </view>
          <view
            class="lk-timeline-item__extra"
            hover-class="none"
            hover-stop-propagation="false"
          >
            2024-01-10
          </view>
        </lk-timeline-item>
        <lk-timeline-item title="代码开发">实现核心功能与联调</lk-timeline-item>
        <lk-timeline-item title="测试上线">完成测试与发布上线</lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="线条样式（虚线/实线，端点 flush/equal）">
      <lk-timeline dashed line-cap="flush" :line-width="6" item-gap="32rpx">
        <lk-timeline-item title="需求确定">进入开发</lk-timeline-item>
        <lk-timeline-item title="开发中">联调</lk-timeline-item>
        <lk-timeline-item title="测试">回归测试</lk-timeline-item>
      </lk-timeline>
      <view style="height: 16rpx"></view>
      <lk-timeline :dashed="false" line-cap="equal" :line-width="6" item-gap="32rpx">
        <lk-timeline-item title="版本冻结">准备发布</lk-timeline-item>
        <lk-timeline-item title="发布">上线监控</lk-timeline-item>
        <lk-timeline-item title="运维">巡检与告警处理</lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="自定义节点（dot/icon 插槽）">
      <lk-timeline dashed :line-width="6" item-gap="32rpx">
        <lk-timeline-item title="已完成">
          <template #dot>
            <lk-icon name="check-circle-fill" color="success" :size="32" />
          </template>
          全量用例通过
        </lk-timeline-item>
        <lk-timeline-item title="进行中">
          <template #dot>
            <lk-icon name="clock-fill" color="warning" :size="32" />
          </template>
          冒烟测试中
        </lk-timeline-item>
        <lk-timeline-item title="未开始">
          <template #dot>
            <lk-icon name="circle" color="textSecondary" :size="32" />
          </template>
          预研阶段
        </lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="时间轴（time 与插槽 + 左侧插槽）">
      <lk-timeline>
        <lk-timeline-item time="2024-01-15 10:00">
          <template #left>
            <text style="color: var(--lk-color-text-secondary); font-size: 22rpx"
              >UTC+8</text
            >
          </template>
          用户注册
        </lk-timeline-item>
        <lk-timeline-item>
          <template #time>2024-01-15 10:30</template>
          完善信息
        </lk-timeline-item>
        <lk-timeline-item time="2024-01-15 11:00">开始使用</lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="横向（horizontal）">
      <lk-timeline direction="horizontal" :item-gap="64" :line-width="6">
        <lk-timeline-item title="立项" />
        <lk-timeline-item title="开发" />
        <lk-timeline-item title="测试" />
        <lk-timeline-item title="发布" />
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
