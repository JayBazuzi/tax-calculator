import { test, expect } from '@playwright/test';

test.describe('Visual Investigation', () => {
  test('verify bars grow when values are set', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#ordinary-brackets .bracket-label');

    // Take a screenshot of the whole page
    await page.screenshot({ path: 'test-results/initial-page.png', fullPage: true });

    // Check initial bar widths
    const regularBar = page.locator('#regular-income-bar');
    const ltcgBar = page.locator('#ltcg-bar');

    const initialRegularWidth = await regularBar.evaluate((el) => el.style.width);
    const initialLtcgWidth = await ltcgBar.evaluate((el) => el.style.width);

    console.log('Initial regular bar width:', initialRegularWidth);
    console.log('Initial LTCG bar width:', initialLtcgWidth);

    // Set regular income to 50% of max
    await page.locator('#regular-income-value').fill('500000');
    await page.waitForTimeout(200);

    // Take another screenshot after setting value
    await page.screenshot({ path: 'test-results/after-input.png', fullPage: true });

    // Check bar width after input
    const finalRegularWidth = await regularBar.evaluate((el) => el.style.width);
    console.log('Regular income bar after input:', finalRegularWidth);

    // Verify bar width changed to 50%
    expect(finalRegularWidth).toBe('50%');

    // Check if the slider value was updated
    const sliderValue = await page.locator('#regular-income').inputValue();
    console.log('Slider value after input:', sliderValue);

    // Verify the slider and input are synced
    expect(sliderValue).toBe('500000');
  });

  test('check slider visibility and compute styles', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#ordinary-brackets .bracket-label');

    // Get computed styles for the slider
    const sliderStyles = await page.locator('#regular-income').evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        opacity: computed.opacity,
        visibility: computed.visibility,
        display: computed.display,
        width: computed.width,
        height: computed.height,
        position: computed.position,
        zIndex: computed.zIndex,
      };
    });

    console.log('Slider computed styles:', sliderStyles);

    // Get computed styles for the bar
    const barStyles = await page.locator('#regular-income-bar').evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        width: computed.width,
        height: computed.height,
        position: computed.position,
      };
    });

    console.log('Bar computed styles:', barStyles);

    // Check if sliders are marked as visible by Playwright
    const isSliderVisible = await page.locator('#regular-income').isVisible();
    console.log('Is slider visible to Playwright:', isSliderVisible);
  });
});
