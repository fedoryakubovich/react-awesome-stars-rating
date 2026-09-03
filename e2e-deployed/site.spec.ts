import { expect, test } from '@playwright/test';

test('public demo loads and its rating is interactive', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'star rating',
  );
  const slider = page.locator('#playground');
  await expect(slider).toHaveAttribute('aria-valuenow', '3.5');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(slider).toHaveAttribute('aria-valuenow', '4');
  expect(errors).toEqual([]);
});

test('public Storybook loads a real story and its assets', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(
    '/storybook/?path=/story/components-reactstarsrating--default',
  );
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('navigation', { name: 'Stories' })).toBeVisible();
  const slider = page
    .frameLocator('#storybook-preview-iframe')
    .getByRole('slider');
  await expect(slider).toBeVisible();
  await slider.focus();
  await page.keyboard.press('End');
  await expect(slider).toHaveAttribute('aria-valuenow', '5');
  expect(errors).toEqual([]);
});
