import { test, expect } from '@playwright/test';

/**
 * Deliberately-seeded failure modes for QAOrchestrator's Phase 0 (run-history
 * ingestion + error-signature clustering — see qaorchestrator-ai-roadmap.md).
 *
 * These are NOT real bugs. Each one exists to guarantee a labelled, reproducible
 * failure signature reaches Azure DevOps, because Phase 1's eval harness needs
 * known-correct-fix fixtures and you don't get those by accident. Do not "fix"
 * these to make CI green — that defeats their purpose. Each test documents the
 * fix a future AI-assisted pass should produce.
 */
test.describe('[SEEDED] Phase 0 failure fixtures', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Flaky: fails ~50% of the time on an assertion with no real relationship to
  // app state. Correct fix: delete the random condition, assert the real thing.
  test('[SEEDED-FLAKY] hero heading check with a non-deterministic assertion', async ({ page }) => {
    await expect(page.locator('app-hero h1')).toBeVisible();
    const coinFlip = Date.now() % 2 === 0;
    expect(coinFlip).toBe(true);
  });

  // Locator break: `.cta-btn` doesn't exist (the real class is `.cta-button`,
  // see home.spec.ts). Correct fix: update the selector to match current markup.
  test('[SEEDED-LOCATOR] CTA button click via a stale selector', async ({ page }) => {
    const ctaButton = page.locator('app-hero button.cta-btn');
    await ctaButton.click({ timeout: 5000 });
    await expect(page).toHaveURL(/\/projects/);
  });

  // Logic regression: the app's real CTA text is "View My Projects" (see
  // home.spec.ts); this asserts stale/wrong expected text. Correct fix: update
  // the expected string to match actual intended behavior.
  test('[SEEDED-REGRESSION] hero CTA button has the pre-rename label', async ({ page }) => {
    const ctaButton = page.locator('app-hero button.cta-button');
    await expect(ctaButton).toHaveText('View My Work');
  });
});
