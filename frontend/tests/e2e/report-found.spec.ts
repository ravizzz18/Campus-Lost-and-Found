
import { test, expect } from '@playwright/test';

const testPassword = 'CampusTest123!';

test.describe('Report Found - E2E Tests', () => {
  test.beforeEach(async ({ page, request }) => {
    const email = `e2e.found.${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com`;

    // Register a fresh student account through the backend.
    const registration = await request.post(
      'http://127.0.0.1:8000/api/auth/register',
      {
        data: {
          full_name: 'Found Item Test Student',
          email,
          password: testPassword,
        },
      }
    );

    expect(registration.status()).toBe(201);

    // Log in through the frontend.
    await page.goto('/login');

    await page.getByLabel('Campus / Registered Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);

    await page.getByRole('button', {
      name: 'Sign In to Campus Directory',
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

    // Fill the required description to allow form submission.
    await page.locator('textarea').fill(
      'Found near the central library entrance.'
    );

    await page.getByRole('button', {
      name: 'Publish Found Report',
    }).click();

    await expect(
      page.getByText('Item title must be at least 3 characters long.')
    ).toBeVisible();
  });

  test('should reject a description shorter than 15 characters', async ({ page }) => {
    await page.getByLabel('Item Name / Summary').fill('Found Keys');

    await page.locator('textarea').fill('Short text');

    await page.getByRole('button', {
      name: 'Publish Found Report',
    }).click();

    await expect(
      page.getByText(/minimum 15 characters/)
    ).toBeVisible();
  });

  test('should allow filling the report form', async ({ page }) => {
    await page.getByLabel('Item Name / Summary').fill(
      'Blue University Keys'
    );

    await page.locator('textarea').fill(
      'Found near the central library entrance.'
    );

    await expect(
      page.getByLabel('Item Name / Summary')
    ).toHaveValue('Blue University Keys');

    await expect(
      page.locator('textarea')
    ).toHaveValue('Found near the central library entrance.');

    await expect(
      page.getByRole('button', { name: 'Publish Found Report' })
    ).toBeVisible();
  });
});
