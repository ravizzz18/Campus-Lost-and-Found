
import { test, expect } from '@playwright/test';

const testPassword = 'CampusTest123!';

test.describe('Report Lost - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Create a unique account for each test
    const testEmail = `reportlost.${Date.now()}.${Math.random()
      .toString(36)
      .slice(2)}@example.com`;

    await page.goto('/register');

    await page.getByLabel('Full Name').fill('Report Lost Test Student');
    await page.getByLabel('Email Address').fill(testEmail);
    await page.getByLabel('Contact Phone Number').fill('9876543210');
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);

    const registrationPromise = page.waitForResponse(
      response =>
        response.url().includes('/api/auth/register') &&
        response.request().method() === 'POST'
    );

    await page.getByRole('button', {
      name: 'Complete Registration'
    }).click();

    const registrationResponse = await registrationPromise;

    expect(
      registrationResponse.status(),
      `Registration failed: ${await registrationResponse.text()}`
    ).toBe(201);

    await expect(page).toHaveURL(/dashboard/);
    await page.goto('/report-lost');
  });

  test('should display the Report Lost page', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Report a Lost Item' })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Publish Lost Report' })
    ).toBeVisible();
  });

  test('should reject a title shorter than 3 characters', async ({ page }) => {
    await page.getByLabel('Item Name / Title').fill('AB');

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
    await page.getByLabel('Item Name / Title').fill('Lost Wallet');
    await page.locator('textarea').fill('Small text');

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
    await page.getByLabel('Item Name / Title').fill('Black Laptop');
    await page.locator('textarea').fill(
      'Black laptop with a silver sticker on the back.'
    );

    await expect(
      page.getByLabel('Item Name / Title')
    ).toHaveValue('Black Laptop');

    await expect(page.locator('textarea')).toHaveValue(
      'Black laptop with a silver sticker on the back.'
    );
  });
});
