
import { test, expect } from '@playwright/test';

test.describe('Campus Lost and Found - Admin E2E Tests', () => {

  // Test 1: Restrict unauthenticated users from admin routes
  test('should restrict unauthenticated users from admin routes', async ({ page }) => {
    await page.goto('/admin/flagged-reports');

    await expect(
      page.getByRole('heading', { name: 'Admin Clearance Required' })
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: 'Switch to Admin Preview Role',
      })
    ).toBeVisible();
  });

  // Test 2: Allow guest to enter admin preview mode
  test('should allow guest to enter admin preview mode', async ({ page }) => {
    await page.goto('/admin/flagged-reports');

    await page.getByRole('button', {
      name: 'Switch to Admin Preview Role',
    }).click();

    await expect(
      page.getByRole('heading', {
        name: 'Flagged Content Moderation Queue',
      })
    ).toBeVisible();

    await expect(page).toHaveURL(/\/admin\/flagged-reports/);
  });

  // Test 3: Handle unavailable moderation queue
  test('should display backend error when moderation queue is unavailable', async ({ page }) => {
    await page.goto('/admin/flagged-reports');

    await page.getByRole('button', {
      name: 'Switch to Admin Preview Role',
    }).click();

    await expect(
      page.getByRole('heading', {
        name: 'Moderation Access Error',
      })
    ).toBeVisible();

    await expect(
      page.getByText(
        'The moderation queue is not yet supported by the backend.'
      )
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Retry' })
    ).toBeVisible();
  });

  // Test 4: Display existing mock report for review
  test('should display an existing mock report for administrative review', async ({ page }) => {
    await page.goto('/admin/review/clf-101');

    await page.getByRole('button', {
      name: 'Switch to Admin Preview Role',
    }).click();

    await expect(
      page.getByRole('heading', {
        name: 'Silver Dell XPS 15 Laptop in Black Sleeve',
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText(/The specified table number does not exist/)
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: 'Delist & Remove Report',
      })
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: 'Dismiss Flag & Retain Listing',
      })
    ).toBeVisible();
  });

  // Test 5: Handle moderation decision failure
  test('should handle moderation decision failure from unsupported backend', async ({ page }) => {
    await page.goto('/admin/review/clf-101');

    await page.getByRole('button', {
      name: 'Switch to Admin Preview Role',
    }).click();

    await expect(
      page.getByRole('button', {
        name: 'Delist & Remove Report',
      })
    ).toBeVisible();

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain(
        'Flag moderation is not yet supported by the backend.'
      );

      await dialog.accept();
    });

    await page.getByRole('button', {
      name: 'Delist & Remove Report',
    }).click();

    await expect(
      page.getByRole('button', {
        name: 'Delist & Remove Report',
      })
    ).toBeEnabled();
  });

});
