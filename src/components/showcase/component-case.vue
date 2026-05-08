<script setup lang="ts">
/**
 * 组件展示项。
 * 注意事项：由父组件传入基础信息与演示插槽内容。
 */
defineProps<{
  title: string;
  groupLabel: string;
  verifyStatusLabel: string;
  riskLevelLabel: string;
  verifyStatusType: 'ok' | 'warn';
  riskType: 'low' | 'medium' | 'high';
  riskNotes: string[];
}>();
</script>

<template>
  <view class="component-case">
    <view class="case-header">
      <view class="case-title-row">
        <text class="case-title">{{ title }}</text>
        <text :class="['status-badge', verifyStatusType === 'ok' ? 'status-ok' : 'status-warn']">{{ verifyStatusLabel }}</text>
        <text :class="['risk-badge', `risk-${riskType}`]">{{ riskLevelLabel }}</text>
      </view>
      <text class="group-label">组件分组：{{ groupLabel }}</text>
      <view class="risk-panel">
        <text class="risk-title">平台差异提示</text>
        <text v-for="(risk, idx) in riskNotes" :key="`${title}-${idx}`" class="risk-item">- {{ risk }}</text>
      </view>
    </view>

    <view class="demo-panel">
      <slot name="demo" />
      <view class="empty-state">
        <text class="empty-text">当前组件暂无展示内容</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.component-case {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.case-header {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.case-title-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-wrap: wrap;
}

.case-title {
  color: #1f2329;
  font-size: 30rpx;
  font-weight: 600;
}

.group-label {
  color: #4e5969;
  font-size: 22rpx;
}

.status-badge,
.risk-badge {
  padding: 4rpx 10rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  line-height: 1.4;
}

.status-ok {
  color: #0e6245;
  background: #e8ffea;
}

.status-warn {
  color: #ad6800;
  background: #fff7e8;
}

.risk-low {
  color: #0e6245;
  background: #e8ffea;
}

.risk-medium {
  color: #ad6800;
  background: #fff7e8;
}

.risk-high {
  color: #a8071a;
  background: #fff1f0;
}

.risk-panel {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  padding: 12rpx;
  background: #fff7e8;
  border: 1rpx solid #ffd591;
  border-radius: 12rpx;
}

.risk-title {
  color: #d46b08;
  font-size: 24rpx;
  font-weight: 600;
}

.risk-item {
  color: #ad6800;
  font-size: 22rpx;
  line-height: 1.5;
}

.demo-panel {
  --lk-waterfall-demo-edge: 16rpx;

  padding: 16rpx;
  background: #ffffff;
  border-radius: 12rpx;
}

.empty-state {
  padding: 20rpx 0;
  text-align: center;
  display: none;
}

.empty-text {
  color: #86909c;
  font-size: 24rpx;
}
</style>
