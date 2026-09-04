import { expect, test, type Page } from '@playwright/test';

const expectNoPageOverflow = async (page: Page) => {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          Math.max(
            document.documentElement.scrollWidth,
            document.body.scrollWidth,
          ) - document.documentElement.clientWidth,
      ),
    )
    .toBeLessThanOrEqual(1);
};

for (const width of [320, 360, 390, 430, 768, 1024, 1280]) {
  test(`demo fits a ${width}px viewport without horizontal page scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    // Wait for the lazy form examples too: they must not introduce overflow.
    await expect(
      page.getByRole('heading', { name: 'TanStack Form', exact: true }),
    ).toBeVisible();
    await expectNoPageOverflow(page);
    const heroFits = await page.locator('#hero').evaluate((el) => {
      const rating = el.getBoundingClientRect();
      const card = el.parentElement!.getBoundingClientRect();
      return rating.left >= card.left && rating.right <= card.right;
    });
    expect(heroFits).toBe(true);
    const code = page.locator('header pre');
    // Long code remains scrollable inside its panel, not outside the page.
    expect(
      await code.evaluate(
        (el) => el.ownerDocument.defaultView!.getComputedStyle(el).overflowX,
      ),
    ).toBe('auto');
    expect(errors).toEqual([]);
  });
}

test('maximum playground settings scroll inside the preview and keep every star reachable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const label of ['Stars', 'Size', 'Gap']) {
    await page
      .getByRole('slider', { name: new RegExp(`^${label} `) })
      .press('End');
  }
  const rating = page.locator('#playground');
  const preview = page.getByTestId('rating-preview-scroll');
  await expect(rating).toHaveAttribute('aria-valuemax', '10');
  await expectNoPageOverflow(page);
  expect(await preview.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(
    true,
  );
  await rating
    .locator('svg')
    .last()
    .click({ position: { x: 60, y: 36 } });
  await expect(rating).toHaveAttribute('aria-valuenow', '10');
  expect(await preview.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await expectNoPageOverflow(page);
  await page.getByRole('button', { name: 'Ocean', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Ocean', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('phone touch selects half stars and normal page scrolling remains available', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === 'firefox',
    'Playwright Firefox does not emulate touch',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const rating = page.locator('#playground');
  const third = rating.locator('svg').nth(2);
  await third.scrollIntoViewIfNeeded();
  const box = (await third.boundingBox())!;
  await page.touchscreen.tap(box.x + box.width * 0.25, box.y + box.height / 2);
  await expect(rating).toHaveAttribute('aria-valuenow', '2.5');
  await expectNoPageOverflow(page);
  const previousScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 400);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(previousScroll);
});

test('Storybook starts responsive on phones and its mobile menu works', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    'http://127.0.0.1:6006/?path=/story/components-reactstarsrating--default',
  );
  const frame = page.locator('#storybook-preview-iframe');
  const rating = page
    .frameLocator('#storybook-preview-iframe')
    .getByRole('slider');
  await expect(rating).toBeVisible();
  await expect
    .poll(async () => (await frame.boundingBox())!.width)
    .toBeLessThanOrEqual(390);
  await expectNoPageOverflow(page);
  await rating.press('End');
  await expect(rating).toHaveAttribute('aria-valuenow', '5');
  await page
    .getByRole('button', { name: 'Open navigation menu', exact: true })
    .click();
  await expect(
    page
      .getByRole('dialog', { name: 'Menu', exact: true })
      .getByRole('button', { name: 'Close menu', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Read Only', exact: true }).click();
  await expect(
    page.frameLocator('#storybook-preview-iframe').getByRole('slider'),
  ).toHaveAttribute('aria-readonly', 'true');
});
