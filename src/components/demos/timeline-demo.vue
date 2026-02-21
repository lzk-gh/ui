<script setup lang="ts">
import LkTimeline from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline.vue';
import LkTimelineItem from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline-item.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
</script>

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
    <demo-block title="隐藏时间轴 + 激活态">
      <lk-timeline :show-line="false" :show-time="false">
        <lk-timeline-item title="需求确认" desc="梳理范围" />
        <lk-timeline-item title="开发进行中" desc="接口联调" :active="true" />
        <lk-timeline-item title="测试验收" desc="回归测试" />
      </lk-timeline>
    </demo-block>
    <demo-block title="激活索引（active-index）">
      <lk-timeline :active-index="1">
        <lk-timeline-item index="0" title="需求确认" desc="梳理范围" time="09:00" />
        <lk-timeline-item index="1" title="开发进行中" desc="接口联调" time="10:00" />
        <lk-timeline-item index="2" title="测试验收" desc="回归测试" time="11:00" />
      </lk-timeline>
    </demo-block>
  </view>
</template>
<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
