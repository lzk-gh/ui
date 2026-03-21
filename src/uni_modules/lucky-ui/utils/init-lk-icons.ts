// 在 App 启动时调用此方法（mp-weixin 真机关键）
export type InitFontOptions =
  | { source: 'cdn'; url: string } // https 地址，需在 downloadFile 合法域名
  | { source: 'base64'; data: string; format?: 'woff' | 'truetype' }; // 仅 base64 内容，不包含 data: 前缀

let loaded = false;

function hasReadyPage(): boolean {
  try {
    const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : [];
    return Array.isArray(pages) && pages.length > 0;
  } catch {
    return false;
  }
}

async function waitForPageReady(maxRetry = 20, interval = 50): Promise<void> {
  for (let i = 0; i < maxRetry; i += 1) {
    if (hasReadyPage()) return;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

export async function initLkIconsFont(opt: InitFontOptions) {
  if (loaded) return;
  const family = 'lk-icons';
  let source = '';

  if (opt.source === 'cdn') {
    // 强制选用 ttf，兼容性最好
    source = `url("${opt.url}")`;
  } else {
    // base64 数据：传入纯 base64 字符串，这里拼接成 data URL
    const format = opt.format ?? 'woff';
    const mime = format === 'woff' ? 'font/woff' : 'font/truetype';
    source = `url("data:${mime};charset=utf-8;base64,${opt.data}") format("${format}")`;
  }

  try {
    // #ifndef H5
    // 小程序 / App 启动早期可能还没有 page 实例，直接 global 加载会触发 $page undefined
    // 在部分 App 极早期启动阶段，waitForPageReady 可能由于底层通讯未好而导致 Network Error
    // 稍作延迟等待底层加载完毕
    await new Promise(resolve => setTimeout(resolve, 200));
    await waitForPageReady();
    // #endif

    await new Promise((resolve, reject) => {
      // @ts-ignore: uni API
      uni.loadFontFace({
        family,
        source,
        // 全局生效，避免局部页面未加载到字体
        global: true,
        success: resolve,
        fail: reject,
      });
    });
    loaded = true;
    // 小程序端：首次渲染前尽早加载，避免闪烁
    // H5/App 端：不需要也无妨
    console.log('[lk-icons] font loaded');
  } catch (e) {
    try {
      // #ifndef H5
      // 兜底：部分宿主对 global 参数兼容不稳定，退化为局部注入避免启动报错
      await new Promise((resolve, reject) => {
        // @ts-ignore: uni API
        uni.loadFontFace({
          family,
          source,
          success: resolve,
          fail: reject,
        });
      });
      loaded = true;
      console.log('[lk-icons] font loaded (fallback)');
      return;
      // #endif
    } catch {
      // ignore fallback error
    }
    console.warn('[lk-icons] font load failed', e);
  }
}
