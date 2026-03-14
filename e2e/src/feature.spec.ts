import { test, expect } from '@playwright/test';

test.describe('Feature Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/features');
  });

  test('should display feature tabs', async ({ page }) => {
    const tabs = page.locator('.feature-tabs button');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toContainText('Service Manager');
    await expect(tabs.nth(1)).toContainText('Availability Manager');
    await expect(tabs.nth(2)).toContainText('Schedule Manager');
  });

  test('should default to service-manager route', async ({ page }) => {
    await expect(page).toHaveURL(/\/features\/service-manager/);
    await expect(page.locator('.feature-tabs button').nth(0)).toHaveClass(/active/);
  });

  test('should navigate to availability manager tab', async ({ page }) => {
    await page.locator('.feature-tabs button', { hasText: 'Availability Manager' }).click();
    await expect(page).toHaveURL(/\/features\/availability-manager/);
    await expect(page.locator('.feature-tabs button', { hasText: 'Availability Manager' })).toHaveClass(/active/);
  });

  test('should navigate to schedule manager tab', async ({ page }) => {
    await page.locator('.feature-tabs button', { hasText: 'Schedule Manager' }).click();
    await expect(page).toHaveURL(/\/features\/schedule-manager/);
    await expect(page.locator('.feature-tabs button', { hasText: 'Schedule Manager' })).toHaveClass(/active/);
  });

  test('should display content area for each tab', async ({ page }) => {
    await expect(page.locator('.feature-content')).toBeVisible();

    await page.locator('.feature-tabs button', { hasText: 'Availability Manager' }).click();
    await expect(page.locator('.feature-content')).toBeVisible();

    await page.locator('.feature-tabs button', { hasText: 'Schedule Manager' }).click();
    await expect(page.locator('.feature-content')).toBeVisible();
  });
});
