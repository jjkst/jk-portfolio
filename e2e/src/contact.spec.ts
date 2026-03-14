import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('should display all form fields', async ({ page }) => {
    await expect(page.locator('input[formControlName="firstName"]')).toBeVisible();
    await expect(page.locator('input[formControlName="lastName"]')).toBeVisible();
    await expect(page.locator('input[formControlName="email"]')).toBeVisible();
    await expect(page.locator('input[formControlName="phoneNumber"]')).toBeVisible();
    await expect(page.locator('textarea[formControlName="questions"]')).toBeVisible();
  });

  test('should have submit button disabled when form is empty', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should enable submit button when all fields are valid', async ({ page }) => {
    await page.locator('input[formControlName="firstName"]').fill('John');
    await page.locator('input[formControlName="lastName"]').fill('Doe');
    await page.locator('input[formControlName="email"]').fill('john@example.com');
    await page.locator('input[formControlName="phoneNumber"]').fill('1234567890');
    await page.locator('textarea[formControlName="questions"]').fill('Test question');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should keep submit disabled with invalid email', async ({ page }) => {
    await page.locator('input[formControlName="firstName"]').fill('John');
    await page.locator('input[formControlName="lastName"]').fill('Doe');
    await page.locator('input[formControlName="email"]').fill('invalid-email');
    await page.locator('input[formControlName="phoneNumber"]').fill('1234567890');
    await page.locator('textarea[formControlName="questions"]').fill('Test');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should keep submit disabled when a required field is empty', async ({ page }) => {
    await page.locator('input[formControlName="firstName"]').fill('John');
    await page.locator('input[formControlName="lastName"]').fill('Doe');
    await page.locator('input[formControlName="email"]').fill('john@example.com');
    await page.locator('input[formControlName="phoneNumber"]').fill('1234567890');
    // Leave questions empty
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});
