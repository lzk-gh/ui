import type { App, Component } from 'vue';

import './theme/src/runtime.scss';

import * as LuckyComponents from './components';

function isComponentExport(value: unknown): value is Component & { name: string } {
  return (
    typeof value === 'object'
    && value !== null
    && 'name' in value
    && typeof (value as { name?: unknown }).name === 'string'
    && (value as { name: string }).name.startsWith('Lk')
  );
}

export function install(app: App) {
  Object.values(LuckyComponents).forEach((component) => {
    if (isComponentExport(component)) {
      app.component(component.name, component);
    }
  });
}

const LuckyUI = {
  install,
};

export default LuckyUI;

export * from './components';
export * from './composables';
export * from './core/src';
export * from './theme';
export * from './utils';
