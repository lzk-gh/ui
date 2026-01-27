<template>
  <!-- App.vue 作为应用根组件，不直接渲染页面内容 -->
  <slot />
</template>

<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
import { initLkIconsFont } from '@/uni_modules/lucky-ui/utils/init-lk-icons';
import { LK_ICONS_TTF_BASE64 } from '@/uni_modules/lucky-ui/components/lk-icon/fonts/lk-icons.base64';

onLaunch(async () => {
  // 初始化图标字体
  await initLkIconsFont({ source: 'base64', data: LK_ICONS_TTF_BASE64 });

  // 初始化主题 Store（恢复保存的主题和品牌色）
  const themeStore = useThemeStore();
  themeStore.init();
});
</script>

<style lang="scss">
@import '@/uni_modules/lucky-ui/theme/src/index.scss';
</style>
