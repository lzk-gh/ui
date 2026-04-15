<script setup lang="ts">
/**
 * Timeline 时间轴演示
 */
</script>

<template>
  <view class="timeline-demo">
    <demo-block title="基础工作流">
      <lk-timeline>
        <lk-timeline-item title="拍摄：海岸日落" subtitle="Malibu Beach · CA" status="completed">
          <template #extra>
            <view class="lk-timeline-preview-card">
              <image
                src="https://picsum.photos/200/200?random=1"
                mode="aspectFill"
                class="lk-timeline-preview-card__image"
              />
              <view class="lk-timeline-preview-card__info">
                <text class="lk-timeline-preview-card__name">sunset_malibu_01.jpg</text>
                <text class="lk-timeline-preview-card__meta">4032 × 3024 · 8.2 MB</text>
                <text class="lk-timeline-preview-card__meta">RAW + JPEG</text>
              </view>
            </view>
          </template>
        </lk-timeline-item>

        <lk-timeline-item title="拍摄：城市夜景" subtitle="Downtown LA · 21F" status="active">
          <template #extra>
            <view class="lk-timeline-preview-card">
              <image
                src="https://picsum.photos/200/200?random=2"
                mode="aspectFill"
                class="lk-timeline-preview-card__image"
              />
              <view class="lk-timeline-preview-card__info">
                <text class="lk-timeline-preview-card__name">nightscape_dtla_03.jpg</text>
                <text class="lk-timeline-preview-card__meta">5472 × 3648 · 12.1 MB</text>
                <text class="lk-timeline-preview-card__meta">长曝光 · f/8 · ISO 200</text>
              </view>
            </view>
          </template>
        </lk-timeline-item>

        <lk-timeline-item title="后期处理" subtitle="Lightroom · 导出" status="pending" desc="色调统一，等待导出完成。">
          <template #extra>
            <view class="lk-timeline-item-preview">
              <image src="https://picsum.photos/100/100?random=3" class="lk-timeline-preview-img" />
              <image src="https://picsum.photos/100/100?random=4" class="lk-timeline-preview-img" />
            </view>
          </template>
        </lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="带时间列 (左侧插槽)">
      <lk-timeline>
        <lk-timeline-item
          time="09:00"
          date="Today"
          title="晨会"
          desc="讨论 Lucky UI 第四轮重构方案。"
          status="completed"
        />
        <lk-timeline-item
          time="14:30"
          title="代码评审"
          desc="审核分发版组件解耦逻辑。"
          status="active"
        />
        <lk-timeline-item
          time="18:00"
          date="Tomorrow"
          title="发布版本"
          status="pending"
        />
      </lk-timeline>
    </demo-block>

    <demo-block title="节点变体 (Outlined / Numbered)">
      <lk-timeline dot-variant="outlined">
        <lk-timeline-item
          title="提交申请"
          desc="2024-04-14 10:00"
          status="completed"
        />
        <lk-timeline-item
          title="部门审核"
          desc="审核中"
          status="active"
        />
        <lk-timeline-item
          title="完成"
          status="pending"
        />
      </lk-timeline>

      <view style="height: 40rpx"></view>

      <lk-timeline dot-variant="numbered">
        <lk-timeline-item :index="0" title="账户验证" desc="输入手机号完成验证。" />
        <lk-timeline-item :index="1" title="设置密码" desc="请设置 8-16 位安全密码。" />
        <lk-timeline-item :index="2" title="注册成功" />
      </lk-timeline>
    </demo-block>

    <demo-block title="自定义节点与样式 (New)">
      <lk-timeline :custom-style="{ '--lk-timeline-line-color': 'var(--lk-color-success)' }">
        <lk-timeline-item title="使用图标">
          <template #dot>
            <view class="custom-dot">
              <lk-icon name="check-circle-fill" color="var(--lk-color-success)" size="40" />
            </view>
          </template>
          自定义 dot 插槽可以放入任何内容。
        </lk-timeline-item>
        <lk-timeline-item title="自定义样式" color="#7c3aed">
          <template #dot>
            <view class="custom-dot-pulse" />
          </template>
          通过 CSS 变量修改连接线颜色。
        </lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <demo-block title="水平滚动模式">
      <lk-timeline direction="horizontal">
        <lk-timeline-item title="步骤 1" desc="初始化" status="completed" />
        <lk-timeline-item title="步骤 2" desc="处理中" status="active" />
        <lk-timeline-item title="步骤 3" desc="待开始" status="pending" />
        <lk-timeline-item title="步骤 4" desc="完成" status="pending" />
      </lk-timeline>
    </demo-block>
  </view>
</template>

<style lang="scss" scoped>
.timeline-demo {
  padding-bottom: 60rpx;
}

.custom-dot {
  background: white;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-dot-pulse {
  width: 20rpx;
  height: 20rpx;
  background: #7c3aed;
  border-radius: 50%;
  position: relative;
  z-index: 2;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #7c3aed;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(3); opacity: 0; }
}

// 模拟 demo 中的图片列表
.lk-timeline-item-preview {
  margin-top: 16rpx;
  display: flex;
  gap: 12rpx;
}

.lk-timeline-preview-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
}

.lk-timeline-preview-card {
  display: flex;
  padding: 20rpx;
  background: var(--lk-fill-1);
  border-radius: 16rpx;
  margin-top: 16rpx;
  gap: 20rpx;

  &__image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 8rpx;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__name {
    font-size: 26rpx;
    font-weight: bold;
    color: var(--lk-text-primary);
  }

  &__meta {
    font-size: 22rpx;
    color: var(--lk-text-secondary);
  }
}
</style>
