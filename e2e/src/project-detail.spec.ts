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
    await expect(page.locator('.tagline')).toBeVisible();
  });

  test('should display tech stack information', async ({ page }) => {
    const metaSection = page.locator('.project-meta');
    await expect(metaSection).toBeVisible();
    await expect(metaSection).toContainText('Tech Stack');
  });

  test('should display project overview section', async ({ page }) => {
    await expect(page.locator('.overview h2')).toHaveText('Project Overview');
    await expect(page.locator('.overview p')).not.toBeEmpty();
  });

  test('should display features section', async ({ page }) => {
    await expect(page.locator('.process h2')).toHaveText('Features');
    const features = page.locator('.process-step');
    await expect(features).not.toHaveCount(0);
  });

  test('should display image carousel', async ({ page }) => {
    await expect(page.locator('app-image-carousel')).toBeVisible();
  });

  test('should navigate back to projects via CTA button', async ({ page }) => {
    await page.locator('.cta-button').click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test('should display Github link', async ({ page }) => {
    const githubLink = page.locator('.project-meta a[target="_blank"]');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', /http/);
  });
});

test.describe('Project Detail - Different Projects', () => {
  test('should load project 2', async ({ page }) => {
    await page.goto('/project/2');
    await expect(page.locator('.project-header h1')).toBeVisible();
  });

  test('should load project with webpage link', async ({ page }) => {
    await page.goto('/project/6');
    const webpageLink = page.locator('.project-meta').getByText('Features');
    await expect(webpageLink).toBeVisible();
  });
});
