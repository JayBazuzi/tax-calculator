import { test, expect } from '@playwright/test';

test.describe('Actual Drag Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#ordinary-brackets .bracket-label');
  });

  test('actually dragging the regular income slider updates values', async ({ page }) => {
    const slider = page.locator('#regular-income');
    const valueInput = page.locator('#regular-income-value');
    const bar = page.locator('#regular-income-bar');

    // Verify initial state
    await expect(slider).toHaveValue('0');
    await expect(valueInput).toHaveValue('0');

    // Get the slider bounding box
    const sliderBox = await slider.boundingBox();
    if (!sliderBox) throw new Error('Slider not found');

    console.log('Slider box:', sliderBox);

    // Drag from left edge to middle of slider
    const startX = sliderBox.x + 10;
    const startY = sliderBox.y + sliderBox.height / 2;
    const endX = sliderBox.x + sliderBox.width / 2;
    const endY = sliderBox.y + sliderBox.height / 2;

    console.log(`Dragging from (${startX}, ${startY}) to (${endX}, ${endY})`);

    // Perform drag
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 10 });
    await page.mouse.up();

    // Wait for updates
    await page.waitForTimeout(200);

    // Check final values
    const finalSliderValue = await slider.inputValue();
    const finalInputValue = await valueInput.inputValue();
    const finalBarWidth = await bar.evaluate((el) => el.style.width);

    console.log('Final slider value:', finalSliderValue);
    console.log('Final input value:', finalInputValue);
    console.log('Final bar width:', finalBarWidth);

    // Verify values changed
    expect(parseInt(finalSliderValue)).toBeGreaterThan(0);
    expect(finalSliderValue).toBe(finalInputValue);
  });

  test('clicking on slider at different positions', async ({ page }) => {
    const slider = page.locator('#regular-income');
    const valueInput = page.locator('#regular-income-value');

    const sliderBox = await slider.boundingBox();
    if (!sliderBox) throw new Error('Slider not found');

    // Click at 75% position
    const clickX = sliderBox.x + sliderBox.width * 0.75;
    const clickY = sliderBox.y + sliderBox.height / 2;

    console.log(`Clicking at (${clickX}, ${clickY})`);

    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(200);

    const sliderValue = await slider.inputValue();
    const inputValue = await valueInput.inputValue();

    console.log('After click - slider value:', sliderValue);
    console.log('After click - input value:', inputValue);

    expect(parseInt(sliderValue)).toBeGreaterThan(0);
    expect(sliderValue).toBe(inputValue);
  });
});
