import { test, expect } from '@playwright/test';

test.describe('Project Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/project/1');
  });

  test('should display the project title', async ({ page }) => {
    await expect(page.locator('.project-header h1')).toBeVisible();
    await expect(page.locator('.project-header h1')).not.toBeEmpty();
  });

  test('should display the project subtitle', async ({ page }) => {
    await expect(page.locator('.subtitle')).toBeVisible();
  });

  test('should display tech stack information', async ({ page }) => {
    await expect(page.locator('.meta-row')).toBeVisible();
    await expect(page.locator('.tech-chips')).toBeVisible();
  });

  test('should display project overview section', async ({ page }) => {
    await expect(page.locator('.readme-section')).toBeVisible();
    await expect(page.locator('.readme-card')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await expect(page.locator('.readme-section')).toBeVisible();
  });

  test('should display image carousel', async ({ page }) => {
    await expect(page.locator('.hero-banner img')).toBeVisible();
  });

  test('should navigate back to projects via CTA button', async ({ page }) => {
    await page.locator('.cta-button').click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test('should display Github link', async ({ page }) => {
    const githubLink = page.locator('.github-btn');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', /http/);
  });
});

test.describe('Project Detail - Different Projects', () => {
  test('should load project 2', async ({ page }) => {
    await page.goto('/project/2');
    await expect(page.locator('.project-header h1')).toBeVisible();
  });

  test('should load a project with no webpage link', async ({ page }) => {
    await page.goto('/project/6');
    await expect(page.locator('.project-header h1')).toBeVisible();
  });
});
