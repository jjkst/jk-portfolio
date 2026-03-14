import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('should display the projects grid', async ({ page }) => {
    await expect(page.locator('.card-grid')).toBeVisible();
  });

  test('should display multiple project cards', async ({ page }) => {
    const cards = page.locator('mat-card');
    await expect(cards).not.toHaveCount(0);
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('each project card should have an image and title', async ({ page }) => {
    const firstCard = page.locator('mat-card').first();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('mat-card-title')).not.toBeEmpty();
  });

  test('should navigate to project detail on card click', async ({ page }) => {
    await page.locator('mat-card').first().click();
    await expect(page).toHaveURL(/\/project\/\d+/);
  });
});
