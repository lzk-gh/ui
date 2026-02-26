<script setup lang="ts">
import { ref } from 'vue';
import LkSteps from '@/uni_modules/lucky-ui/components/lk-steps/lk-steps.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';
import type { StepCardItem } from '@/uni_modules/lucky-ui/components/lk-steps/steps.props';

// ── Story 模式 ───────────────────────────────────────────────
const storyCurrent = ref(0);
const storyItems: StepCardItem[] = [
  {
    title: '发现你的风格',
    subtitle: '个性化推荐，只属于你',
    description: '我们根据你的偏好为你精选内容，让每一次发现都恰到好处。',
    icon: 'compass',
    gradient: ['#6965db', '#a78bfa'],
    tag: '第一步',
  },
  {
    title: '连接你的世界',
    subtitle: '一键同步所有设备',
    description: '无论手机、平板还是电脑，你的数据始终触手可及，随时随地继续工作。',
    icon: 'link',
    gradient: ['#0ea5e9', '#38bdf8'],
    tag: '第二步',
  },
  {
    title: '开启无限可能',
    subtitle: '解锁全部高级功能',
    description: '超过 50 项专业功能等你探索，提升效率，让创意自由流淌。',
    icon: 'star',
    gradient: ['#f59e0b', '#fbbf24'],
    tag: '第三步',
  },
  {
    title: '一切就绪！',
    subtitle: '欢迎加入我们',
    description: '你已完成所有设置。现在开始你的专属体验之旅吧！',
    icon: 'check-circle',
    gradient: ['#10b981', '#34d399'],
    tag: '完成',
  },
];

// ── Stack 模式 ───────────────────────────────────────────────
const stackCurrent = ref(0);
const stackItems: StepCardItem[] = [
  {
    title: '创建你的账户',
    subtitle: '只需 30 秒',
    description: '填写基本信息，开启你的专属空间。我们承诺不发送垃圾邮件。',
    icon: 'user',
    tag: 'STEP 01',
  },
  {
    title: '完善个人资料',
    subtitle: '让他人更了解你',
    description: '上传头像、填写简介，打造你的专属身份标识，让协作更高效。',
    icon: 'edit-3',
    tag: 'STEP 02',
  },
  {
    title: '选择你的计划',
    subtitle: '免费开始，随时升级',
    description: '基础功能永久免费。升级 Pro 计划可解锁无限存储和高级协作工具。',
    icon: 'package',
    tag: 'STEP 03',
  },
  {
    title: '邀请团队成员',
    subtitle: '协作从这里开始',
    description: '分享邀请链接，你的团队将在几秒内加入。每邀请一人，双方各获 30 天会员。',
    icon: 'users',
    tag: 'STEP 04',
  },
];
</script>

<template>
  <view class="component-demo">

    <!-- ══════════════ Story 模式 ══════════════ -->
    <demo-block title="Story 式进度卡片" description="点击左侧回退，右侧前进。autoplay 自动播放。">
      <lk-steps
        v-model:current="storyCurrent"
        type="story"
        :items="storyItems"
        :card-height="760"
        :autoplay="4000"
      />
      <view class="btn-row">
        <lk-button size="sm" variant="outline" :disabled="storyCurrent === 0" @click="storyCurrent--">上一步</lk-button>
        <lk-button size="sm" variant="solid" :disabled="storyCurrent === storyItems.length - 1" @click="storyCurrent++">下一步</lk-button>
      </view>
    </demo-block>

    <!-- ══════════════ Stack 层叠卡片 ══════════════ -->
    <demo-block title="层叠卡片步骤" description="卡片堆叠在一起，完成后向右上方弹走。">
      <lk-steps
        v-model:current="stackCurrent"
        type="stack"
        :items="stackItems"
        :card-height="520"
      >
        <template #actions="{ goNext, goPrev, current: c, total: t }">
          <view class="stack-actions">
            <lk-button
              v-if="c > 0"
              size="sm"
              variant="text"
              @click="goPrev"
            >
              返回
            </lk-button>
            <lk-button
              size="sm"
              variant="solid"
              :style="{ flex: 1 }"
              @click="goNext"
            >
              {{ c === t - 1 ? '完成 🎉' : '下一步' }}
            </lk-button>
          </view>
          <view class="stack-dots">
            <view
              v-for="(_, idx) in stackItems"
              :key="idx"
              class="stack-dot"
              :class="{ 'is-active': idx === c }"
            />
          </view>
        </template>
      </lk-steps>
    </demo-block>


  </view>
</template>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.btn-row {
  display: flex;
  gap: 16rpx;
  margin-top: 32rpx;
  justify-content: center;
}

.stack-actions {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.stack-dots {
  display: flex;
  gap: 12rpx;
  justify-content: center;
  margin-top: 20rpx;
}

.stack-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 999rpx;
  background: var(--lk-fill-2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.is-active {
    width: 32rpx;
    background: var(--lk-color-primary);
  }
}
</style>
