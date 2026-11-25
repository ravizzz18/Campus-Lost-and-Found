
import { test, expect } from '@playwright/test';

test.describe('Item Details - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/item/clf-101');
  });

  test('should display the item details', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Silver Dell XPS 15 Laptop in Black Sleeve'
      })
    ).toBeVisible();

    await expect(page.getByText('Lost Item', { exact: true })).toBeVisible();
    await expect(page.getByText('Central Library')).toBeVisible();

    await expect(
      page.getByText(/Left on the 2nd floor silent study area/)
    ).toBeVisible();
  });

  test('should display the Back to Directory link', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /Back to Directory/ })
    ).toBeVisible();
  });

  test('should protect reporter contact information when logged out', async ({ page }) => {
    await expect(
      page.getByText('Campus Member Verification Required')
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'Sign in with Campus ID' })
    ).toBeVisible();

    await expect(page.getByText('+1 (555) 019-2834')).toHaveCount(0);
    await expect(page.getByText('alex.chen@campus.edu')).toHaveCount(0);
  });

  test('should show the login link when a guest tries to flag a listing', async ({ page }) => {
    await expect(
      page.getByText('Flag (Login required)')
    ).toBeVisible();
  });

  test('should show an error for a nonexistent report', async ({ page }) => {
    await page.goto('/item/nonexistent-999');

    await expect(
      page.getByRole('heading', { name: 'Listing Not Available' })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Back to Directory/ })
    ).toBeVisible();
  });
});
