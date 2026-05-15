import { describe, expect, it } from 'vitest';
import { iconCharOf } from '../../src/uni_modules/lucky-ui/components/lk-icon/codepoints';
import {
  resolveIconColor,
  resolveIconSize,
  resolveIconStyle,
  shouldWarnMissingIcon,
} from '../../src/uni_modules/lucky-ui/components/lk-icon/icon.utils';

describe('lk-icon style rules', () => {
  it('maps semantic colors to theme variables and preserves custom colors', () => {
    expect(resolveIconColor('primary')).toBe('var(--lk-color-primary)');
    expect(resolveIconColor('textSecondary')).toBe('var(--lk-color-text-secondary)');
    expect(resolveIconColor('#ff0000')).toBe('#ff0000');
    expect(resolveIconColor('rgb(1, 2, 3)')).toBe('rgb(1, 2, 3)');
    expect(resolveIconColor('')).toBe('');
  });

  it('normalizes numeric sizes to rpx and preserves css sizes', () => {
    expect(resolveIconSize(44)).toBe('44rpx');
    expect(resolveIconSize('32')).toBe('32rpx');
    expect(resolveIconSize('1.5rem')).toBe('1.5rem');
    expect(resolveIconSize('var(--lk-rpx-44)')).toBe('var(--lk-rpx-44)');
    expect(resolveIconSize('')).toBe('');
  });

  it('builds inline style only for provided color and size', () => {
    expect(resolveIconStyle({ color: 'success', size: 36 })).toEqual({
      color: 'var(--lk-color-success)',
      fontSize: '36rpx',
    });
    expect(resolveIconStyle({ color: '', size: '' })).toEqual({});
  });

  it('resolves built-in icon codepoints and reports missing names', () => {
    expect(iconCharOf('x')).not.toBe('');
    expect(iconCharOf('not-a-real-icon')).toBe('');
    expect(shouldWarnMissingIcon(iconCharOf('x'))).toBe(false);
    expect(shouldWarnMissingIcon(iconCharOf('not-a-real-icon'))).toBe(true);
  });
});
