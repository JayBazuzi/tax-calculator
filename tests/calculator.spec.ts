import { test, expect } from '@playwright/test';

test.describe('Retirement Tax Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Wait for the app to initialize and tax data to load
    // Check that tax brackets are displayed (indicates data loaded)
    await page.waitForSelector('#ordinary-brackets .bracket-label');
  });

  test('Test Case 1: $40,000 Regular Income, $100,000 LTCG, Married Filing Jointly', async ({ page }) => {
    // Set filing status to Married Filing Jointly (should be default)
    await expect(page.locator('#filing-status')).toHaveValue('marriedFilingJointly');

    // Set regular income to $40,000
    await page.locator('#regular-income-value').fill('40000');
    await page.locator('#regular-income-value').press('Tab'); // Trigger change event

    // Set LTCG to $100,000
    await page.locator('#ltcg-value').fill('100000');
    await page.locator('#ltcg-value').press('Tab'); // Trigger change event

    // Wait for calculations to complete
    await page.waitForTimeout(100);

    // Verify sliders match expected values
    await expect(page.locator('#regular-income')).toHaveValue('40000');
    await expect(page.locator('#ltcg')).toHaveValue('100000');

    // Verify total income
    await expect(page.locator('#total-income')).toHaveText('$140,000');

    // Verify regular income tax breakdown (placeholder values - to be tuned)
    const regularIncomeTaxes = page.locator('#regular-income-taxes');
    await expect(regularIncomeTaxes).toContainText('@');

    // Verify LTCG tax breakdown (placeholder values - to be tuned)
    const ltcgTaxes = page.locator('#ltcg-taxes');
    await expect(ltcgTaxes).toContainText('@');

    // Verify total taxes (placeholder value - to be tuned)
    // Expected: approximately $8,500 (this is a placeholder)
    const totalTaxes = await page.locator('#total-taxes').textContent();
    expect(totalTaxes).toMatch(/\$[\d,]+/);
  });

  test('Test Case 2: $0 income, $0 LTCG', async ({ page }) => {
    // Set filing status to Married Filing Jointly (should be default)
    await expect(page.locator('#filing-status')).toHaveValue('marriedFilingJointly');

    // Set regular income to $0
    await page.locator('#regular-income-value').fill('0');
    await page.locator('#regular-income-value').press('Tab');

    // Set LTCG to $0
    await page.locator('#ltcg-value').fill('0');
    await page.locator('#ltcg-value').press('Tab');

    // Wait for calculations to complete
    await page.waitForTimeout(100);

    // Verify sliders match expected values
    await expect(page.locator('#regular-income')).toHaveValue('0');
    await expect(page.locator('#ltcg')).toHaveValue('0');

    // Verify total income
    await expect(page.locator('#total-income')).toHaveText('$0');

    // Verify regular income taxes show $0
    const regularIncomeTaxes = page.locator('#regular-income-taxes');
    await expect(regularIncomeTaxes).toContainText('$0 @ 0% = $0');

    // Verify LTCG taxes show $0
    const ltcgTaxes = page.locator('#ltcg-taxes');
    await expect(ltcgTaxes).toContainText('$0 @ 0% = $0');

    // Verify total taxes are $0
    await expect(page.locator('#total-taxes')).toHaveText('$0');
  });
});
