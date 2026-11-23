import { test, expect, Page, Browser, APIRequestContext, request as pwRequest } from '@playwright/test';

// Use-case journeys: UI -> Angular -> RukuServiceApi -> MariaDB, nothing mocked.
// Each test is one goal a real person has, played by separate browser sessions
// (the owner and each customer), and asserts on what those people see on screen.
// The API is used only to clean up afterwards.
//
// Prereq: docker compose -f RukuApiService/docker-compose.local.yml up -d
// Run:    npx playwright test --config=e2e/live/playwright.live.config.ts

const BASE = 'http://localhost:4200';
const API = 'http://localhost:5002/api';
const OWNER = { email: 'admin@rukuit.com', password: 'admin-uid-12345' };
const NINE = '9:00 AM - 10:00 AM';
const TEN = '10:00 AM - 11:00 AM';

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}
const mdy = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
const cardDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const toast = (page: Page, text: string | RegExp) =>
  page.locator('mat-snack-bar-container').filter({ hasText: text });
const card = (page: Page, text: string) =>
  page.locator('app-horizontal-card-list mat-card').filter({ hasText: text });

async function newSession(browser: Browser, opts: { timezoneId?: string } = {}): Promise<Page> {
  const ctx = await browser.newContext({ baseURL: BASE, ...opts });
  const page = await ctx.newPage();
  page.on('dialog', d => d.accept());
  return page;
}

// ---------------------------------------------------------------- actors ----

class Owner {
  constructor(readonly page: Page) {}

  async signIn() {
    await this.page.goto('/login');
    await this.page.getByLabel('Email').fill(OWNER.email);
    await this.page.getByLabel('Password').fill(OWNER.password);
    await this.page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(this.page).toHaveURL(/\/features\/service-manager/);
  }

  async launchService(title: string) {
    const p = this.page;
    await p.getByRole('button', { name: 'Service Manager' }).click();
    await p.getByLabel('Title').fill(title);
    await p.getByLabel('Description').fill(`${title} offered for booking.`);
    await p.getByRole('button', { name: 'Add Feature' }).click();
    await p.locator('.features-section').getByLabel('Feature 1').fill('One to one session');
    await p.getByRole('button', { name: 'Add Pricing Plan' }).click();
    const plan = p.locator('.plan-card-form').first();
    await plan.getByLabel('Plan Name').fill('Starter');
    await plan.getByLabel('Initial Setup Fee').fill('$100.00');
    await plan.getByLabel('Monthly Subscription').fill('$10.00');
    await p.getByRole('button', { name: 'Add Service' }).click();
  }

  async openAvailability(service: string, from: Date, to: Date, slots: string[]) {
    const p = this.page;
    await p.getByRole('button', { name: 'Availability Manager' }).click();
    await expect(p.locator('.services-grid button', { hasText: service })).toBeVisible();
    await p.getByLabel('Start Date').fill(mdy(from));
    await p.getByLabel('End Date').fill(mdy(to));
    await p.locator('.services-grid button', { hasText: service }).click();
    for (const s of slots) await p.locator('.timeslot-grid button', { hasText: s }).click();
    await p.getByRole('button', { name: 'Add Availability' }).click();
  }

  async publishOffering(service: string, from: Date, to: Date, slots: string[]) {
    await this.signIn();
    await this.launchService(service);
    await expect(toast(this.page, 'Service Added/Updated Successfully!')).toBeVisible();
    await this.openAvailability(service, from, to, slots);
    await expect(toast(this.page, 'Availability Added/Updated Successfully!')).toBeVisible();
    await expect(card(this.page, service)).toBeVisible();
  }

  async viewBookings() {
    await this.page.getByRole('button', { name: 'Schedule Manager' }).click();
    await this.page.reload();
  }
}

class Customer {
  constructor(readonly page: Page, readonly name: string, readonly email: string) {}

  async register() {
    const p = this.page;
    await p.goto('/features/schedule-manager');
    await expect(p, 'booking area requires an account').toHaveURL(/\/login/);
    await p.getByText('Register', { exact: true }).click();
    await p.getByLabel('Display Name').fill(this.name);
    await p.getByLabel('Email').fill(this.email);
    await p.getByLabel('Password').fill(`pw-${this.email.split('@')[0].replace(/\W/g, '')}`);
    await p.getByRole('button', { name: 'Create Account' }).click();
    await expect(p).toHaveURL(/\/features/);
  }

  async openBookingForm() {
    const dates = this.page.waitForResponse(r => r.url().includes('/availabilities/dates'));
    await this.page.getByRole('button', { name: 'Schedule Manager' }).click();
    await dates;
  }

  /** Picks a date and returns the services the app offers for it. */
  async pickDate(date: Date): Promise<string[]> {
    const p = this.page;
    await p.getByLabel('Contact Name').fill(this.name);
    const services = p.waitForResponse(r => r.url().includes('/availabilities/services'));
    await p.getByLabel('Choose a date').fill(mdy(date));
    await p.getByLabel('Choose a date').blur();
    await services;
    return (await p.locator('.services-grid button').allInnerTexts()).map(s => s.trim());
  }

