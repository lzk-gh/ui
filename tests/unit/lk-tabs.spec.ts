import { describe, expect, it } from 'vitest';
import type { TabPaneContext } from '../../src/uni_modules/lucky-ui/components/lk-tabs/tabs.props';
import {
  findTabPaneIndex,
  getTabsTouchPoint,
  removeTabPane,
  resolveTabNavItemClass,
  resolveTabPaneLoaded,
  resolveTabsInitialValue,
  resolveTabsLineStyle,
  resolveTabsOverflow,
  resolveTabsRootClass,
  resolveTabsRootStyle,
  resolveTabsScrollable,
  resolveTabsSetActive,
  resolveTabsStretching,
  resolveTabsSwipe,
  upsertTabPane,
} from '../../src/uni_modules/lucky-ui/components/lk-tabs/tabs.utils';

describe('lk-tabs selection and navigation rules', () => {
  const panes: TabPaneContext[] = [
    { name: 'home', label: 'Home' },
    { name: 'profile', label: 'Profile' },
    { name: 'disabled', label: 'Disabled', disabled: true },
  ];

  it('registers, replaces and unregisters panes immutably', () => {
    expect(findTabPaneIndex(panes, 'profile')).toBe(1);

    const added = upsertTabPane(panes, { name: 'settings', label: 'Settings' });
    expect(added.map(pane => pane.name)).toEqual(['home', 'profile', 'disabled', 'settings']);
    expect(panes).toHaveLength(3);

    const replaced = upsertTabPane(panes, { name: 'profile', label: 'Account' });
    expect(replaced[1]).toEqual({ name: 'profile', label: 'Account' });

    expect(removeTabPane(panes, { name: 'profile', label: '' }).map(pane => pane.name))
      .toEqual(['home', 'disabled']);
  });

  it('resolves initial value from the first pane only when model value is empty', () => {
    expect(resolveTabsInitialValue({ current: '', panes })).toBe('home');
    expect(resolveTabsInitialValue({ current: 'profile', panes })).toBeNull();
    expect(resolveTabsInitialValue({ current: '', panes: [] })).toBeNull();
  });

  it('resolves click selection states', () => {
    expect(resolveTabsSetActive({
      current: 'home',
      panes,
      name: 'disabled',
      source: 'click',
    })).toMatchObject({
      kind: 'disabled',
      index: 2,
      pane: panes[2],
    });

    expect(resolveTabsSetActive({
      current: 'home',
      panes,
      name: 'home',
      source: 'click',
    })).toMatchObject({
      kind: 'unchanged',
      index: 0,
    });

    expect(resolveTabsSetActive({
      current: 'home',
      panes,
      name: 'profile',
      source: 'click',
    })).toMatchObject({
      kind: 'change',
      index: 1,
      name: 'profile',
    });
  });

  it('resolves swipe navigation with threshold, direction and disabled guard', () => {
    expect(resolveTabsSwipe({
      panes,
      current: 'home',
      deltaX: -60,
      deltaY: 10,
      threshold: 50,
    })).toEqual({
      direction: 'next',
      pane: panes[1],
      index: 1,
    });

    expect(resolveTabsSwipe({
      panes,
      current: 'profile',
      deltaX: 60,
      deltaY: 10,
      threshold: 50,
    })).toEqual({
      direction: 'prev',
      pane: panes[0],
      index: 0,
    });

    expect(resolveTabsSwipe({
      panes,
      current: 'profile',
      deltaX: -60,
      deltaY: 10,
      threshold: 50,
    })).toBeNull();

    expect(resolveTabsSwipe({
      panes,
      current: 'profile',
      deltaX: -40,
      deltaY: 10,
      threshold: 50,
    })).toBeNull();
  });

  it('builds root, item and indicator styles', () => {
    expect(resolveTabsStretching({ stretch: true, paneCount: 5 })).toBe(true);
    expect(resolveTabsStretching({ stretch: true, paneCount: 6 })).toBe(false);
    expect(resolveTabsScrollable(6)).toBe(true);

    expect(resolveTabsRootClass({
      type: 'line',
      stretching: true,
      border: false,
      customClass: 'custom-tabs',
    })).toEqual([
      'lk-tabs--line',
      { 'is-stretch': true, 'is-borderless': true },
      'custom-tabs',
    ]);

    const customStyle = { marginTop: '12rpx' };
    expect(resolveTabsRootStyle(customStyle)).toBe(customStyle);
    expect(resolveTabNavItemClass({ active: true, disabled: false })).toEqual({
      'is-active': true,
      'is-disabled': false,
    });
    expect(resolveTabsLineStyle({ translateX: 24, width: 48 })).toEqual({
      transform: 'translateX(24px)',
      width: '48px',
    });
  });

  it('resolves overflow masks and pane lazy loading', () => {
    expect(resolveTabsOverflow({
      navLeft: 100,
      navWidth: 200,
      firstLeft: 90,
      lastRight: 320,
    })).toEqual({ left: true, right: true });

    expect(resolveTabPaneLoaded({ lazy: false, active: false })).toBe(true);
    expect(resolveTabPaneLoaded({ lazy: true, active: false })).toBe(false);
    expect(resolveTabPaneLoaded({ lazy: true, active: true })).toBe(true);
  });

  it('reads touch points from uni touch event shapes', () => {
    expect(getTabsTouchPoint({ changedTouches: [{ pageX: 1, pageY: 2 }] })).toEqual({
      pageX: 1,
      pageY: 2,
    });
    expect(getTabsTouchPoint({ touches: [{ pageX: 3, pageY: 4 }] })).toEqual({
      pageX: 3,
      pageY: 4,
    });
    expect(getTabsTouchPoint({})).toBeNull();
  });
});
