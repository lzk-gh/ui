import { ref, reactive } from 'vue';
import zhHans from './lang/zh-Hans';
import en from './lang/en';

export type MessageSchema = typeof zhHans;

const messages: Record<string, any> = {
  'zh-Hans': zhHans,
  en: en,
};

const currentLocale = ref('zh-Hans');

// 自动检测系统语言
if (typeof uni !== 'undefined' && uni.getLocale) {
  const systemLocale = uni.getLocale();
  if (messages[systemLocale]) {
    currentLocale.value = systemLocale;
  } else if (systemLocale.startsWith('zh')) {
    currentLocale.value = 'zh-Hans';
  } else if (systemLocale.startsWith('en')) {
    currentLocale.value = 'en';
  }
}

export const Locale = {
  get locale() {
    return currentLocale.value;
  },
  use(lang: string, newMessages?: any) {
    if (newMessages) {
      messages[lang] = newMessages;
    }
    if (messages[lang]) {
      currentLocale.value = lang;
    }
  },
  add(newMessages: Record<string, any>) {
    for (const key in newMessages) {
      if (messages[key]) {
        Object.assign(messages[key], newMessages[key]);
      } else {
        messages[key] = newMessages[key];
      }
    }
  },
  t(path: string, ...args: any[]): any {
    const langMessages = messages[currentLocale.value] || zhHans;
    const value = path.split('.').reduce((obj, key) => obj?.[key], langMessages);

    if (typeof value === 'function') {
      return value(...args);
    }
    return value !== undefined ? value : path;
  },
};

export default Locale;
