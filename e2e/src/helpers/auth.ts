import { Page } from '@playwright/test';

// Seeds localStorage with a fake auth token so authGuard allows navigation to /features/*.
// Must be called before page.goto().
export async function setupAuth(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('auth_token', 'fake-jwt-token-for-e2e-testing');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        id: 1,
        email: 'admin@rukuit.com',
        displayName: 'Admin',
        role: 'Admin',
        emailVerified: true,
      })
    );
  });
}
