import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the home page', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.locator('app-home')).toBeVisible();
  });

  test('should display the pipeline hero with heading', async ({ page }) => {
    await expect(page.locator('.pipeline-hero')).toBeVisible();
    await expect(page.locator('.pipeline-hero h1')).toContainText('Your spec and your code');
  });

  test('should display hero CTA anchoring to the demo', async ({ page }) => {
    const ctaButton = page.locator('.pipeline-hero a.cta-button').first();
    await expect(ctaButton).toHaveText('Try the demo');
    await ctaButton.click();
    await expect(page.locator('app-qa-pipeline')).toBeInViewport();
  });

  test('should display the plans section', async ({ page }) => {
    await expect(page.locator('#plans')).toBeVisible();
    await expect(page.locator('.plan')).toHaveCount(2);
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
