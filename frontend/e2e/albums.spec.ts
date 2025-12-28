import { test, expect } from '@playwright/test';
const { describe, beforeEach } = test;

test.describe('Albums', () => {
    beforeEach(async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByTestId('form-field-email').fill('joe@example.com');
    await page.getByTestId('form-field-password').fill('password123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/');
  });

  test('should display album details', async ({ page }) => {
    await page.goto('/albums/69519fac506d9af1714c384c');
    await expect(page.getByTestId('album-details-heading')).toBeVisible();
  });

  test('admin delete album', async ({ page }) => {
    await page.goto('/admin/albums');
    await page.getByTestId('delete-album-button').first().click();
  });

  test('admin edit album', async ({ page }) => {
    await page.goto('/admin/albums');
    await page.getByTestId('edit-album-button').first().click();
    await page.getByTestId('album-title-input').fill('New Title');
    await page.getByTestId('submit-album-button').click();
  });

  test('admin create album', async ({ page }) => {
    await page.goto('/admin/albums/form');
    await page.getByTestId('album-artist-select').selectOption({ label: 'The Prodigy' });
    await page.getByTestId('album-title-input').fill('Test Album');
    await page.getByTestId('album-genre-input-0').fill('Rock');
    await page.getByTestId('album-year-input').fill('2024');
    await page.getByTestId('submit-album-button').click();
  });
});
