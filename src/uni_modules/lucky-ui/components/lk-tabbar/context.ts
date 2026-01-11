import type { ComputedRef, InjectionKey } from 'vue';

export type TabbarValue = string | number;

export type TabbarProvide = {
  active: ComputedRef<TabbarValue | ''>;
  setActive: (val: TabbarValue) => void;
};

export const tabbarContextKey: InjectionKey<TabbarProvide> = Symbol('LkTabbar');