  /** Picks a service and returns the timeslots the app offers for it. */
  async pickService(service: string): Promise<string[]> {
    const slots = this.page.waitForResponse(r => r.url().includes('/availabilities/timeslots'));
    await this.page.locator('.services-grid button', { hasText: service }).click();
    await slots;
    return (await this.page.locator('.timeslot-grid button').allInnerTexts()).map(s => s.trim());
  }

  async book(date: Date, service: string, slot: string, note: string) {
    await this.pickDate(date);
    await this.pickService(service);
    await this.page.locator('.timeslot-grid button', { hasText: slot }).click();
    await this.page.getByLabel('Note (Optional)').fill(note);
    await this.page.getByRole('button', { name: 'Add Schedule' }).click();
    await expect(toast(this.page, 'Schedule Added Successfully!')).toBeVisible();
    await expect(card(this.page, note)).toBeVisible();
  }
}

// --------------------------------------------------------------- cleanup ----

let tag = '';
test.beforeEach(() => {
  tag = Date.now().toString(36);
});

test.afterEach(async () => {
  const anon = await pwRequest.newContext();
  const { token } = await (await anon.post(`${API}/auth/login`, { data: { email: OWNER.email, uid: OWNER.password } })).json();
  await anon.dispose();
  const api: APIRequestContext = await pwRequest.newContext({ extraHTTPHeaders: { Authorization: `Bearer ${token}` } });
  const mine = (list: any[], pick: (x: any) => string) => list.filter(x => pick(x).includes(tag));
  for (const s of mine(await (await api.get(`${API}/schedules`)).json(), s => (s.services ?? []).join()))
    await api.delete(`${API}/schedules/${s.id}`);
  for (const a of mine(await (await api.get(`${API}/availabilities`)).json(), a => (a.services ?? []).join()))
    await api.delete(`${API}/availabilities/${a.id}`);
  for (const s of mine(await (await api.get(`${API}/services`)).json(), s => s.title))
    await api.delete(`${API}/services/${s.id}`);
  for (const u of mine(await (await api.get(`${API}/users`)).json(), u => u.email))
    await api.delete(`${API}/users/${u.id}`);
  await api.dispose();
});

// ------------------------------------------------------------ use cases ----

test('UC1: customer books an appointment for a service the owner just launched', async ({ browser }) => {
  const service = `Website Audit ${tag}`;
  const day = daysFromNow(30);
  const owner = new Owner(await newSession(browser));
  const alice = new Customer(await newSession(browser), 'Alice Customer', `alice.${tag}@example.com`);

  await test.step('owner launches the service and opens a booking window', () =>
    owner.publishOffering(service, daysFromNow(30), daysFromNow(33), [NINE, TEN]));

  await test.step('a new customer registers', () => alice.register());

  await test.step('customer is offered only what the owner published for that date', async () => {
    await alice.openBookingForm();
    expect(await alice.pickDate(day)).toEqual([service]);
    expect(await alice.pickService(service)).toEqual([NINE, TEN]);
  });

  await test.step('customer books 9 AM and sees the booking', async () => {
    await alice.page.reload();
    await alice.openBookingForm();
    await alice.book(day, service, NINE, `UC1 ${tag}`);
    await expect(card(alice.page, `UC1 ${tag}`)).toContainText(service);
    await expect(card(alice.page, `UC1 ${tag}`)).toContainText(NINE);
  });

  await test.step('owner sees the new booking with the right date and slot', async () => {
    await owner.viewBookings();
    const booking = card(owner.page, `UC1 ${tag}`);
    await expect(booking).toBeVisible();
    await expect(booking).toContainText(cardDate(day));
    await expect(booking).toContainText(NINE);
  });
});

test('UC2: customer reschedules their appointment and the owner sees the change', async ({ browser }) => {
  const service = `Website Audit ${tag}`;
  const day = daysFromNow(36);
  const owner = new Owner(await newSession(browser));
  const alice = new Customer(await newSession(browser), 'Alice Customer', `alice.${tag}@example.com`);
  await owner.publishOffering(service, daysFromNow(36), daysFromNow(39), [NINE, TEN]);
  await alice.register();
  await alice.openBookingForm();
  await alice.book(day, service, NINE, `UC2 ${tag}`);

  await test.step('customer moves the appointment from 9 AM to 10 AM', async () => {
    await card(alice.page, `UC2 ${tag}`).getByRole('button', { name: /Edit/ }).click();
    await expect(alice.page.getByRole('button', { name: 'Update Schedule' })).toBeVisible();
    await alice.page.locator('.timeslot-grid button', { hasText: NINE }).click();
    await alice.page.locator('.timeslot-grid button', { hasText: TEN }).click();
    await alice.page.getByRole('button', { name: 'Update Schedule' }).click();
    await expect(toast(alice.page, 'Schedule Updated Successfully!')).toBeVisible();
    await expect(card(alice.page, `UC2 ${tag}`)).toContainText(TEN);
  });

  await test.step('owner sees the new time, and only one appointment', async () => {
    await owner.viewBookings();
    await expect(card(owner.page, `UC2 ${tag}`)).toHaveCount(1);
    await expect(card(owner.page, `UC2 ${tag}`)).toContainText(TEN);
  });
});

