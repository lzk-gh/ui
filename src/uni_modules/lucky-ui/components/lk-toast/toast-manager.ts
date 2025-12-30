import { ref, reactive, nextTick } from 'vue';
import type { ToastTransitionName } from './toast.props';

export interface ToastItem {
  id: number;
  message: string;
  transition?: ToastTransitionName;
  duration: number;
  position: 'top' | 'center' | 'bottom';
  visible: boolean;
}

const list = ref<ToastItem[]>([]);
let seed = 0;

export function useToast() {
  function show(opts: Partial<ToastItem> | string) {
    const opt: ToastItem = {
      id: ++seed,
      message: typeof opts === 'string' ? opts : opts.message || '',
      transition: typeof opts === 'string' ? 'slide-up' : (opts.transition || 'slide-up'),
      duration: typeof opts === 'string' ? 2000 : (opts.duration ?? 2000),
      position: (typeof opts === 'string' ? 'center' : opts.position) || 'center',
      visible: true,
    };
    list.value.push(opt);
    if (opt.duration > 0) {
      setTimeout(() => hide(opt.id), opt.duration);
    }
    return opt.id;
  }

  function hide(id: number) {
    const item = list.value.find(t => t.id === id);
    if (item) {
      item.visible = false;
    }
  }

  function remove(id: number) {
    list.value = list.value.filter(t => t.id !== id);
  }

  function close(id: number) {
    hide(id);
  }

  function clear() {
    list.value = [];
  }
  return { show, close, hide, remove, clear, list };
}

export const toastStore = reactive(useToast());
