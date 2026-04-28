export interface ScrollToTopOptions {
  /** 目标滚动位置 */
  scrollTop?: number;
  /** 页面滚动动画时长，单位 ms */
  duration?: number;
  /** 页面内选择器，传入后由 uni.pageScrollTo 定位到该节点 */
  selector?: string;
}

export interface TopAreaTapOptions extends ScrollToTopOptions {
  /** 顶部可点击热区高度，单位 px */
  topAreaHeight?: number;
}

export interface ControlledScrollToTopOptions {
  /** 受控滚动容器的 scrollTop setter */
  setScrollTop: (value: number) => void;
  /** 目标滚动位置 */
  scrollTop?: number;
}

type TouchPoint = {
  clientY?: number;
  pageY?: number;
  y?: number;
};

type TapLikeEvent = {
  touches?: TouchPoint[];
  changedTouches?: TouchPoint[];
  detail?: {
    y?: number;
  };
};

const DEFAULT_NAV_BAR_HEIGHT = 44;

function getTouchY(event: unknown): number | null {
  if (!event || typeof event !== 'object') return null;
  const source = event as TapLikeEvent;
  const point = source.changedTouches?.[0] || source.touches?.[0];
  const y = point?.clientY ?? point?.pageY ?? point?.y ?? source.detail?.y;
  return typeof y === 'number' ? y : null;
}

export function getTopAreaHeight() {
  let statusBarHeight = 0;
  try {
    statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;
  } catch {
    statusBarHeight = 0;
  }

  // ⚠️可能存在平台差异：微信小程序胶囊按钮高度可用于近似顶部可点击区域。
  // #ifdef MP-WEIXIN
  try {
    const menuRect = uni.getMenuButtonBoundingClientRect?.();
    if (menuRect?.bottom) return menuRect.bottom + 8;
  } catch {
    return statusBarHeight + DEFAULT_NAV_BAR_HEIGHT;
  }
  // #endif

  return statusBarHeight + DEFAULT_NAV_BAR_HEIGHT;
}

export function isTopAreaTap(event: unknown, topAreaHeight = getTopAreaHeight()) {
  const y = getTouchY(event);
  return y !== null && y <= topAreaHeight;
}

export function scrollToTop(options: ScrollToTopOptions = {}) {
  uni.pageScrollTo({
    scrollTop: options.scrollTop ?? 0,
    duration: options.duration ?? 300,
    selector: options.selector,
  });
}

export function scrollToTopIfTopAreaTap(event: unknown, options: TopAreaTapOptions = {}) {
  if (!isTopAreaTap(event, options.topAreaHeight)) return false;
  scrollToTop(options);
  return true;
}

export function scrollControlledToTop(options: ControlledScrollToTopOptions) {
  options.setScrollTop(options.scrollTop ?? 0);
}
