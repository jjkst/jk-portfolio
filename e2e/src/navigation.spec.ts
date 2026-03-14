import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should display desktop navbar with logo and nav links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.desktop-nav');
    await expect(nav.locator('.logo')).toBeVisible();
    await expect(nav.locator('a[routerLink="/projects"]')).toHaveText('Projects');
    await expect(nav.locator('a[routerLink="/about"]')).toHaveText('About');
    await expect(nav.locator('a[routerLink="/contact"]')).toHaveText('Contact');
  });

  test('should navigate to Projects page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.desktop-nav a[routerLink="/projects"]').click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator('.card-grid')).toBeVisible();
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.desktop-nav a[routerLink="/about"]').click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('h1.main-heading')).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.desktop-nav a[routerLink="/contact"]').click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('should navigate back to Home via logo click', async ({ page }) => {
    await page.goto('/about');
    await page.locator('.desktop-nav a[routerLink="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('should highlight active nav link', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('.desktop-nav a[routerLink="/projects"]')).toHaveClass(/active/);
  });

  test('should redirect unknown routes to home', async ({ page }) => {
    await page.goto('/unknown-route');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hamburger')).toBeVisible();
  });

  test('should toggle mobile menu on hamburger click', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.locator('.hamburger');
    await hamburger.click();
    await expect(page.locator('.mobile-nav')).toHaveClass(/open/);
    await hamburger.click();
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/open/);
  });

  test('should navigate and close menu on mobile link click', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hamburger').click();
    await page.locator('.mobile-nav a[routerLink="/about"]').click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('.mobile-nav')).not.toHaveClass(/open/);
  });
});
