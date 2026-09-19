import { test, expect, Page } from '@playwright/test';
import { setupAuth } from './helpers/auth';

const API = 'http://localhost:5002/api';

// Only tab navigation is under test here — each manager's own spec covers its
// data. These mocks exist so a tab's ngOnInit fetch (e.g. schedule-manager's
// getSchedules()/getAvailableDates(), schedule-manager.component.ts:85,109)
// doesn't hit the real API with the fake e2e token, get a 401, and trigger
// auth.interceptor.ts's logout-redirect to /login mid-navigation.
async function setupMocks(page: Page) {
  await setupAuth(page);
  const empty = { status: 200, contentType: 'application/json', body: '[]' };
  await page.route(`${API}/publicservices`, (route) => route.fulfill(empty));
  await page.route(`${API}/services`, (route) => route.fulfill(empty));
  await page.route(`${API}/availabilities`, (route) => route.fulfill(empty));
  await page.route(`${API}/availabilities/dates`, (route) => route.fulfill(empty));
  await page.route(`${API}/schedules`, (route) => route.fulfill(empty));
}

test.describe('Feature Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
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
