import { test, expect } from "@playwright/test";

test.describe("Admin Auth Flow", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Super Admin Login");
  });

  test("shows error on empty submit", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');
    await expect(page.locator("input[name='email']")).toBeVisible();
  });
});
