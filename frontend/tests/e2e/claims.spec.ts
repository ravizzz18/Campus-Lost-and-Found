
import { test, expect } from '@playwright/test';

const testPassword = 'CampusTest123!';

test.describe('Claims - E2E Tests', () => {
  let itemId: number;
  let itemTitle: string;

  test.beforeEach(async ({ page, request }) => {
    const uniqueId = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    const ownerEmail = `e2e.owner.${uniqueId}@example.com`;
    const claimantEmail = `e2e.claimant.${uniqueId}@example.com`;

    // Register the item owner.
    const ownerRegistration = await request.post(
      'http://127.0.0.1:8000/api/auth/register',
      {
        data: {
          full_name: 'Found Item Owner',
          email: ownerEmail,
          password: testPassword,
        },
      }
    );

    expect(ownerRegistration.status()).toBe(201);

    // Register the student who will claim the item.
    const claimantRegistration = await request.post(
      'http://127.0.0.1:8000/api/auth/register',
      {
        data: {
          full_name: 'Ownership Claimant',
          email: claimantEmail,
          password: testPassword,
        },
      }
    );

    expect(claimantRegistration.status()).toBe(201);

    // Authenticate the owner through the backend.
    const ownerLogin = await request.post(
      'http://127.0.0.1:8000/api/auth/login',
      {
        form: {
          username: ownerEmail,
          password: testPassword,
        },
      }
    );

    expect(ownerLogin.ok()).toBeTruthy();

    const ownerToken = (await ownerLogin.json()).access_token;

    // Create a real Found item using the correct endpoint.
    itemTitle = `E2E Found Item ${uniqueId}`;

    const itemResponse = await request.post(
      'http://127.0.0.1:8000/api/found-items',
      {
        headers: {
          Authorization: `Bearer ${ownerToken}`,
        },
        data: {
          item_name: itemTitle,
          description: 'Found near the central library entrance.',
          category: 'electronics',
          location: 'Central Library',
          report_type: 'Found',
          report_date: new Date().toISOString(),
        },
      }
    );

    // Include the backend response if item creation fails.
    const responseBody = await itemResponse.text();

    expect(
      itemResponse.status(),
      `Found item creation failed: ${responseBody}`
    ).toBe(201);

    const item = JSON.parse(responseBody);
    itemId = item.item_id;

    // Log in as the separate claimant through the frontend.
    await page.goto('/login');

    await page.getByLabel('Campus / Registered Email')
      .fill(claimantEmail);

    await page.getByLabel('Password', { exact: true })
      .fill(testPassword);

    await page.getByRole('button', {
      name: 'Sign In to Campus Directory',
    }).click();

    await expect(page).toHaveURL(/dashboard/);

    // Open the actual Found item.
    await page.goto(`/item/${itemId}`);
  });

  test('should display the Claim This Item button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Claim This Item' })
    ).toBeVisible();
  });

  test('should open the ownership claim dialog', async ({ page }) => {
    await page.getByRole('button', {
      name: 'Claim This Item',
    }).click();

    await expect(
      page.getByRole('heading', { name: 'Claim Ownership' })
    ).toBeVisible();

    await expect(
      page.getByPlaceholder(/Describe the item/)
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Submit Claim' })
    ).toBeDisabled();
  });

  test('should submit a valid ownership claim', async ({ page }) => {
    await page.getByRole('button', {
      name: 'Claim This Item',
    }).click();

    await page.getByPlaceholder(/Describe the item/)
      .fill(
        'This is my laptop. It has a unique blue sticker and my initials.'
      );

    await page.getByRole('button', {
      name: 'Submit Claim',
    }).click();

    await expect(
      page.getByText(
        'Your ownership claim has been submitted successfully. You can track its status under My Claims.'
      )
    ).toBeVisible();

    // Verify the submitted claim appears in My Claims.
    await page.goto('/my-claims');

    await expect(
      page.getByRole('heading', { name: 'My Claims' })
    ).toBeVisible();

    await expect(
      page.getByText(itemTitle)
    ).toBeVisible();

    await expect(
      page.getByText('PENDING', { exact: true })
    ).toBeVisible();
  });

  test('should allow cancelling the ownership claim dialog', async ({ page }) => {
    await page.getByRole('button', {
      name: 'Claim This Item',
    }).click();

    await expect(
      page.getByRole('heading', { name: 'Claim Ownership' })
    ).toBeVisible();

    await page.getByRole('button', {
      name: 'Cancel',
    }).click();

    await expect(
      page.getByRole('heading', { name: 'Claim Ownership' })
    ).not.toBeVisible();
  });
});
