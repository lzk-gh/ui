import { ref, shallowRef, computed, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';

export type MaybeCanvas2DContext = CanvasRenderingContext2D | any;

const hasRAF = typeof requestAnimationFrame === 'function';
const rAF = (cb: () => void): number =>
  hasRAF ? (requestAnimationFrame as any)(cb) : (setTimeout(cb, 16) as unknown as number);
const cAF = (id: number): void => (hasRAF ? (cancelAnimationFrame as any)(id) : clearTimeout(id));

export interface ChartSize {
  width: number;
  height: number;
}

export interface ChartCanvasInfo {
  ctx: MaybeCanvas2DContext;
  canvas: any;
  size: ChartSize;
  dpr: number;
  px: (rpx: number) => number;
}

export type ChartRenderer<TExtra = any> = (info: ChartCanvasInfo, progress: number, extra?: TExtra) => void;

export interface UseChartCanvasOptions {
  /** wrapper 的 id，用于 selectorQuery 取宽高 */
  wrapperId: string;
  /** canvas 的 id / canvas-id */
  canvasId: string;
  /** 是否自动测量父容器尺寸（默认 true） */
  autoSize?: boolean;
}

export function useChartCanvas<TExtra = any>(options: UseChartCanvasOptions) {
  const instance = getCurrentInstance()?.proxy as any;

  const ready = ref(false);
  const size = ref<ChartSize>({ width: 0, height: 0 });
  const dpr = ref(1);

  const canvasNode = shallowRef<any>(null);
  const ctx = shallowRef<MaybeCanvas2DContext | null>(null);

  const renderer = shallowRef<ChartRenderer<TExtra> | null>(null);

  // 交互坐标换算需要缓存 wrapper rect
  const wrapperRect = shallowRef<{ left: number; top: number; width: number; height: number } | null>(null);

  let rafId: number | undefined;
  let animRafId: number | undefined;
  let retryTimer: any;

  function px(rpx: number) {
    // rpx -> px
    // @ts-ignore
    if (typeof uni !== 'undefined' && typeof uni.upx2px === 'function') return uni.upx2px(rpx);
    return rpx;
  }

  function getDpr() {
    try {
      // @ts-ignore
      if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
        // @ts-ignore
        return (uni.getSystemInfoSync()?.pixelRatio as number) || 1;
      }
    } catch {}
    // H5 fallback
    try {
      if (typeof window !== 'undefined') return (window.devicePixelRatio as number) || 1;
    } catch {}
    return 1;
  }

  function measure(): Promise<ChartSize> {
    const autoSize = options.autoSize !== false;
    if (!autoSize) return Promise.resolve(size.value);

    return new Promise((resolve) => {
      if (!instance) {
        resolve(size.value);
        return;
      }

      uni
        .createSelectorQuery()
        .in(instance)
        .select(`#${options.wrapperId}`)
        .boundingClientRect((rect) => {
          if (
            rect &&
            !Array.isArray(rect) &&
            typeof rect.width === 'number' &&
            typeof rect.height === 'number'
          ) {
            wrapperRect.value = {
              left: (rect as any).left ?? 0,
              top: (rect as any).top ?? 0,
              width: rect.width,
              height: rect.height,
            };
            resolve({ width: rect.width, height: rect.height });
          } else {
            resolve(size.value);
          }
        })
        .exec();
    });
  }

  function initCanvas2D(): Promise<void> {
    return new Promise((resolve) => {
      if (!instance) {
        resolve();
        return;
      }

      uni
        .createSelectorQuery()
        .in(instance)
        .select(`#${options.canvasId}`)
        // node: true 用于小程序 type="2d" 获取 canvas node
        .fields({ node: true, size: true } as any, (res: any) => {
          const node = res?.node || null;
          canvasNode.value = node;

          const context = node?.getContext ? node.getContext('2d') : null;
          ctx.value = context;

          // H5 fallback：某些环境 fields({node:true}) 拿不到 node
          if (!ctx.value) {
            try {
              if (typeof document !== 'undefined') {
                const el = document.getElementById(options.canvasId) as any;
                if (el && typeof el.getContext === 'function') {
                  canvasNode.value = el;
                  ctx.value = el.getContext('2d');
                }
              }
            } catch {}
          }
          resolve();
        })
        .exec();
    });
  }

  function resizeCanvas(targetSize: ChartSize) {
    const node = canvasNode.value;
    const context = ctx.value;
    if (!node || !context) return;

    const ratio = getDpr();
    dpr.value = ratio;

    // 设定物理像素大小，避免模糊
    node.width = Math.max(1, Math.floor(targetSize.width * ratio));
    node.height = Math.max(1, Math.floor(targetSize.height * ratio));

    // 归一化坐标系到 CSS 像素
    if (typeof context.setTransform === 'function') {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
    if (typeof context.scale === 'function') {
      context.scale(ratio, ratio);
    }

    size.value = { width: targetSize.width, height: targetSize.height };
  }

  function clearRetryTimer() {
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  }

  async function ensureMeasuredVisible(attempts = 10) {
    // 典型场景：组件挂载在 v-show 隐藏的 tab 内，初次测量得到 0x0
    // 这里做一个短时间重试，等到可见后自动 resize + render。
    const delays = [50, 100, 150, 250, 400, 650, 1000, 1500, 2000, 3000];
    for (let i = 0; i < Math.min(attempts, delays.length); i += 1) {
      const s = await measure();
      if (s.width > 0 && s.height > 0) {
        resizeCanvas(s);
        if (ready.value) scheduleRender(1);
        return;
      }
      await new Promise<void>((resolve) => {
        clearRetryTimer();
        retryTimer = setTimeout(() => resolve(), delays[i]);
      });
    }
  }

  function clear() {
    if (!ctx.value) return;
    ctx.value.clearRect(0, 0, size.value.width, size.value.height);
  }

  function render(progress = 1, extra?: TExtra) {
    if (!renderer.value || !ctx.value || !canvasNode.value) return;

    clear();
    renderer.value(
      {
        ctx: ctx.value,
        canvas: canvasNode.value,
        size: size.value,
        dpr: dpr.value,
        px,
      },
      progress,
      extra
    );
  }

  function scheduleRender(progress = 1, extra?: TExtra) {
    if (rafId) return;
    rafId = rAF(() => {
      rafId = undefined;
      render(progress, extra);
    });
  }

  function animateTo(durationMs: number, onFrame: (p: number) => void, onDone?: () => void) {
    if (animRafId) {
      cAF(animRafId);
      animRafId = undefined;
    }

    const start = Date.now();
    const tick = () => {
      const t = (Date.now() - start) / Math.max(1, durationMs);
      const p = t >= 1 ? 1 : t;
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      onFrame(eased);
      if (p >= 1) {
        animRafId = undefined;
        onDone?.();
      } else {
        animRafId = rAF(tick);
      }
    };

    animRafId = rAF(tick);
  }

  function setRenderer(fn: ChartRenderer<TExtra>) {
    renderer.value = fn;
  }

  function getRelativePoint(e: unknown): { x: number; y: number } | null {
    const ev = e as any;
    // H5
    if (ev && typeof ev.offsetX === 'number' && typeof ev.offsetY === 'number') {
      return { x: ev.offsetX, y: ev.offsetY };
    }

    const touch = ev?.touches?.[0] || ev?.changedTouches?.[0];
    const x = touch?.x ?? touch?.clientX ?? ev?.detail?.x;
    const y = touch?.y ?? touch?.clientY ?? ev?.detail?.y;
    if (typeof x !== 'number' || typeof y !== 'number') return null;

    const rect = wrapperRect.value;
    if (!rect) return null;

    return {
      x: x - rect.left,
      y: y - rect.top,
    };
  }

  async function init() {
    await nextTick();
    await initCanvas2D();
    const measured = await measure();
    resizeCanvas(measured);
    ready.value = !!ctx.value;
    if (measured.width <= 0 || measured.height <= 0) {
      // 若初次测量失败（常见于隐藏挂载），尝试等待可见后再测
      ensureMeasuredVisible();
    } else {
      // 初次可用，直接渲染一次
      scheduleRender(1);
    }
  }

  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    if (rafId) cAF(rafId);
    if (animRafId) cAF(animRafId);
    clearRetryTimer();
  });

  return {
    ready: computed(() => ready.value),
    size: computed(() => size.value),
    dpr: computed(() => dpr.value),
    px,

    setRenderer,
    render,
    scheduleRender,
    animateTo,

    measure,
    init,
    getRelativePoint,
  };
}
