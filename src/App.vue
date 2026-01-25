<template>
  <!-- App.vue 不再强行包裹页面根，以免误解。页面各自决定主题类。 -->
  <slot />
</template>

<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { initLkIconsFont } from '@/uni_modules/lucky-ui/utils/init-lk-icons';

// 如果走 base64
import { LK_ICONS_TTF_BASE64 } from '@/uni_modules/lucky-ui/components/lk-icon/fonts/lk-icons.base64';

onLaunch(async () => {
  await initLkIconsFont({ source: 'base64', data: LK_ICONS_TTF_BASE64 });
});
</script>

<style lang="scss">
@import '@/uni_modules/lucky-ui/theme/src/index.scss';
</style>
