#!/bin/bash

set -e

echo "============================================"
echo " CAMPUS LOST & FOUND - AUTH TESTING"
echo "============================================"

mkdir -p tests/e2e

cat > tests/e2e/auth.spec.ts <<'TESTEOF'
import { test, expect } from '@playwright/test';

const password = 'CampusTest123!';

async function fillRegistrationForm(
  page: import('@playwright/test').Page,
  overrides: Record<string, string> = {}
) {
  const values = {
    name: 'Authentication Test Student',
    email: `auth.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`,
    phone: '9876543210',
    password,
    confirmPassword: password,
    ...overrides,
  };

  await page.getByLabel('Full Name').fill(values.name);
  await page.getByLabel('Email Address').fill(values.email);
  await page.getByLabel('Contact Phone Number').fill(values.phone);
  await page.getByLabel('Password', { exact: true }).fill(values.password);
  await page.getByLabel('Confirm Password').fill(values.confirmPassword);

  return values;
}

test.describe('Authentication Functionality', () => {

  test('should navigate between login and registration pages', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', {
      name: 'Register your student or staff ID'
    }).click();

    await expect(page).toHaveURL(/\/register/);

    await page.getByRole('link', {
      name: 'Sign in here'
    }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  test('should reject registration with an invalid email format', async ({ page }) => {
    await page.goto('/register');

    await fillRegistrationForm(page, {
      email: 'invalid-email'
    });

    const email = page.getByLabel('Email Address');

    expect(
      await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)
    ).toBe(true);
  });

  test('should reject registration with an invalid phone number', async ({ page }) => {
    await page.goto('/register');

    await fillRegistrationForm(page, {
      phone: '123'
    });

    await page.getByRole('button', {
      name: 'Complete Registration'
    }).click();

    await expect(
      page.getByText('Please provide a valid contact phone number for item recovery.')
    ).toBeVisible();
  });

  test('should reject a password shorter than six characters', async ({ page }) => {
    await page.goto('/register');

    await fillRegistrationForm(page, {
      password: '12345',
      confirmPassword: '12345'
    });

    await page.getByRole('button', {
      name: 'Complete Registration'
    }).click();

    await expect(
      page.getByText('Password must contain at least 6 characters.')
    ).toBeVisible();
  });

  test('should reject mismatched passwords', async ({ page }) => {
    await page.goto('/register');

    await fillRegistrationForm(page, {
      confirmPassword: 'DifferentPassword123!'
    });

    await page.getByRole('button', {
      name: 'Complete Registration'
    }).click();

    await expect(
      page.getByText('Passwords do not match. Please re-enter.')
    ).toBeVisible();
  });

  test('should show and hide the login password', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByLabel('Password', { exact: true });

    await passwordInput.fill(password);

    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.getByRole('button', {
      name: 'Show password'
    }).click();

    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.getByRole('button', {
      name: 'Hide password'
    }).click();

    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show and hide registration passwords', async ({ page }) => {
    await page.goto('/register');

    const passwordInput = page.getByLabel('Password', { exact: true });

    await passwordInput.fill(password);

    await page.getByRole('button', {
      name: 'Show password'
    }).click();

    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.getByRole('button', {
      name: 'Hide password'
    }).click();

    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should preserve the requested redirect after login', async ({ page }) => {
    await page.goto('/login?redirect=/my-reports');

    await page.getByRole('button', {
      name: 'Student Demo'
    }).click();

    await expect(page).toHaveURL(/\/my-reports$/);
  });

  test('should persist the demo session after refreshing the page', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', {
      name: 'Student Demo'
    }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    const sessionBefore = await page.evaluate(() => ({
      user: localStorage.getItem('clf_session_user'),
      token: localStorage.getItem('clf_auth_token')
    }));

    expect(sessionBefore.user).toBeTruthy();
    expect(sessionBefore.token).toBeTruthy();

    await page.reload();

    const sessionAfter = await page.evaluate(() => ({
      user: localStorage.getItem('clf_session_user'),
      token: localStorage.getItem('clf_auth_token')
    }));

    expect(sessionAfter).toEqual(sessionBefore);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should clear demo session after logout', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', {
      name: 'Student Demo'
    }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByTitle('Sign out').click();

    await expect(page).toHaveURL(/\/login\?redirect=/);

    const session = await page.evaluate(() => ({
      user: localStorage.getItem('clf_session_user'),
      token: localStorage.getItem('clf_auth_token')
    }));

    expect(session.user).toBeNull();
    expect(session.token).toBeNull();
  });

});
TESTEOF

echo ""
echo "Authentication test file created."
echo ""

echo "========== STEP 1: TYPESCRIPT CHECK =========="
npm run typecheck

echo ""
echo "========== STEP 2: PRODUCTION BUILD =========="
npm run build

echo ""
echo "========== STEP 3: AUTHENTICATION TESTS =========="
npx playwright test -c playwright.config.ts tests/e2e/auth.spec.ts --workers=1 --reporter=list

echo ""
echo "========== STEP 4: BACKEND AVAILABILITY =========="

if curl -fsS http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
    echo "Backend is running."

    echo ""
    echo "========== STEP 5: COMPLETE E2E TEST SUITE =========="
    npm run test:e2e -- --workers=1 --reporter=list
else
    echo "Backend is not running on port 8000."
    echo "Focused authentication tests passed, but the full E2E suite was skipped."
    echo "Start your FastAPI backend and rerun this script for full verification."
fi

echo ""
echo "============================================"
echo " AUTHENTICATION TESTING SCRIPT COMPLETED"
echo "============================================"
