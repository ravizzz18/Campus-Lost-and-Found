
import { test, expect } from '@playwright/test';

const testPassword = 'CampusTest123!';
const testItemTitle = 'E2E Test Laptop';
const testDescription =
  'A silver laptop was left near the second floor study area.';

test.describe('Item Details - E2E Tests', () => {
  test.beforeEach(async ({ page, request }) => {
    const email = `e2e.item.${Date.now()}@example.com`;

    // Register a fresh test account.
    const registration = await request.post(
      'http://127.0.0.1:8000/api/auth/register',
      {
        data: {
          full_name: 'Item Details Test Student',
          email,
          password: testPassword,
        },
      }
    );

    expect(registration.status()).toBe(201);

    // Obtain a real backend token.
    const login = await request.post(
      'http://127.0.0.1:8000/api/auth/login',
      {
        form: {
          username: email,
          password: testPassword,
        },
      }
    );

    expect(login.ok()).toBeTruthy();

    const tokenData = await login.json();

    // Create a real Lost item through the API.
    const itemResponse = await request.post(
      'http://127.0.0.1:8000/api/items',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        data: {
          item_name: testItemTitle,
          description: testDescription,
          category: 'electronics',
          location: 'Central Library',
          report_type: 'Lost',
          report_date: new Date().toISOString(),
        },
      }
    );

    expect(itemResponse.status()).toBe(201);

    const item = await itemResponse.json();

    // Open the real item's public details page as a guest.
    await page.goto(`/item/${item.item_id}`);
  });

  test('should display the item details', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: testItemTitle })
    ).toBeVisible();

    await expect(
      page.getByText('Lost Item', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Central Library')
    ).toBeVisible();

    await expect(
      page.getByText(testDescription)
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
