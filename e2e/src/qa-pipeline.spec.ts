import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

test.describe('QA Pipeline Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the pipeline hero and demo section', async ({ page }) => {
    await expect(page.locator('.pipeline-hero h1')).toContainText('disagree');
    await expect(page.locator('app-qa-pipeline')).toBeVisible();
  });

  test('should start on stage 1 with the sample inputs', async ({ page }) => {
    const stepper = page.locator('.stepper li');
    await expect(stepper).toHaveCount(3);
    await expect(stepper.nth(0)).toHaveClass(/active/);
    await expect(page.locator('.input-card')).toHaveCount(2);
  });

  test('should reveal the review gate after generating the flow', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate the use-case flow' }).click();

    await expect(page.locator('.doc-preview')).toBeVisible();
    await expect(page.locator('.doc-preview')).toContainText('Business Logic Reference');
    await expect(page.locator('.doc-preview')).toContainText('Documents vs. Implementation');
    await expect(page.locator('.chip-warn')).toContainText('2 open conflicts');
    await expect(page.locator('.stepper li').nth(1)).toHaveClass(/active/);
  });

  test('should round-trip the doc and generate an ADO-shaped CSV', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: 'Generate the use-case flow' }).click();

    // Download the markdown the way a reviewer would.
    const mdDownload = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /BusinessLogic_Login\.md/ }).click(),
    ]).then(([download]) => download);

    const mdPath = path.join(os.tmpdir(), `pw-${testInfo.workerIndex}-BusinessLogic_Login.md`);
    await mdDownload.saveAs(mdPath);
    expect(fs.readFileSync(mdPath, 'utf8')).toContain('Proposed scenarios');

    // Re-upload it as the reviewed copy.
    await page.locator('.file-drop input[type="file"]').setInputFiles(mdPath);

    // The sample doc holds 5 proposed scenarios.
    await expect(page.locator('.case')).toHaveCount(5);
    await expect(page.locator('.stage-note')).toContainText('5');

    // Smoke scenario must come out as Priority 1, the rest as Priority 2.
    await expect(page.locator('.case').first().locator('.chip')).toHaveText('Priority 1');
    await expect(page.locator('.case').nth(1).locator('.chip')).toHaveText('Priority 2');

    // Gherkin is present and tag-free (tags belong to the .feature file).
    const gherkin = await page.locator('.case').first().locator('.case-gherkin pre').innerText();
    expect(gherkin).toContain('Scenario: Valid credentials sign the user in');
    expect(gherkin).toContain('Given ');
    expect(gherkin).toContain('When ');
    expect(gherkin).toContain('Then ');
    expect(gherkin).not.toContain('@Smoke');

    // The CSV itself.
    const csvDownload = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /TestCases_Login\.csv/ }).click(),
    ]).then(([download]) => download);

    const csvPath = path.join(os.tmpdir(), `pw-${testInfo.workerIndex}-TestCases_Login.csv`);
    await csvDownload.saveAs(csvPath);
    const csv = fs.readFileSync(csvPath, 'utf8');
    const lines = csv.split('\n');

    expect(lines[0]).toBe(
      'ID,Work Item Type,Title,Test Step,Step Action,Step Expected,Tags,Priority,Description'
    );

    // Parent row: empty ID, Work Item Type, Title, empty D-G, Priority, quoted Gherkin.
    expect(lines[1]).toMatch(/^,Test Case,Valid credentials sign the user in,,,,,1,"Scenario:/);

    // Step rows carry only Test Step / Step Action / Step Expected.
    const stepRow = lines.find(l => /^,,,1,/.test(l));
    expect(stepRow).toBeDefined();
    expect(stepRow!.endsWith(',,,')).toBe(true);

    // Five parent rows, one per scenario.
    expect(lines.filter(l => l.startsWith(',Test Case,')).length).toBe(5);

    // No em dashes — Excel renders them as mojibake in its default encoding.
    expect(csv).not.toContain('—');
  });

  test('should reject a file with no Proposed scenarios table', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate the use-case flow' }).click();

    const emptyPath = path.join(os.tmpdir(), 'pw-empty-doc.md');
    fs.writeFileSync(emptyPath, '# Login\n\nNothing useful here.\n');

    await page.locator('.file-drop input[type="file"]').setInputFiles(emptyPath);

    await expect(page.locator('.error')).toContainText('No "Proposed scenarios" table found');
    await expect(page.locator('.case')).toHaveCount(0);
  });
});
