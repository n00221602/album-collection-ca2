import { test, expect } from '@playwright/test';
const { describe, beforeEach } = test;

test.describe('Reviews', () => {
    beforeEach(async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByTestId('form-field-email').fill('joe@example.com');
    await page.getByTestId('form-field-password').fill('password123');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/');
  });

  test('should display reviews for an album', async ({ page }) => {
    await page.goto('/reviews/69501b82deb979a28150fc1c');
    await expect(page.getByText("Album Reviews")).toBeVisible();
  });

  test('should create review', async ({ page }) => {
    await page.goto('/reviews/form/69501b82deb979a28150fc1c');
    await page.getByTestId('review-rating-input').fill('8');
    await page.getByTestId('review-comment-input').fill('Great album!');
    await page.getByTestId('submit-review-button').click();
    //await page.getByTestId('delete-review-button').click(); 
  });
});
