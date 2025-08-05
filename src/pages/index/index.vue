<template>
  <view class="container">
    <!-- 修改：type="text" → variant="text" -->
    <lk-button variant="text">注册</lk-button>

    <lk-button shape="round">关注</lk-button>

    <lk-button loading>提交中...</lk-button>

    <lk-button disabled>已禁用</lk-button>

    <lk-button shape="circle" icon="your-icon-class-here"></lk-button>

    <lk-button shape="" size="large">登录</lk-button>
  </view>
</template>
<script setup lang="ts">
import LkButton from "@/uni_modules/lucky-ui/components/lk-button/lk-button.vue";
</script>