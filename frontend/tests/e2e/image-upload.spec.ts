
import { test, expect } from '@playwright/test';

const testPassword = 'CampusTest123!';

// A valid, tiny 1x1 PNG image.
const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jXioAAAAASUVORK5CYII=',
  'base64'
);

test.describe('Image Upload - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    const testEmail = `imageupload.${Date.now()}.${Math.random()
      .toString(36)
      .slice(2)}@example.com`;

    // Register a unique student account.
    await page.goto('/register');

    await page.getByLabel('Full Name').fill('Image Upload Test Student');
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
      name: 'Complete Registration',
    }).click();

    const registrationResponse = await registrationPromise;

    expect(
      registrationResponse.status(),
      `Registration failed: ${await registrationResponse.text()}`
    ).toBe(201);

    await expect(page).toHaveURL(/dashboard/);

    await page.goto('/report-lost');
  });

  test('should upload a valid PNG and display its preview', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    await expect(
      page.getByRole('img', { name: 'Preview' })
    ).toBeVisible();

    await expect(
      page.getByTitle('Remove photo')
    ).toBeVisible();
  });

  test('should reject an unsupported file format', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles({
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('This is a test PDF file'),
    });

    await expect(
      page.getByText(
        'Please upload an image file (JPEG, PNG, or WebP).'
      )
    ).toBeVisible();

    await expect(
      page.getByRole('img', { name: 'Preview' })
    ).not.toBeVisible();
  });

  test('should reject an image larger than 5 MB', async ({ page }) => {
    const oversizedImage = Buffer.alloc(5 * 1024 * 1024 + 1);

    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles({
      name: 'large-image.png',
      mimeType: 'image/png',
      buffer: oversizedImage,
    });

    await expect(
      page.getByText('Image file size must be smaller than 5MB.')
    ).toBeVisible();

    await expect(
      page.getByRole('img', { name: 'Preview' })
    ).not.toBeVisible();
  });

  test('should remove a selected image', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    await expect(
      page.getByRole('img', { name: 'Preview' })
    ).toBeVisible();

    await page.getByTitle('Remove photo').click();

    await expect(
      page.getByRole('img', { name: 'Preview' })
    ).not.toBeVisible();

    await expect(
      page.getByText('Click to upload photograph')
    ).toBeVisible();
  });

  test('should show backend limitation when submitting a report with an image', async ({
    page,
  }) => {
    await page.getByLabel('Item Name / Title').fill('Lost Test Laptop');

    await page.locator('textarea').fill(
      'Black laptop with a unique blue sticker on its back.'
    );

    await page.locator('input[type="file"]').setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    await expect(
      page.getByRole('img', { name: 'Preview' })
    ).toBeVisible();

    await page.getByRole('button', {
      name: 'Publish Lost Report',
    }).click();

    await expect(
      page.getByText(
        'Image uploads are not yet supported by the backend. Please remove the photograph and submit the report again.'
      )
    ).toBeVisible();
  });
});
