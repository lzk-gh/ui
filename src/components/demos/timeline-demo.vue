<template>
  <view class="component-demo">
    <demo-block title="Apple 风格时间轴">
      <lk-timeline :item-gap="36">
        <lk-timeline-item
          time="09:00"
          end-time="10:30"
          title="Design Review"
          subtitle="Studio A · 3F"
          desc="讨论近期产品视觉方向与组件一致性。"
          tag="Today"
          location="Room 302"
          person="Sarah Johnson"
          accent="#5a7bff"
        />
        <lk-timeline-item
          time="11:00"
          end-time="12:00"
          title="iOS Motion Spec"
          subtitle="Remote"
          desc="对齐动效节奏与过渡细节，输出交互规范。"
          location="Online Meeting"
          person="James Miller"
          accent="#6ccf99"
        />
        <lk-timeline-item
          time="14:30"
          end-time="15:10"
          title="Design QA"
          subtitle="Prototype"
          desc="校验新版本 UI 与交互一致性。"
          tag="Review"
          location="Room 508"
          person="Wei Chen"
          accent="#f3b34b"
        />
      </lk-timeline>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import LkTimeline from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline.vue';
import LkTimelineItem from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline-item.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
