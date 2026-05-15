export const iconSemanticColorMap: Record<string, string> = {
  primary: 'var(--lk-color-primary)',
  success: 'var(--lk-color-success)',
  warning: 'var(--lk-color-warning)',
  danger: 'var(--lk-color-danger)',
  info: 'var(--lk-color-info)',
  text: 'var(--lk-color-text)',
  textSecondary: 'var(--lk-color-text-secondary)',
  textTertiary: 'var(--lk-color-text-tertiary)',
  textPlaceholder: 'var(--lk-color-text-placeholder)',
  textDisabled: 'var(--lk-color-text-disabled)',
  textInverse: 'var(--lk-color-text-inverse)',
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
