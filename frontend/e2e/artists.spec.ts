import { test, expect } from '@playwright/test';
const { describe, beforeEach } = test;

test.describe('Artists', () => {
    beforeEach(async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByTestId('form-field-email').fill('joe@example.com');
    await page.getByTestId('form-field-password').fill('password123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/');
  });

  test('should display artist details', async ({ page }) => {
    await page.goto('/artists/69519fac506d9af1714c384b');
    await expect(page.getByTestId('artist-details-heading')).toBeVisible();
  });

  test('admin delete artist', async ({ page }) => {
    await page.goto('/admin/artists');
    await page.getByTestId('delete-artist-button').first().click();
  });

  test('admin edit artist', async ({ page }) => {
    await page.goto('/admin/artists');
    await page.getByTestId('edit-artist-button').first().click();
      await page.getByTestId('artist-name-input').fill('New Artist');
    await page.getByTestId('submit-artist-button').click();
  });

  test('admin create artist', async ({ page }) => {
    await page.goto('/admin/artists/form');
    await page.getByTestId('artist-name-input').fill('Test Artist');
    await page.getByTestId('artist-bio-input').fill('This is a test bio.');
    await page.getByTestId('submit-artist-button').click();
    // Note: Delete button is tested separately in 'admin artist actions'
  });
});
