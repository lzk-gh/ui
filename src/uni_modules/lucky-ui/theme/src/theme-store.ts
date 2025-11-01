// 主题状态（响应式）统一管理
// 加一个无实际意义的导出常量，防止某些情况下极端 tree-shaking 误删
export const __LK_THEME_VERSION__ = '0.0.1';

import { ref, computed } from 'vue';

type Theme = 'light' | 'dark';

function readPersistedTheme(): Theme | null {
    try {
        // 优先使用 uni 存储（小程序/H5 均可）
        // @ts-ignore - 全局 uni 可能不存在于类型环境
        if (typeof uni !== 'undefined' && typeof uni.getStorageSync === 'function') {
            // @ts-ignore
            const v = uni.getStorageSync('lk_theme');
            if (v === 'light' || v === 'dark') return v;
        }
        if (typeof localStorage !== 'undefined') {
            const v = localStorage.getItem('lk_theme');
            if (v === 'light' || v === 'dark') return v;
        }
    } catch {}
    return null;
}

function persistTheme(t: Theme) {
    try {
        // @ts-ignore
        if (typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function') {
            // @ts-ignore
            uni.setStorageSync('lk_theme', t);
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('lk_theme', t);
        }
    } catch {}
}

function detectSystemPrefersDark(): Theme | null {
    try {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
    } catch {}
    return null;
}

const initialTheme: Theme = readPersistedTheme() ?? detectSystemPrefersDark() ?? 'light';
const _theme = ref<Theme>(initialTheme);

function applyDomTheme(t: Theme) {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', t);
    }
}

/** 在 setup 中使用 */
export function useTheme() {
    const theme = computed(() => _theme.value);
    function setTheme(t: Theme) {
        if (_theme.value === t) return;
        _theme.value = t;
        applyDomTheme(t);
        persistTheme(t);
    }
    function toggleTheme() {
        setTheme(_theme.value === 'light' ? 'dark' : 'light');
    }
    // 初始化（H5 首次加载）
    if (typeof document !== 'undefined' && !document.documentElement.getAttribute('data-theme')) {
        applyDomTheme(_theme.value);
    }
    return { theme, setTheme, toggleTheme };
}

/** 在非 setup / 任意模块快速读 */
export const themeStore = {
    get value() {
        return _theme.value;
    },
    set value(v: Theme) {
        _theme.value = v;
        applyDomTheme(v);
        persistTheme(v);
    },
};
