import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/e2e');
});

test('supports the complete slider keyboard model and focus re-entry', async ({
  page,
}) => {
  const slider = page.getByRole('slider', { name: 'Star rating' });
  await slider.focus();
  await page.keyboard.press('ArrowUp');
  await expect(slider).toHaveAttribute('aria-valuenow', '1.5');
  await page.keyboard.press('ArrowDown');
  await expect(slider).toHaveAttribute('aria-valuenow', '1');
  await page.keyboard.press('End');
  await expect(slider).toHaveAttribute('aria-valuenow', '5');
  await page.keyboard.press('Home');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');

  await page.getByRole('button', { name: 'Next control' }).focus();
  await slider.focus();
  await expect(slider).toBeFocused();
  await expect(slider).toHaveAttribute('tabindex', '0');
});

test('prevents browser defaults for handled slider keys', async ({ page }) => {
  const slider = page.getByRole('slider', { name: 'Star rating' });
  await page.evaluate(() => {
    document.addEventListener('keydown', (event) => {
      document.body.dataset.defaultPrevented = String(event.defaultPrevented);
    });
  });

  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('body')).toHaveAttribute(
    'data-default-prevented',
    'true',
  );
});

test('selects pointer halves and does not submit the click again on blur', async ({
  page,
}) => {
  const slider = page.getByRole('slider', { name: 'Star rating' });
  const thirdStar = slider.locator('svg').nth(2);
  const box = await thirdStar.boundingBox();
  expect(box).not.toBeNull();

  await slider.focus();
  await page.mouse.click(box!.x + box!.width * 0.25, box!.y + box!.height / 2);
  await expect(page.getByTestId('rating-value')).toHaveText('2.5');
  await page.getByRole('button', { name: 'Next control' }).focus();
  await expect(page.getByTestId('change-count')).toHaveText('1');

  await page.mouse.click(box!.x + box!.width * 0.75, box!.y + box!.height / 2);
  await expect(page.getByTestId('rating-value')).toHaveText('3');
});

test('touch selects a half star', async ({ page }) => {
  const thirdStar = page
    .getByRole('slider', { name: 'Star rating' })
    .locator('svg')
    .nth(2);
  const box = await thirdStar.boundingBox();
  expect(box).not.toBeNull();

  await page.touchscreen.tap(
    box!.x + box!.width * 0.25,
    box!.y + box!.height / 2,
  );
  await expect(page.getByTestId('rating-value')).toHaveText('2.5');
});

test('read-only mode wins over isArrowSubmit', async ({ page }) => {
  const slider = page.getByRole('slider', { name: 'Read-only rating' });
  await expect(slider).toHaveAttribute('aria-readonly', 'true');
  await expect(slider).toHaveAttribute('tabindex', '-1');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuenow', '4');
});

test('integrates with a controlled HTML form', async ({ page }) => {
  const slider = page.getByRole('slider', { name: 'Form rating' });
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Submit rating' }).click();
  await expect(page.getByTestId('submitted-rating')).toHaveText('3');
});

for (const story of [
  'default',
  'read-only',
  'arrow-submit',
  'custom-palette',
]) {
  test(`Storybook ${story} state is accessible and interactive`, async ({
    page,
  }) => {
    await page.goto(
      `http://127.0.0.1:6006/iframe.html?id=components-reactstarsrating--${story}&viewMode=story`,
    );
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include('#storybook-root')
      .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
      .analyze();
    expect(results.violations).toEqual([]);

    if (story === 'read-only') {
      await expect(slider).toHaveAttribute('aria-readonly', 'true');
      await expect(slider).toHaveAttribute('tabindex', '-1');
    } else {
      await slider.focus();
      await page.keyboard.press('ArrowRight');
      await expect(slider).toHaveAttribute('aria-readonly', 'false');
    }
  });
}
