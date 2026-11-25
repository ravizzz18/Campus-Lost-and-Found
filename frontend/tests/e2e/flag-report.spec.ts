
import { test, expect } from '@playwright/test';

const testPassword = 'CampusTest123!';

test.describe('Flag Report - E2E Tests', () => {
  let itemId: number;

  test.beforeEach(async ({ page, request }) => {
    const uniqueId = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    const ownerEmail = `flag.owner.${uniqueId}@example.com`;
    const visitorEmail = `flag.visitor.${uniqueId}@example.com`;

    // Register the item owner through the backend.
    const ownerRegistration = await request.post(
      'http://127.0.0.1:8000/api/auth/register',
      {
        data: {
          full_name: 'Flag Test Owner',
          email: ownerEmail,
          password: testPassword,
        },
      }
    );

    expect(
      ownerRegistration.status(),
      `Owner registration failed: ${await ownerRegistration.text()}`
    ).toBe(201);

    // Authenticate the owner.
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

    // Create a real Lost item.
    const itemResponse = await request.post(
      'http://127.0.0.1:8000/api/items',
      {
        headers: {
          Authorization: `Bearer ${ownerToken}`,
        },
        data: {
          item_name: `Flag Test Laptop ${uniqueId}`,
          description: 'Black laptop with a blue identification sticker.',
          category: 'electronics',
          location: 'Central Library',
          report_type: 'Lost',
          report_date: new Date().toISOString(),
        },
      }
    );

    const responseBody = await itemResponse.text();

    expect(
      itemResponse.status(),
      `Item creation failed: ${responseBody}`
    ).toBe(201);

    itemId = JSON.parse(responseBody).item_id;

    // Register the visitor exactly once through the frontend.
    await page.goto('/register');

    await page.getByLabel('Full Name').fill('Flag Test Visitor');
    await page.getByLabel('Email Address').fill(visitorEmail);
    await page.getByLabel('Contact Phone Number').fill('9876543210');
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);

    const registrationPromise = page.waitForResponse(
      response =>
        response.url().includes('/api/auth/register') &&
        response.request().method() === 'POST'
    );

    await page.getByRole('button', {
      name: 'Complete Registration',
    }).click();

    const registrationResponse = await registrationPromise;

    expect(
      registrationResponse.status(),
      `Visitor registration failed: ${await registrationResponse.text()}`
    ).toBe(201);

    await expect(page).toHaveURL(/dashboard/);

    // Open the actual Lost item as an authenticated visitor.
    await page.goto(`/item/${itemId}`);
  });

  test('should open the Flag Report dialog', async ({ page }) => {
    await page.getByRole('button', {
      name: 'Flag Listing',
    }).click();

    await expect(
      page.getByRole('heading', {
        name: `Flag Report #${itemId}`,
      })
    ).toBeVisible();

    await expect(
      page.getByText('Reason for Flagging')
    ).toBeVisible();

    await expect(
      page.getByPlaceholder(/Provide context/)
    ).toBeVisible();
  });

  test('should allow selecting different flag reasons', async ({ page }) => {
    await page.getByRole('button', {
      name: 'Flag Listing',
    }).click();

    const reasonSelect = page.locator('select').last();

    await reasonSelect.selectOption('spam');
    await expect(reasonSelect).toHaveValue('spam');

    await reasonSelect.selectOption('fraud');
    await expect(reasonSelect).toHaveValue('fraud');

    await reasonSelect.selectOption('inappropriate_content');
    await expect(reasonSelect).toHaveValue('inappropriate_content');
  });

  test('should disable Submit Flag until details are entered', async ({
    page,
  }) => {
    await page.getByRole('button', {
      name: 'Flag Listing',
    }).click();

    const submitButton = page.getByRole('button', {
      name: 'Submit Flag',
    });

    await expect(submitButton).toBeDisabled();

    await page.getByPlaceholder(/Provide context/)
      .fill('This report contains misleading information.');

    await expect(submitButton).toBeEnabled();
  });

  test('should show backend failure when submitting a flag', async ({
    page,
  }) => {
    await page.getByRole('button', {
      name: 'Flag Listing',
    }).click();

    await page.getByPlaceholder(/Provide context/)
      .fill('This report contains misleading information.');

    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe(
        'Failed to submit flag. Please try again.'
      );

      await dialog.accept();
    });

    await page.getByRole('button', {
      name: 'Submit Flag',
    }).click();

    await expect(
      page.getByRole('heading', {
        name: `Flag Report #${itemId}`,
      })
    ).toBeVisible();
  });

  test('should close the flag dialog when Cancel is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', {
      name: 'Flag Listing',
    }).click();

    await expect(
      page.getByRole('heading', {
        name: `Flag Report #${itemId}`,
      })
    ).toBeVisible();

    await page.getByRole('button', {
      name: 'Cancel',
    }).click();

    await expect(
      page.getByRole('heading', {
        name: `Flag Report #${itemId}`,
      })
    ).not.toBeVisible();
  });
});
