
import { test, expect } from '@playwright/test';

const testPassword = 'CampusTest123!';

test.describe('Contact Reveal - E2E Tests', () => {
  let itemId: number;
  let ownerEmail: string;
  let ownerPhone: string;

  test.beforeEach(async ({ page, request }) => {
    const uniqueId = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    ownerEmail = `contact.owner.${uniqueId}@example.com`;
    ownerPhone = '9876543210';

    const visitorEmail = `contact.visitor.${uniqueId}@example.com`;

    // Register the report owner.
    const ownerRegistration = await request.post(
      'http://127.0.0.1:8000/api/auth/register',
      {
        data: {
          full_name: 'Contact Test Owner',
          email: ownerEmail,
          password: testPassword,
        },
      }
    );

    expect(ownerRegistration.status()).toBe(201);

    // Register a separate authenticated visitor.
    const visitorRegistration = await request.post(
      'http://127.0.0.1:8000/api/auth/register',
      {
        data: {
          full_name: 'Contact Test Visitor',
          email: visitorEmail,
          password: testPassword,
        },
      }
    );

    expect(visitorRegistration.status()).toBe(201);

    // Log in as the owner to create a real Lost report.
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

    const itemResponse = await request.post(
      'http://127.0.0.1:8000/api/items',
      {
        headers: {
          Authorization: `Bearer ${ownerToken}`,
        },
        data: {
          item_name: `Contact Test Laptop ${uniqueId}`,
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
      `Report creation failed: ${responseBody}`
    ).toBe(201);

    const item = JSON.parse(responseBody);
    itemId = item.item_id;

    // Start as a guest.
    await page.goto(`/item/${itemId}`);

    await expect(
      page.getByText('Campus Member Verification Required')
    ).toBeVisible();
  });

  test('should protect contact details from guest users', async ({ page }) => {
    await expect(
      page.getByText('Campus Member Verification Required')
    ).toBeVisible();

    await expect(
      page.getByText(/reporter contact numbers are never exposed publicly/i)
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Reveal Contact Phone' })
    ).not.toBeVisible();
  });

  test('should display the campus sign-in button to guests', async ({ page }) => {
    const signInButton = page.getByRole('link', {
      name: 'Sign in with Campus ID',
    });

    await expect(signInButton).toBeVisible();

    await signInButton.click();

    await expect(page).toHaveURL(/login/);
  });

  test('should display Reveal Contact Phone after authentication', async ({
    page,
  }) => {
    // Register a separate authenticated visitor through the UI.
    const uniqueId = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    const visitorEmail = `contact.auth.${uniqueId}@example.com`;

    await page.goto('/register');

    await page.getByLabel('Full Name').fill('Authenticated Contact Visitor');
    await page.getByLabel('Email Address').fill(visitorEmail);
    await page.getByLabel('Contact Phone Number').fill('9876543211');
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

    expect(registrationResponse.status()).toBe(201);

    await expect(page).toHaveURL(/dashboard/);

    await page.goto(`/item/${itemId}`);

    await expect(
      page.getByText('Reporter Phone Number Protected')
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Reveal Contact Phone' })
    ).toBeVisible();
  });

  test('should display backend limitation when revealing contact details', async ({
    page,
  }) => {
    const uniqueId = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    const visitorEmail = `contact.reveal.${uniqueId}@example.com`;

    // Register an authenticated visitor.
    await page.goto('/register');

    await page.getByLabel('Full Name').fill('Contact Reveal Visitor');
    await page.getByLabel('Email Address').fill(visitorEmail);
    await page.getByLabel('Contact Phone Number').fill('9876543212');
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
    expect(registrationResponse.status()).toBe(201);

    await expect(page).toHaveURL(/dashboard/);

    await page.goto(`/item/${itemId}`);

    await page.getByRole('button', {
      name: 'Reveal Contact Phone',
    }).click();

    await expect(
      page.getByText(
        'Reporter contact retrieval is not yet supported by the backend.'
      )
    ).toBeVisible();

    // No contact details should be exposed after the failed request.
    await expect(
      page.getByText('Reporter Phone Number Protected')
    ).toBeVisible();

    await expect(
      page.getByText(ownerEmail, { exact: true })
    ).not.toBeVisible();

    await expect(
      page.getByText(ownerPhone, { exact: true })
    ).not.toBeVisible();
  });
});
