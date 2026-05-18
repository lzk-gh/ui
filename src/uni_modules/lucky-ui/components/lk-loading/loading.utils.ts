import type { LoadingVariant } from './loading.props';

export function normalizeLoadingSize(size: string | number): number {
  if (typeof size === 'number') return size;
  return parseInt(size, 10);
}

export function resolveLoadingRootClass(options: {
  type: string;
  vertical: boolean;
}) {
  return [
    `lk-loading--${options.type}`,
    { 'is-vertical': options.vertical },
  ];
}

export function resolveLoadingRootStyle(options: {
  color: string;
  showTrack: boolean;
  trackColor: string;
}) {
  const style: any = {
    '--_color': options.color,
  };

  if (!options.showTrack) {
    style['--_track-color'] = 'transparent';
  } else if (options.trackColor) {
    style['--_track-color'] = options.trackColor;
  }

  return style;
}

export function resolveLoadingSquareStyle(size: string | number) {
  const value = normalizeLoadingSize(size);
  return {
    width: `${value}rpx`,
    height: `${value}rpx`,
  };
}

export function resolveLoadingHeightStyle(size: string | number) {
  return {
    height: `${normalizeLoadingSize(size)}rpx`,
  };
}

export function resolveLoadingBarStyle(size: string | number) {
  return {
    width: `${Number(size) * 2}rpx`,
  };
}

export function resolveLoadingText(options: {
  type: string;
  text: string;
}) {
  return options.type === 'text' ? (options.text || 'Loading...') : options.text;
}

export function shouldRenderLoadingText(options: {
  type: string;
  text: string;
}) {
  return !!options.text && options.type !== 'text';
}
