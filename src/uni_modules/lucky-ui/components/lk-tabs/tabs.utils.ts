import type { StyleValue } from 'vue';
import type { TabPaneContext, TabsValue } from './tabs.props';

export type TabsSwitchSource = 'click' | 'swipe';
export type TabsSwipeDirection = 'prev' | 'next';

export interface TabsTouchEventLike {
  changedTouches?: ArrayLike<{ pageX: number; pageY: number }>;
  touches?: ArrayLike<{ pageX: number; pageY: number }>;
}

export function findTabPaneIndex(panes: TabPaneContext[], name: TabsValue): number {
  return panes.findIndex(pane => pane.name === name);
}

export function upsertTabPane(panes: TabPaneContext[], pane: TabPaneContext): TabPaneContext[] {
  const next = [...panes];
  const index = findTabPaneIndex(next, pane.name);

  if (index === -1) {
    next.push(pane);
  } else {
    next[index] = pane;
  }

  return next;
}

export function removeTabPane(panes: TabPaneContext[], pane: TabPaneContext): TabPaneContext[] {
  return panes.filter(item => item.name !== pane.name);
}

export function resolveTabsInitialValue(options: {
  current: TabsValue;
  panes: TabPaneContext[];
}): TabsValue | null {
  if (!options.current && options.panes.length > 0) {
    return options.panes[0].name;
  }

  return null;
}

export function resolveTabsSetActive(options: {
  current: TabsValue;
  panes: TabPaneContext[];
  name: TabsValue;
  source: TabsSwitchSource;
}) {
  const index = findTabPaneIndex(options.panes, options.name);
  const pane = options.panes[index];
  const clickPayload = { name: options.name, pane, index };

  if (options.source === 'click' && pane?.disabled) {
    return {
      kind: 'disabled' as const,
      index,
      pane,
      clickPayload,
    };
  }

  if (options.name === options.current) {
    return {
      kind: 'unchanged' as const,
      index,
      pane,
      clickPayload,
    };
  }

  return {
    kind: 'change' as const,
    index,
    pane,
    name: options.name,
    clickPayload,
  };
}

export function getTabsTouchPoint(event: TabsTouchEventLike) {
  return event.changedTouches?.[0] || event.touches?.[0] || null;
}

export function resolveTabsSwipe(options: {
  panes: TabPaneContext[];
  current: TabsValue;
  deltaX: number;
  deltaY: number;
  threshold: number;
}): {
  direction: TabsSwipeDirection;
  pane: TabPaneContext;
  index: number;
} | null {
  if (
    Math.abs(options.deltaX) < options.threshold ||
    Math.abs(options.deltaX) < Math.abs(options.deltaY)
  ) {
    return null;
  }

  const index = findTabPaneIndex(options.panes, options.current);
  if (index < 0) return null;

  const nextIndex = options.deltaX < 0 ? index + 1 : index - 1;
  if (nextIndex < 0 || nextIndex >= options.panes.length) return null;

  const pane = options.panes[nextIndex];
  if (pane.disabled) return null;

  return {
    direction: options.deltaX < 0 ? 'next' : 'prev',
    pane,
    index: nextIndex,
  };
}

export function resolveTabsStretching(options: {
  stretch: boolean;
  paneCount: number;
}): boolean {
  return options.stretch && options.paneCount <= 5;
}

export function resolveTabsScrollable(paneCount: number): boolean {
  return paneCount > 5;
}

export function resolveTabsRootClass(options: {
  type: string;
  stretching: boolean;
  border: boolean;
  customClass?: unknown;
}) {
  return [
    `lk-tabs--${options.type}`,
    {
      'is-stretch': options.stretching,
      'is-borderless': !options.border,
    },
    options.customClass,
  ];
}

export function resolveTabsRootStyle(customStyle: StyleValue): StyleValue {
  return customStyle;
}

export function resolveTabNavItemClass(options: {
  active: boolean;
  disabled?: boolean;
}) {
  return {
    'is-active': options.active,
    'is-disabled': options.disabled,
  };
}

export function resolveTabsLineStyle(options: {
  translateX: number;
  width: number;
}) {
  return {
    transform: `translateX(${options.translateX}px)`,
    width: `${options.width}px`,
  };
}

export function resolveTabsOverflow(options: {
  navLeft: number;
  navWidth: number;
  firstLeft: number;
  lastRight: number;
  tolerance?: number;
}) {
  const tolerance = options.tolerance ?? 2;
  const navRight = options.navLeft + options.navWidth;

  return {
    left: options.firstLeft < options.navLeft - tolerance,
    right: options.lastRight > navRight + tolerance,
  };
}

export function resolveTabPaneLoaded(options: {
  lazy: boolean;
  active: boolean;
}): boolean {
  return !options.lazy || options.active;
}
