import { test, expect, Page } from '@playwright/test';

const API = 'http://localhost:5002/api';

// Generate next 7 days as available dates
function getAvailableDates(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString();
  });
}

// Use dates within the available range so dateFilter validation passes
const availableDates = getAvailableDates();

const mockSchedules = [
  {
    Id: 1,
    ContactName: 'John Doe',
    SelectedDate: availableDates[1], // tomorrow
    Services: ['Web Development'],
    Timeslots: ['09:00 AM'],
    Note: 'Initial consultation',
    Uid: 'uid-001',
  },
  {
    Id: 2,
    ContactName: 'Jane Smith',
    SelectedDate: availableDates[3], // 3 days from now
    Services: ['Test Automation'],
    Timeslots: ['10:00 AM', '11:00 AM'],
    Note: '',
    Uid: 'uid-002',
  },
];

async function setupMocks(page: Page) {
  await page.route(`${API}/schedules`, (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockSchedules) });
    }
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...body, Id: 3 }) });
    }
    return route.continue();
  });

  await page.route(`${API}/schedules/*`, (route) => {
    if (route.request().method() === 'PUT') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: route.request().postData()! });
    }
    if (route.request().method() === 'DELETE') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
    return route.continue();
  });

  await page.route(`${API}/availabilities/dates`, (route) => {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(getAvailableDates()) });
  });

  await page.route(`${API}/availabilities/services*`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(['Web Development', 'Test Automation', 'AI Agents']),
    });
  });

  await page.route(`${API}/availabilities/timeslots`, (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM']),
    });
  });
}

test.describe('Schedule Manager - CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/features/schedule-manager');
    await page.waitForSelector('.schedule-manager-card');
  });

  test('should display existing schedules in card list', async ({ page }) => {
    const cards = page.locator('app-horizontal-card-list mat-card');
    await expect(cards).toHaveCount(2);
  });

  test('should display edit and delete buttons on schedule cards', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await expect(firstCard.locator('.edit-btn')).toBeVisible();
    await expect(firstCard.locator('.delete-btn')).toBeVisible();
  });

  test('should display schedule content in cards', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await expect(firstCard).toContainText('Services');
    await expect(firstCard).toContainText('Web Development');
    await expect(firstCard).toContainText('Selected Timeslots');
  });

  test('should add a new schedule', async ({ page }) => {
    // Fill contact name
    await page.locator('input[formControlName="ContactName"]').fill('New Contact');

    // Pick tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
    await page.locator('input[formControlName="SelectedDate"]').fill(dateStr);
    // Trigger date change by pressing Tab
    await page.locator('input[formControlName="SelectedDate"]').press('Tab');

    // Wait for services to load then select one
    await page.waitForSelector('.services-grid button');
    await page.locator('.services-grid button', { hasText: 'Web Development' }).click();

    // Wait for timeslots to load then select one
    await page.waitForSelector('.timeslot-grid button');
    await page.locator('.timeslot-grid button', { hasText: '09:00 AM' }).click();

    // Optional note
    await page.locator('textarea[formControlName="Note"]').fill('Test appointment note');

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.locator('mat-snack-bar-container')).toContainText('Successfully');
  });

  test('should keep submit disabled when form is incomplete', async ({ page }) => {
    await page.locator('input[formControlName="ContactName"]').fill('John');
    // Leave date, services, timeslots empty
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should load cascading services after date selection', async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
    await page.locator('input[formControlName="SelectedDate"]').fill(dateStr);
    await page.locator('input[formControlName="SelectedDate"]').press('Tab');

    await page.waitForSelector('.services-grid button');
    const serviceButtons = page.locator('.services-grid button');
    const count = await serviceButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should load cascading timeslots after service selection', async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
    await page.locator('input[formControlName="SelectedDate"]').fill(dateStr);
    await page.locator('input[formControlName="SelectedDate"]').press('Tab');

    await page.waitForSelector('.services-grid button');
    await page.locator('.services-grid button').first().click();

    await page.waitForSelector('.timeslot-grid button');
    const timeslotButtons = page.locator('.timeslot-grid button');
    const count = await timeslotButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should load schedule into form on edit click', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.edit-btn').click();

    await expect(page.locator('input[formControlName="ContactName"]')).toHaveValue('John Doe');
    await expect(page.locator('button[type="submit"]')).toContainText('Update Schedule');
  });

  test('should update a schedule after editing', async ({ page }) => {
    const firstCard = page.locator('app-horizontal-card-list mat-card').first();
    await firstCard.locator('.edit-btn').click();

    // Wait for form to be fully populated from edit
    // patchValue restores Services/Timeslots after onDateChange clears them
    await expect(page.locator('input[formControlName="ContactName"]')).toHaveValue('John Doe');
    await expect(page.locator('button[type="submit"]')).toContainText('Update Schedule');

    // Wait for cascading async loads (services + timeslots) to complete
    await expect(page.locator('button[type="submit"]')).toBeEnabled({ timeout: 10000 });

    await page.locator('input[formControlName="ContactName"]').fill('John Updated');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page.locator('mat-snack-bar-container')).toContainText('Successfully');
  });

  test('should delete a schedule after confirm', async ({ page }) => {
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
});
