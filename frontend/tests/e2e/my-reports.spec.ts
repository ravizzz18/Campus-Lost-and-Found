
import { test, expect } from '@playwright/test';

const testPassword = 'CampusTest123!';

test.describe('My Reports - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Generate a unique email for every test
    const testEmail = `myreports.${Date.now()}.${Math.random()
      .toString(36)
      .slice(2)}@example.com`;

    await page.goto('/register');

    await page.getByLabel('Full Name').fill('My Reports Test Student');
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

    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/my-reports');
  });

  test('should display the My Reports page', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'My Filings & Reports' })
    ).toBeVisible();
  });

  test('should display the report filters', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /All Filings/ })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Active Lost/ })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Active Found/ })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Resolved/ })
    ).toBeVisible();
  });

  test('should show the empty state for a new account', async ({ page }) => {
    await expect(
      page.getByText('No filings found in this tab')
    ).toBeVisible();
  });

  test('should provide links to create Lost and Found reports', async ({ page }) => {
    await expect(
      page.getByRole('main').getByRole('link', { name: 'Report Lost' })
    ).toBeVisible();

    await expect(
      page.getByRole('main').getByRole('link', { name: 'Report Found' })
    ).toBeVisible();
  });

  test('should navigate to the Report Lost page', async ({ page }) => {
    await page.getByRole('main').getByRole('link', {
      name: 'Report Lost'
    }).click();

    await expect(page).toHaveURL(/\/report-lost/);
  });

  test('should navigate to the Report Found page', async ({ page }) => {
    await page.getByRole('main').getByRole('link', {
      name: 'Report Found'
    }).click();

    await expect(page).toHaveURL(/\/report-found/);
  });
});
