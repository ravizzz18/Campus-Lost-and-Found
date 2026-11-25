
import { test, expect } from '@playwright/test';

test.describe('Campus Lost and Found - Browse Items E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/browse');
  });

  test('should display the Browse Items page', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Browse Lost & Found Items' })
    ).toBeVisible();
  });

  test('should display the search input', async ({ page }) => {
    await expect(
      page.getByPlaceholder(/Search keywords/)
    ).toBeVisible();
  });

  test('should allow selecting Lost reports', async ({ page }) => {
    const select = page.locator('select').nth(0);
    await select.selectOption('lost');
    await expect(select).toHaveValue('lost');
  });

  test('should allow selecting Found reports', async ({ page }) => {
    const select = page.locator('select').nth(0);
    await select.selectOption('found');
    await expect(select).toHaveValue('found');
  });

  test('should allow selecting a category', async ({ page }) => {
    const select = page.locator('select').nth(1);
    await select.selectOption('electronics');
    await expect(select).toHaveValue('electronics');
  });

  test('should allow changing sort order', async ({ page }) => {
    const select = page.locator('select').nth(3);
    await select.selectOption('oldest');
    await expect(select).toHaveValue('oldest');
  });

  test('should allow searching for an item', async ({ page }) => {
    const search = page.getByPlaceholder(/Search keywords/);
    await search.fill('wallet');
    await expect(search).toHaveValue('wallet');
  });
});
