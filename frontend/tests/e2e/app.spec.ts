
import { test, expect } from '@playwright/test';

const testEmail = `e2e.student.${Date.now()}@example.com`;
const testPassword = 'CampusTest123!';

test.describe('Campus Lost and Found - E2E Tests', () => {
  test('should load the application homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display the login page', async ({ page }) => {
    await page.goto('/login');
    await expect(
      page.getByRole('heading', { name: 'Sign in to Campus Portal' })
    ).toBeVisible();
  });

  test('should display the registration page', async ({ page }) => {
    await page.goto('/register');
    await expect(
      page.getByRole('heading', { name: 'Create Campus Account' })
    ).toBeVisible();
  });

  test('should register a new student using the real backend', async ({ page, request }) => {
    await page.goto('/register');

    await page.getByLabel('Full Name').fill('E2E Test Student');
    await page.getByLabel('Email Address').fill(testEmail);
    await page.getByLabel('Contact Phone Number').fill('9876543210');
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);

    const registrationPromise = page.waitForResponse(
      response =>
        response.url().includes('/api/auth/register') &&
        response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: 'Complete Registration' }).click();

    const registrationResponse = await registrationPromise;
    expect(registrationResponse.status()).toBe(201);

    await expect(page).toHaveURL(/\/dashboard/);

    const token = await page.evaluate(() =>
      localStorage.getItem('clf_auth_token')
    );

    expect(token).toBeTruthy();

    const profileResponse = await request.get(
      'http://127.0.0.1:8000/api/auth/me',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    expect(profileResponse.status()).toBe(200);

    const user = await profileResponse.json();
    expect(user.email).toBe(testEmail);
    expect(user.role).toBe('student');
  });

  test('should login using the registered backend account', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Campus / Registered Email').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);

    const loginPromise = page.waitForResponse(
      response =>
        response.url().includes('/api/auth/login') &&
        response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: 'Sign In to Campus Directory' }).click();

    const loginResponse = await loginPromise;
    expect(loginResponse.status()).toBe(200);

    await expect(page).toHaveURL(/\/dashboard/);

    const token = await page.evaluate(() =>
      localStorage.getItem('clf_auth_token')
    );

    expect(token).toBeTruthy();
  });

  test('should reject an incorrect password', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Campus / Registered Email').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill('WrongPassword123!');

    const loginPromise = page.waitForResponse(
      response =>
        response.url().includes('/api/auth/login') &&
        response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: 'Sign In to Campus Directory' }).click();

    const loginResponse = await loginPromise;
    expect(loginResponse.status()).toBe(401);

    await expect(
      page.getByText('Invalid email or password')
    ).toBeVisible();
  });

  test('should logout and revoke the backend token', async ({ page, request }) => {
    // Log in with the account created by the registration test.
    await page.goto('/login');

    await page.getByLabel('Campus / Registered Email').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);

    await page.getByRole('button', { name: 'Sign In to Campus Directory' }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    const token = await page.evaluate(() =>
      localStorage.getItem('clf_auth_token')
    );

    expect(token).toBeTruthy();

    // Logout through the navbar.
    await page.getByTitle('Sign out').click();

    await expect(page).toHaveURL(/\/login\?redirect=/);

    // Confirm browser session is cleared.
    const storedToken = await page.evaluate(() =>
      localStorage.getItem('clf_auth_token')
    );

    const storedUser = await page.evaluate(() =>
      localStorage.getItem('clf_session_user')
    );

    expect(storedToken).toBeNull();
    expect(storedUser).toBeNull();

    // Confirm the backend has revoked the previous token.
    const profileResponse = await request.get(
      'http://127.0.0.1:8000/api/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(profileResponse.status()).toBe(401);

    // Confirm a logged-out user cannot access the dashboard.
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login\?redirect=/);

    console.log('Logout, token revocation and protected-route checks passed');
  });
});
