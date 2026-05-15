export type AnchorTargetInput = {
  href: string;
  top: number;
  height?: number;
};

export type AnchorTarget = {
  href: string;
  top: number;
  height: number;
};

export function resolveAnchorNumber(value: string | number | undefined | null): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function resolveAnchorStyle(options: {
  bgColor?: string;
  activeBgColor?: string;
  textColor?: string;
  activeColor?: string;
}) {
  const style: Record<string, string> = {};
  if (options.bgColor) style['--lk-anchor-bg-sidebar'] = options.bgColor;
  if (options.activeBgColor) style['--lk-anchor-bg-active'] = options.activeBgColor;
  if (options.textColor) style['--lk-anchor-text-color'] = options.textColor;
  if (options.activeColor) style['--lk-anchor-active-color'] = options.activeColor;
  return style;
}

export function normalizeAnchorTargets(nextTargets: AnchorTargetInput[] | null | undefined): AnchorTarget[] {
  return (Array.isArray(nextTargets) ? nextTargets : [])
    .map(item => ({
      href: item.href,
      top: resolveAnchorNumber(item.top),
      height: resolveAnchorNumber(item.height),
    }))
    .filter(item => !!item.href)
    .sort((a, b) => a.top - b.top);
}

export function resolveAnchorOffset(options: {
  headerOffset?: string | number;
  headerHeight?: number;
  tolerance?: number;
}): number {
  return (
    resolveAnchorNumber(options.headerOffset) +
    resolveAnchorNumber(options.headerHeight) +
    resolveAnchorNumber(options.tolerance ?? 10)
  );
}

export function resolveActiveAnchorByScroll(options: {
  targets: AnchorTarget[];
  scrollTop: number;
  headerOffset?: string | number;
  headerHeight?: number;
}): string {
  const targets = options.targets;
  if (targets.length === 0) return '';

  const offset = resolveAnchorOffset({
    headerOffset: options.headerOffset,
    headerHeight: options.headerHeight,
  });
  const effectiveScrollTop = resolveAnchorNumber(options.scrollTop) + offset;

  let active = '';
  for (let i = 0; i < targets.length; i++) {
    const item = targets[i];
    const nextItem = targets[i + 1];
    if (effectiveScrollTop >= item.top && (!nextItem || effectiveScrollTop < nextItem.top)) {
      active = item.href;
      break;
    }
  }

  if (!active && resolveAnchorNumber(options.scrollTop) < targets[0].top) {
    active = targets[0].href;
  }

  return active;
}

export function resolveAnchorProgrammaticState(options: {
  isProgrammaticScrolling: boolean;
  pendingTargetHref: string;
  targets: AnchorTarget[];
  scrollTop: number;
  headerOffset?: string | number;
  headerHeight?: number;
}) {
  if (!options.isProgrammaticScrolling || !options.pendingTargetHref) {
    return { handled: false, reached: false, targetHref: '' };
  }

  const target = options.targets.find(item => item.href === options.pendingTargetHref);
  if (!target) {
    return { handled: true, reached: false, targetHref: '', shouldFinish: true };
  }

  const offset = resolveAnchorOffset({
    headerOffset: options.headerOffset,
    headerHeight: options.headerHeight,
  });
  const reached = resolveAnchorNumber(options.scrollTop) + offset >= Math.max(0, target.top - 6);

  return {
    handled: true,
    reached,
    targetHref: target.href,
    shouldFinish: false,
  };
}

export function resolveAnchorTargetId(href: string): string {
  return (href || '').replace(/^#/, '');
}

export function resolveAnchorScrollTop(options: {
  targetTop: number;
  headerOffset?: string | number;
}): number {
  return Math.max(0, resolveAnchorNumber(options.targetTop) - resolveAnchorNumber(options.headerOffset));
}

export function resolveAnchorScrollIntoViewId(href: string): string {
  return href ? `anchor-link-${href}` : '';
}

export function resolveAnchorLinkActive(activeHref: string | undefined, href: string): boolean {
  return activeHref === href;
}

export function resolveAnchorLinkClass(options: { active: boolean; disabled: boolean }): string[] {
  return [
    options.active ? 'lk-anchor-link--active' : '',
    options.disabled ? 'lk-anchor-link--disabled' : '',
  ];
}

export function canClickAnchorLink(disabled: boolean, href: string): boolean {
  return !disabled && !!href;
}
