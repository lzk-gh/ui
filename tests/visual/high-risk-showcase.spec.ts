import { expect, test } from '@playwright/test';
import { SHOWCASE_CASES } from '../../src/components/showcase/showcase-cases';

const HIGH_RISK_CASES = SHOWCASE_CASES.filter(item => item.riskLevel === 'high');
const getShowcaseUrl = (slug: string) => `/?component=${slug}#/pages_sub/showcase/index?component=${slug}`;

test.describe('high-risk showcase baseline', () => {
  test('high-risk cases are explicitly tracked', () => {
    expect(HIGH_RISK_CASES.map(item => item.slug).sort()).toEqual([
      'picker',
      'tabbar-container',
      'tooltip',
      'waterfall',
    ]);
  });

  for (const componentCase of HIGH_RISK_CASES) {
    test(`${componentCase.slug} renders verified high-risk metadata`, async ({ page }) => {
      await page.goto(getShowcaseUrl(componentCase.slug));
      await page.waitForLoadState('networkidle');
      await page.setViewportSize({ width: 390, height: 844 });

      await expect(page.getByText(componentCase.title).first()).toBeVisible();
      await expect(page.getByText('✅ 全平台已验证')).toBeVisible();
      await expect(page.getByText('高风险')).toBeVisible();
      await expect(page.getByText('平台差异提示')).toBeVisible();
      await expect(page.getByText('当前组件暂无展示内容')).toBeHidden();
    });
  }
});
