export const iconSemanticColorMap: Record<string, string> = {
  primary: 'var(--lk-color-primary)',
  success: 'var(--lk-color-success)',
  warning: 'var(--lk-color-warning)',
  danger: 'var(--lk-color-danger)',
  info: 'var(--lk-color-info)',
  text: 'var(--lk-text-primary)',
  textSecondary: 'var(--lk-text-secondary)',
  textTertiary: 'var(--lk-text-tertiary)',
  textPlaceholder: 'var(--lk-text-placeholder)',
  textDisabled: 'var(--lk-text-disabled)',
  textInverse: 'var(--lk-text-inverse)',
  white: 'var(--lk-color-white)',
  black: 'var(--lk-color-black)',
};

export function resolveIconColor(color: string): string {
  if (!color) return '';
  return iconSemanticColorMap[color] || color;
}

export function resolveIconSize(size: string | number): string {
  if (size === '') return '';
  return /^\d+$/.test(String(size)) ? `${size}rpx` : String(size);
}

export function resolveIconStyle(options: {
  color: string;
  size: string | number;
}): Record<string, string> {
  const styles: Record<string, string> = {};
  const color = resolveIconColor(options.color);
  const fontSize = resolveIconSize(options.size);

  if (color) styles.color = color;
  if (fontSize) styles.fontSize = fontSize;

  return styles;
}

export function shouldWarnMissingIcon(iconChar: string): boolean {
  return !iconChar;
}
