// 在 App 启动时调用此方法（mp-weixin 真机关键）
export type InitFontOptions =
    | { source: 'cdn'; url: string } // https 地址，需在 downloadFile 合法域名
    | { source: 'base64'; data: string }; // 仅 base64 内容，不包含 data: 前缀

let loaded = false;
export async function initLkIconsFont(opt: InitFontOptions) {
    if (loaded) return;
    const family = 'lk-icons';
    let source = '';

    if (opt.source === 'cdn') {
        // 强制选用 ttf，兼容性最好
        source = `url("${opt.url}")`;
    } else {
        // base64 数据：传入纯 base64 字符串，这里拼接成 data URL
        source = `url("data:font/truetype;charset=utf-8;base64,${opt.data}") format("truetype")`;
    }

    try {
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
        console.warn('[lk-icons] font load failed', e);
    }
}