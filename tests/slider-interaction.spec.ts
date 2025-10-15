import { test, expect } from '@playwright/test';

test.describe('Slider Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to initialize
    await page.waitForSelector('#ordinary-brackets .bracket-label');
  });

  test('setting regular income updates the bar width', async ({ page }) => {
    const valueInput = page.locator('#regular-income-value');
    const slider = page.locator('#regular-income');
    const bar = page.locator('#regular-income-bar');

    // Initially, bar should have 0 width
    const initialWidth = await bar.evaluate((el) => el.style.width);
    expect(initialWidth).toBe('0%');

    // Set value to 500,000 (50% of max 1,000,000)
    await valueInput.fill('500000');
    await page.waitForTimeout(100);

    // Verify bar width is now 50%
    const newWidth = await bar.evaluate((el) => el.style.width);
    expect(newWidth).toBe('50%');

    // Verify slider and input are in sync
    const sliderValue = await slider.inputValue();
    expect(sliderValue).toBe('500000');
  });

  test('setting LTCG updates the bar width', async ({ page }) => {
    const valueInput = page.locator('#ltcg-value');
    const slider = page.locator('#ltcg');
    const bar = page.locator('#ltcg-bar');

    // Initially, bar should have 0 width
    const initialWidth = await bar.evaluate((el) => el.style.width);
    expect(initialWidth).toBe('0%');

    // Set value to 250,000 (25% of max 1,000,000)
    await valueInput.fill('250000');
    await page.waitForTimeout(100);

    // Verify bar width is now 25%
    const newWidth = await bar.evaluate((el) => el.style.width);
    expect(newWidth).toBe('25%');

    // Verify slider and input are in sync
    const sliderValue = await slider.inputValue();
    expect(sliderValue).toBe('250000');
  });

  test('setting both values updates both bars and total income', async ({ page }) => {
    // Set regular income to 200,000 (20%)
    await page.locator('#regular-income-value').fill('200000');
    await page.waitForTimeout(100);

    // Set LTCG to 300,000 (30%)
    await page.locator('#ltcg-value').fill('300000');
    await page.waitForTimeout(100);

    // Verify regular income bar is 20%
    const regularBarWidth = await page.locator('#regular-income-bar').evaluate((el) => el.style.width);
    expect(regularBarWidth).toBe('20%');

    // Verify LTCG bar is 30%
    const ltcgBarWidth = await page.locator('#ltcg-bar').evaluate((el) => el.style.width);
    expect(ltcgBarWidth).toBe('30%');

    // Verify total income
    const totalIncome = await page.locator('#total-income').textContent();
    expect(totalIncome).toBe('$500,000');
  });

  test('sliders update when programmatically changed', async ({ page }) => {
    const regularSlider = page.locator('#regular-income');
    const regularBar = page.locator('#regular-income-bar');

    // Programmatically set the slider value
    await regularSlider.evaluate((el: HTMLInputElement) => {
      el.value = '750000';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await page.waitForTimeout(100);

    // Verify bar width is 75%
    const barWidth = await regularBar.evaluate((el) => el.style.width);
    expect(barWidth).toBe('75%');

    // Verify input was updated
    const inputValue = await page.locator('#regular-income-value').inputValue();
    expect(inputValue).toBe('750000');
  });
});
