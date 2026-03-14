import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.locator('h1.main-heading')).toHaveText("Hello, I'm Karthik Jayaraman");
  });

  test('should display profile title as sub-heading', async ({ page }) => {
    await expect(page.locator('h2.sub-heading')).toBeVisible();
    await expect(page.locator('h2.sub-heading')).not.toBeEmpty();
  });

  test('should display profile image', async ({ page }) => {
    const img = page.locator('.bio-image img');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('src', /profileimage/);
  });

  test('should display bio section with description list', async ({ page }) => {
    const bioContent = page.locator('.bio-content');
    await expect(bioContent).toBeVisible();
    const listItems = bioContent.locator('li');
    await expect(listItems).not.toHaveCount(0);
  });

  test('should display skills section', async ({ page }) => {
    await expect(page.locator('app-skills')).toBeVisible();
  });

  test('should display summary section with list items', async ({ page }) => {
    const summarySection = page.locator('.summary-section');
    await expect(summarySection).toBeVisible();
    const summaryItems = summarySection.locator('.summary-list li');
    await expect(summaryItems).not.toHaveCount(0);
  });

  test('should display download resume button', async ({ page }) => {
    const downloadButton = page.locator('.cta-button');
    await expect(downloadButton).toHaveText('Download My Resume');
    await expect(downloadButton).toBeVisible();
  });

  test('should trigger file download on resume button click', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('.cta-button').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBeTruthy();
  });
});
