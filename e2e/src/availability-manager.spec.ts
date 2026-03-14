import { test, expect, Page } from '@playwright/test';

const API = 'http://localhost:5002/api';

const mockAvailabilities = [
  {
    Id: 1,
    StartDate: '2026-04-01T00:00:00',
    EndDate: '2026-04-15T00:00:00',
    Timeslots: ['9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM'],
    Services: ['Web Development'],
  },
  {
    Id: 2,
    StartDate: '2026-05-01T00:00:00',
    EndDate: '2026-05-10T00:00:00',
    Timeslots: ['11:00 AM - 12:00 PM'],
    Services: ['Test Automation'],
  },
];

const mockServices = [
  { Id: 1, Title: 'Web Development', FileName: 'web.svg', Description: 'Web dev' },
  { Id: 2, Title: 'Test Automation', FileName: 'test.svg', Description: 'Test automation' },
];

async function setupMocks(page: Page) {
  await page.route(`${API}/availabilities`, (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockAvailabilities) });
    }
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...body, Id: 3 }) });
    }
    return route.continue();
  });

  await page.route(`${API}/availabilities/*`, (route) => {
    if (route.request().method() === 'PUT') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: route.request().postData()! });
    }
    if (route.request().method() === 'DELETE') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
    return route.continue();
  });

  await page.route(`${API}/services`, (route) => {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockServices) });
  });
}

test.describe('Availability Manager - CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/features/availability-manager');
    await page.waitForSelector('.availability-manager-card');
  });

  test('should display existing availabilities in card list', async ({ page }) => {
    const cards = page.locator('app-horizontal-card-list mat-card');
    await expect(cards).toHaveCount(2);
  });

  test('should display edit and delete buttons on cards', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await expect(firstCard.locator('.edit-btn')).toBeVisible();
    await expect(firstCard.locator('.delete-btn')).toBeVisible();
  });

  test('should display availability details in cards', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await expect(firstCard).toContainText('Start Date');
    await expect(firstCard).toContainText('End Date');
    await expect(firstCard).toContainText('Timeslots');
    await expect(firstCard).toContainText('Services');
  });

  test('should add a new availability', async ({ page }) => {
    // Fill start date
    const startInput = page.locator('input[formControlName="StartDate"]');
    await startInput.fill('6/1/2026');

    // Fill end date
    const endInput = page.locator('input[formControlName="EndDate"]');
    await endInput.fill('6/15/2026');

    // Select a service
    await page.locator('.services-grid button', { hasText: 'Web Development' }).click();

    // Select a timeslot
    await page.locator('.timeslot-grid button').first().click();

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.locator('mat-snack-bar-container')).toContainText('Successfully');
  });

  test('should keep submit disabled when form is incomplete', async ({ page }) => {
    // Only fill start date, leave rest empty
    await page.locator('input[formControlName="StartDate"]').fill('6/1/2026');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should load availability into form on edit click', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.edit-btn').click();

    await expect(page.locator('button[type="submit"]')).toContainText('Update Availability');

    // Verify service buttons have selected state
    const selectedServices = page.locator('.services-grid button.selected');
    await expect(selectedServices).not.toHaveCount(0);

    // Verify timeslot buttons have selected state
    const selectedTimeslots = page.locator('.timeslot-grid button.selected');
    await expect(selectedTimeslots).not.toHaveCount(0);
  });

  test('should update an availability after editing', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.edit-btn').click();

    // Wait for form to be populated from edit
    await expect(page.locator('button[type="submit"]')).toContainText('Update Availability');

    // Toggle an additional timeslot instead of changing dates (avoids matDatepicker parse issues)
    await page.locator('.timeslot-grid button', { hasText: '2:00 PM - 3:00 PM' }).click();

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.locator('mat-snack-bar-container')).toContainText('Successfully');
  });

  test('should delete an availability after confirm', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());

    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.delete-btn').click();

    await expect(page.locator('mat-snack-bar-container')).toContainText('deleted successfully');
  });

  test('should not delete when confirm is cancelled', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.dismiss());

    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.delete-btn').click();

    await expect(page.locator('mat-snack-bar-container')).not.toBeVisible();
  });

  test('should display service toggle buttons from API', async ({ page }) => {
    const serviceButtons = page.locator('.services-grid button');
    await expect(serviceButtons).toHaveCount(2);
    await expect(serviceButtons.first()).toContainText('Web Development');
    await expect(serviceButtons.last()).toContainText('Test Automation');
  });

  test('should display timeslot toggle buttons', async ({ page }) => {
    const timeslotButtons = page.locator('.timeslot-grid button');
    const count = await timeslotButtons.count();
    expect(count).toBeGreaterThan(0);
  });
});
