import { computed } from 'vue';
import { Locale } from '../locale';

export function useLocale(componentName?: string) {
  const t = (path: string, ...args: any[]) => {
    if (componentName) {
      // 尝试访问组件命名空间下的翻译，如 lk.calendar.title
      const componentPath = `lk.${componentName}.${path}`;
      const result = Locale.t(componentPath, ...args);
      if (result !== componentPath) return result;
    }

    // 尝试访问通用命名空间，如 lk.common.confirm
    const commonPath = `lk.common.${path}`;
    const commonResult = Locale.t(commonPath, ...args);
    if (commonResult !== commonPath) return commonResult;

    // 最后返回原始路径（或者调用 Locale.t 也会返回原始路径）
    return Locale.t(path, ...args);
  };

  return {
    t,
    locale: computed(() => Locale.locale),
  };
}
