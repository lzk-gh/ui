<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { useThemeStore } from '@/stores/theme';
// #ifndef H5
// H5 通过 CSS @font-face 自动加载字体，无需 base64 注入；仅 MP/App 需要
import { initLkIconsFont } from '@/uni_modules/lucky-ui/utils/init-lk-icons';
import { LK_ICONS_WOFF_BASE64 } from '@/uni_modules/lucky-ui/components/lk-icon/fonts/lk-icons.base64';
// #endif

// #ifdef H5
try {
  const saved = uni.getStorageSync('lk-theme');
  const initialTheme = saved === 'dark' || saved === 'light' ? saved : 'light';
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('lk-theme-light', 'lk-theme-dark');
    root.classList.add(`lk-theme-${initialTheme}`);
    root.setAttribute('data-theme', initialTheme);
    root.style.colorScheme = initialTheme;
  }
} catch {
  // ignore bootstrap theme errors
}
// #endif

onLaunch(async () => {
  // 立即隐藏原生 tabBar，防止闪烁
  uni.hideTabBar({ animation: false, fail: () => {} });

  // #ifndef H5
  // 初始化图标字体（小程序 / App 通过 loadFontFace 加载，H5 由 CSS @font-face 负责）
  await initLkIconsFont({ source: 'base64', data: LK_ICONS_WOFF_BASE64, format: 'woff' });
  // #endif

  // 初始化主题 Store（恢复保存的主题和品牌色）
  const themeStore = useThemeStore();
  themeStore.init();
});
</script>

<style lang="scss">
@use '@/uni_modules/lucky-ui/theme/src/index.scss' as *;
@use '@/styles/test-page.scss' as *;

/* 彻底隐藏原生 tabBar，防止加载时闪烁 */
/* #ifdef H5 */
uni-tabbar,
.uni-tabbar {
  display: none !important;
  height: 0 !important;
  max-height: 0 !important;
  min-height: 0 !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  overflow: hidden !important;
  position: absolute !important;
  left: -9999px !important;
  z-index: -1 !important;
}
/* #endif */

/* #ifdef MP-WEIXIN */
.weui-tabbar,
.wx-tabbar,
wx-tabbar {
  display: none !important;
  height: 0 !important;
  max-height: 0 !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
/* #endif */
</style>
