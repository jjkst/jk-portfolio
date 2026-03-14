import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.locator('app-home')).toBeVisible();
  });

  test('should display the hero section with heading', async ({ page }) => {
    await expect(page.locator('app-hero')).toBeVisible();
    await expect(page.locator('app-hero h1')).toContainText('Test Automation and Full-Stack Web Development');
  });

  test('should display hero CTA button linking to projects', async ({ page }) => {
    const ctaButton = page.locator('app-hero .cta-button');
    await expect(ctaButton).toHaveText('View My Projects');
    await ctaButton.click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test('should display the skills section', async ({ page }) => {
    await expect(page.locator('app-skills')).toBeVisible();
  });

  test('should display the projects section', async ({ page }) => {
    await expect(page.locator('app-projects')).toBeVisible();
  });

  test('should display header and footer', async ({ page }) => {
    await expect(page.locator('.desktop-nav')).toBeVisible();
    await expect(page.locator('app-footer')).toBeVisible();
  });
});
