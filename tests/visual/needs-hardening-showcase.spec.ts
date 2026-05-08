import { expect, test } from '@playwright/test';
import { SHOWCASE_CASES } from '../../src/components/showcase/showcase-cases';

const NEEDS_HARDENING_CASES = [
  'curtain',
  'fab',
  'keyboard',
  'modal',
  'popup',
  'tabbar',
  'toast',
  'virtual-list',
] as const;

const CASES = SHOWCASE_CASES.filter(item => NEEDS_HARDENING_CASES.includes(item.slug as never));
const getShowcaseUrl = (slug: string) => `/?component=${slug}#/pages/showcase/index?component=${slug}`;

test.describe('needs-hardening showcase baseline', () => {
  test('medium-risk hardening cases are explicitly tracked', () => {
    expect(CASES.map(item => item.slug).sort()).toEqual([...NEEDS_HARDENING_CASES].sort());
    expect(CASES.every(item => item.verifyStatus === 'verified')).toBe(true);
    expect(CASES.every(item => item.riskLevel === 'medium')).toBe(true);
  });

  for (const componentCase of CASES) {
    test(`${componentCase.slug} renders verified hardening metadata`, async ({ page }) => {
      await page.goto(getShowcaseUrl(componentCase.slug));
      await page.waitForLoadState('networkidle');
      await page.setViewportSize({ width: 390, height: 844 });

      await expect(page.getByText(componentCase.title).first()).toBeVisible();
      await expect(page.getByText('✅ 全平台已验证')).toBeVisible();
      await expect(page.getByText('中风险')).toBeVisible();
      await expect(page.getByText('平台差异提示')).toBeVisible();
      await expect(page.getByText('当前组件暂无展示内容')).toBeHidden();
    });
  }
});