test('UC3: customer cancels and the slot opens up again', async ({ browser }) => {
  const service = `Website Audit ${tag}`;
  const day = daysFromNow(42);
  const owner = new Owner(await newSession(browser));
  const alice = new Customer(await newSession(browser), 'Alice Customer', `alice.${tag}@example.com`);
  await owner.publishOffering(service, daysFromNow(42), daysFromNow(45), [NINE, TEN]);
  await alice.register();
  await alice.openBookingForm();
  await alice.book(day, service, NINE, `UC3 ${tag}`);

  await test.step('customer cancels the appointment', async () => {
    await card(alice.page, `UC3 ${tag}`).getByRole('button', { name: /Delete/ }).click();
    await expect(toast(alice.page, 'Schedule deleted successfully!')).toBeVisible();
    await expect(card(alice.page, `UC3 ${tag}`)).toHaveCount(0);
  });

  await test.step('owner no longer sees it', async () => {
    await owner.viewBookings();
    await expect(card(owner.page, `UC3 ${tag}`)).toHaveCount(0);
  });

  await test.step('9 AM is bookable again', async () => {
    await alice.page.reload();
    await alice.openBookingForm();
    await alice.pickDate(day);
    expect(await alice.pickService(service)).toContain(NINE);
  });
});

test('UC4: two customers want the same slot', async ({ browser }) => {
  const service = `Website Audit ${tag}`;
  const day = daysFromNow(48);
  const owner = new Owner(await newSession(browser));
  const alice = new Customer(await newSession(browser), 'Alice Customer', `alice.${tag}@example.com`);
  const bob = new Customer(await newSession(browser), 'Bob Customer', `bob.${tag}@example.com`);
  await owner.publishOffering(service, daysFromNow(48), daysFromNow(51), [NINE, TEN]);
  await alice.register();
  await alice.openBookingForm();
  await alice.book(day, service, NINE, `UC4 alice ${tag}`);

  await test.step("second customer cannot see the first customer's booking", async () => {
    await bob.register();
    await bob.openBookingForm();
    await expect(card(bob.page, `UC4 alice ${tag}`)).toHaveCount(0);
  });

  await test.step('the taken 9 AM slot is not offered to the second customer', async () => {
    await bob.pickDate(day);
    const offered = await bob.pickService(service);
    expect(offered, '10 AM is still free').toContain(TEN);
    expect(offered, '9 AM is already booked by Alice').not.toContain(NINE);
  });
});

test('UC5: customer in India books the date they picked', async ({ browser }) => {
  const service = `Website Audit ${tag}`;
  const day = daysFromNow(54);
  const owner = new Owner(await newSession(browser));
  const priya = new Customer(await newSession(browser, { timezoneId: 'Asia/Kolkata' }), 'Priya Customer', `priya.${tag}@example.com`);
  await owner.publishOffering(service, daysFromNow(54), daysFromNow(55), [NINE]);
  await priya.register();
  await priya.openBookingForm();

  await test.step('customer sees the real service for the picked date', async () => {
    expect(await priya.pickDate(day)).toEqual([service]);
  });

  await test.step('owner sees the booking on that same date', async () => {
    await priya.page.reload();
    await priya.openBookingForm();
    await priya.book(day, service, NINE, `UC5 ${tag}`);
    await owner.viewBookings();
    await expect(card(owner.page, `UC5 ${tag}`)).toContainText(cardDate(day));
  });
});

test('UC6: owner tries to open a window that overlaps an existing one and is told why', async ({ browser }) => {
  const service = `Website Audit ${tag}`;
  const owner = new Owner(await newSession(browser));
  await owner.publishOffering(service, daysFromNow(60), daysFromNow(63), [NINE]);

  await owner.openAvailability(service, daysFromNow(62), daysFromNow(66), [TEN]);
  await expect(toast(owner.page, /Availability|Error/)).toBeVisible();
  await expect(card(owner.page, service), 'no second window was created').toHaveCount(1);
  await expect(toast(owner.page, 'collide'), 'owner is told the dates collide').toBeVisible();
});

test('UC7: owner adds a service that already exists and is told why', async ({ browser }) => {
  const service = `Website Audit ${tag}`;
  const owner = new Owner(await newSession(browser));
  await owner.signIn();
  await owner.launchService(service);
  await expect(toast(owner.page, 'Service Added/Updated Successfully!')).toBeVisible();

  await owner.launchService(service);
  await expect(toast(owner.page, /Service/)).toBeVisible();
  await expect(card(owner.page, service), 'still only one service with that name').toHaveCount(1);
  await expect(toast(owner.page, 'already exists'), 'owner is told the name is taken').toBeVisible();
});
