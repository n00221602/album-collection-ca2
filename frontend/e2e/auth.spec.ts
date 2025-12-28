import { test, expect } from "@playwright/test";
const { describe, beforeEach } = test;

test.describe("Authentication", () => {
  beforeEach(async ({ page }) => {
    // Reset the database before each test
    await page.goto("http://localhost:5173/");
  });

  test("login form fields and submit", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("form-field-email").fill("joe@example.com");
    await page.getByTestId("form-field-password").fill("password123");
    await page.getByTestId("login-submit").click();
  });
});
