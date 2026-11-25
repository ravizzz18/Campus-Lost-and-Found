
import { test, expect } from '@playwright/test';

test.describe('Report Found - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Campus / Registered Email')
      .fill('created_at_test_2026@example.com');

    await page.getByLabel('Password', { exact: true })
      .fill('TestPassword123!');

    await page.getByRole('button', {
      name: 'Sign In to Campus Directory'
    }).click();

    await expect(page).toHaveURL(/dashboard/);
    await page.goto('/report-found');
  });

  test('should display the Report Found page', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Report a Found Item' })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Publish Found Report' })
    ).toBeVisible();
  });

  test('should reject a title shorter than 3 characters', async ({ page }) => {
    await page.getByLabel('Item Name / Summary').fill('AB');

    await page.locator('form').evaluate((form: HTMLFormElement) => {
      form.dispatchEvent(new Event('submit', {
        bubbles: true,
        cancelable: true
      }));
    });

    await expect(
      page.getByText('Item title must be at least 3 characters long.')
    ).toBeVisible();
  });

  test('should reject a description shorter than 15 characters', async ({ page }) => {
    await page.getByLabel('Item Name / Summary').fill('Found Keys');
    await page.locator('textarea').fill('Short text');

    await page.locator('form').evaluate((form: HTMLFormElement) => {
      form.dispatchEvent(new Event('submit', {
        bubbles: true,
        cancelable: true
      }));
    });

    await expect(
      page.getByText(/minimum 15 characters/)
    ).toBeVisible();
  });

  test('should allow filling the report form', async ({ page }) => {
    await page.getByLabel('Item Name / Summary')
      .fill('Blue University Keys');

    await page.locator('textarea').fill(
      'Found near the central library entrance.'
    );

    await expect(
      page.getByLabel('Item Name / Summary')
    ).toHaveValue('Blue University Keys');

    await expect(page.locator('textarea')).toHaveValue(
      'Found near the central library entrance.'
    );

    await expect(page.locator('select').nth(2))
      .toHaveValue('With Reporter (Handover on Campus)');
  });
});
