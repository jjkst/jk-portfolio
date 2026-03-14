import { test, expect, Page } from '@playwright/test';

const API = 'http://localhost:5002/api';

const mockServices = [
  {
    Id: 1,
    Title: 'Web Development',
    FileName: 'FrontendDev.svg',
    Description: 'Full stack web development services',
    Features: ['Responsive Design', 'SEO Optimization'],
    PricingPlans: [
      { Name: 'Basic', InitialSetupFee: '$500', MonthlySubscription: '$50', Features: ['5 pages'] },
    ],
  },
  {
    Id: 2,
    Title: 'Test Automation',
    FileName: 'BackendDev.svg',
    Description: 'End to end test automation services',
    Features: ['CI/CD Integration'],
    PricingPlans: [],
  },
];

async function setupMocks(page: Page, services = mockServices) {
  await page.route(`${API}/rukuservices`, (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(services) });
    }
    return route.continue();
  });

  await page.route(`${API}/services`, (route) => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...body, Id: 3 }),
      });
    }
    return route.continue();
  });

  await page.route(`${API}/services/*`, (route) => {
    if (route.request().method() === 'PUT') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: route.request().postData()! });
    }
    if (route.request().method() === 'DELETE') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
    return route.continue();
  });

  await page.route(`${API}/uploadimage`, (route) => {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: 'uploaded.png' }) });
  });
}

test.describe('Service Manager - CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/features/service-manager');
    await page.waitForSelector('.service-manager-card');
  });

  test('should display existing services in card list', async ({ page }) => {
    const cards = page.locator('app-horizontal-card-list mat-card');
    await expect(cards).toHaveCount(2);
    await expect(cards.first().locator('mat-card-title')).toContainText('Web Development');
  });

  test('should display edit and delete buttons on cards', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await expect(firstCard.locator('.edit-btn')).toBeVisible();
    await expect(firstCard.locator('.delete-btn')).toBeVisible();
  });

  test('should add a new service', async ({ page }) => {
    await page.locator('input[formControlName="title"]').fill('New Service Title');
    await page.locator('textarea[formControlName="description"]').fill('This is a detailed description for the new service');

    // Add a feature
    await page.getByRole('button', { name: 'Add Feature' }).click();
    await page.locator('.feature-field input').first().fill('Feature One');

    // Add a pricing plan
    await page.getByRole('button', { name: 'Add Pricing Plan' }).click();
    await page.locator('input[formControlName="name"]').fill('Starter');
    await page.locator('input[formControlName="initialSetupFee"]').fill('$100');
    await page.locator('input[formControlName="monthlySubscription"]').fill('$10/mo');

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.locator('mat-snack-bar-container')).toContainText('Successfully');
  });

  test('should keep submit disabled when form is invalid', async ({ page }) => {
    await page.locator('input[formControlName="title"]').fill('AB');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should load service into form on edit click', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.edit-btn').click();

    await expect(page.locator('input[formControlName="title"]')).toHaveValue('Web Development');
    await expect(page.locator('textarea[formControlName="description"]')).toHaveValue('Full stack web development services');
    await expect(page.locator('button[type="submit"]')).toContainText('Update Service');
  });

  test('should update a service after editing', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.edit-btn').click();

    // Wait for form to be fully populated from edit
    await expect(page.locator('button[type="submit"]')).toContainText('Update Service');
    await expect(page.locator('input[formControlName="title"]')).toHaveValue('Web Development');

    // Clear and fill title
    const titleInput = page.locator('input[formControlName="title"]');
    await titleInput.click();
    await titleInput.fill('Updated Web Dev');

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.locator('mat-snack-bar-container')).toContainText('Successfully');
  });

  test('should delete a service after confirm', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());

    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.delete-btn').click();

    await expect(page.locator('mat-snack-bar-container')).toContainText('deleted successfully');
  });

  test('should not delete a service when confirm is cancelled', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.dismiss());

    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.delete-btn').click();

    await expect(page.locator('mat-snack-bar-container')).not.toBeVisible();
  });
});
