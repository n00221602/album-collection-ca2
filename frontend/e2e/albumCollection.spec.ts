import { test, expect } from "@playwright/test";
const { describe, beforeEach } = test;

describe("Album Collection", () => {
  beforeEach(async ({ page }) => {
    // Reset the database before each test
    await page.goto("http://localhost:5173/");
  });

  test("front page can be opened", async ({ page }) => {
    // Expect the front page to contain "Albums"
    await expect(page.getByText("Albums")).toBeVisible();
    // Expect the front page to be redirected to the login page
    // where "Welcome back!" is visible
    await expect(page.getByText("Welcome back!")).toBeVisible();
  });

  test("user can log in", async ({ page }) => {
    // Fill in the login form
    await page.getByTestId("form-field-email").fill("alice@example.com");
    await page.getByTestId("form-field-password").fill("password123");
    await page.getByTestId("login-submit").click();

    // Expect to be logged in and see the albums page
    await expect(page.getByText("Your albums")).toBeVisible();
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      // Log in before each test in this describe block
      await page.getByTestId("form-field-email").fill("alice@example.com");
      await page.getByTestId("form-field-password").fill("password123");
      await page.getByTestId("login-submit").click();
    });

    test("a new album can be created", async ({ page }) => {
      // Fill in the album content
      await page.getByTestId("album-content-input").fill("This is a new album.");

      // Click the button to create a new album
      await page.getByTestId("create-album-button").click();

      // Expect the new album to be visible in the albums list
      await expect(page.getByText("This is a new album.")).toBeVisible();
    });
  });
});
