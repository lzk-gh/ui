import { ref, reactive, nextTick } from 'vue';

export interface ToastItem {
  id: number;
  message: string;
  icon?: string;
  duration: number;
  position: 'top' | 'center' | 'bottom';
}

const list = ref<ToastItem[]>([]);
let seed = 0;

export function useToast() {
  function show(opts: Partial<ToastItem> | string) {
    const opt: ToastItem = {
      id: ++seed,
      message: typeof opts === 'string' ? opts : opts.message || '',
      icon: typeof opts === 'string' ? '' : opts.icon,
      duration: typeof opts === 'string' ? 2000 : (opts.duration ?? 2000),
      position: (typeof opts === 'string' ? 'center' : opts.position) || 'center',
    };
    list.value.push(opt);
    if (opt.duration > 0) {
      setTimeout(() => close(opt.id), opt.duration);
    }
    return opt.id;
  }
  function close(id: number) {
    list.value = list.value.filter(t => t.id !== id);
  }
  function clear() {
    list.value = [];
  }
  return { show, close, clear, list };
}

export const toastStore = reactive(useToast());
