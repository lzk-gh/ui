// 主题状态（响应式）统一管理
// 加一个无实际意义的导出常量，防止某些情况下极端 tree-shaking 误删
export const __LK_THEME_VERSION__ = '0.0.1';

import { ref, computed } from 'vue';

const _theme = ref<'light' | 'dark'>('light');

function applyDomTheme(t: 'light' | 'dark') {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', t);
    }
}

/** 在 setup 中使用 */
export function useTheme() {
    const theme = computed(() => _theme.value);
    function setTheme(t: 'light' | 'dark') {
        if (_theme.value === t) return;
        _theme.value = t;
        applyDomTheme(t);
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
    set value(v: 'light' | 'dark') {
        _theme.value = v;
        applyDomTheme(v);
    },
};