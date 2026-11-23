import { Component, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Scenario {
  index: number;
  title: string;
  depth: string;
  given: string;
  when: string;
  then: string;
}

interface TestStep {
  action: string;
  expected: string;
}

interface TestCase {
  title: string;
  priority: number;
  gherkin: string;
  steps: TestStep[];
}

const SAMPLE_DOC = '/samples/UseCaseFlow_Booking.md';
const DOC_NAME = 'UseCaseFlow_Booking.md';
const CSV_NAME = 'TestCases_Booking.csv';

@Component({
  selector: 'app-qa-pipeline',
  standalone: true,
  templateUrl: './qa-pipeline.component.html',
  styleUrl: './qa-pipeline.component.scss'
})
export class QaPipelineComponent {
  /** 1 = input, 2 = review gate, 3 = test cases */
  readonly stage = signal(1);
  readonly mining = signal(false);
  readonly doc = signal('');
  readonly uploadedName = signal('');
  readonly parseError = signal('');
  readonly testCases = signal<TestCase[]>([]);

  readonly csv = computed(() => this.toCsv(this.testCases()));

  // Review-gate counts, read from the document itself so the chips can't drift from it.
  readonly docName = DOC_NAME;
  readonly csvName = CSV_NAME;
  readonly useCaseCount = computed(() => (this.doc().match(/^##\s+UC\d+/gm) ?? []).length);
  readonly conflictCount = computed(() =>
    this.doc().split(/\r?\n/).filter(l => l.trim().startsWith('|') && l.includes('⚠ CONFLICT')).length
  );
  readonly scenarioCount = computed(() => this.parseScenarios(this.doc()).length);
  readonly stepCount = computed(() =>
    this.testCases().reduce((n, tc) => n + tc.steps.length, 0)
  );

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ── Step 1 → 2 ───────────────────────────────────────────
  async mineUseCaseFlow(): Promise<void> {
    if (!this.isBrowser || this.mining()) return;

    this.mining.set(true);
    try {
      const response = await fetch(SAMPLE_DOC);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.doc.set(await response.text());
      this.stage.set(2);
    } catch {
      this.parseError.set('Could not load the sample document. Refresh and try again.');
    } finally {
      this.mining.set(false);
    }
  }

  downloadDoc(): void {
    this.download(this.doc(), DOC_NAME, 'text/markdown');
  }

  // ── Step 2 → 3 ───────────────────────────────────────────
  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.parseError.set('');
    this.uploadedName.set(file.name);

    const text = await file.text();
    const scenarios = this.parseScenarios(text);

    if (scenarios.length === 0) {
      this.parseError.set(
        'No "Proposed scenarios" table found. The reviewed file must keep that section — ' +
        'it is the contract between the two steps.'
      );
      this.testCases.set([]);
      return;
    }

    this.testCases.set(scenarios.map(s => this.toTestCase(s)));
    this.stage.set(3);
    input.value = '';
  }

  downloadCsv(): void {
    this.download(this.csv(), CSV_NAME, 'text/csv');
  }

  reset(): void {
    this.stage.set(1);
    this.doc.set('');
    this.uploadedName.set('');
    this.parseError.set('');
    this.testCases.set([]);
  }

  // ── Parsing ──────────────────────────────────────────────
  /** Pulls the rows of the "Proposed scenarios" markdown table. */
  private parseScenarios(markdown: string): Scenario[] {
    const lines = markdown.split(/\r?\n/);
    const heading = lines.findIndex(l => /^#{2,4}\s+Proposed scenarios\s*$/i.test(l.trim()));
    if (heading === -1) return [];

    const scenarios: Scenario[] = [];
    let seenSeparator = false;

    for (let i = heading + 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('#')) break;              // next section
      if (!line.startsWith('|')) {
        if (scenarios.length > 0) break;            // table ended
        continue;                                   // blank line before it
      }
      if (/^\|[\s|:-]+\|$/.test(line)) {            // |---|---| separator
        seenSeparator = true;
        continue;
      }

      const cells = line.slice(1, -1).split('|').map(c => this.clean(c));
      if (!seenSeparator) continue;                 // header row
      if (cells.length < 6) continue;

      scenarios.push({
        index: scenarios.length + 1,
        title: cells[1],
        depth: cells[2].toLowerCase(),
        given: cells[3],
        when: cells[4],
        then: cells[5]
      });
    }

    return scenarios.filter(s => s.title.length > 0);
  }

  /** Strips markdown emphasis and backticks, collapses whitespace. */
  private clean(cell: string): string {
    return cell
      .replace(/`/g, '')
      .replace(/\*\*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ── Generation ───────────────────────────────────────────
  private toTestCase(s: Scenario): TestCase {
    const priority = s.depth.includes('smoke') ? 1 : 2;

    const gherkin = [
      `Scenario: ${s.title}`,
      `  Given ${s.given}`,
      `  When ${s.when}`,
      `  Then ${s.then}`
    ].join('\n');

    // The When column often chains actions with "and" — each becomes its own step.
    const actions = s.when.split(/\s+and\s+/i).filter(a => a.trim().length > 0);

    const steps: TestStep[] = [
      { action: this.sentence(`ensure ${s.given}`), expected: this.sentence(`${s.given}`) }
    ];

    actions.forEach((action, i) => {
      const last = i === actions.length - 1;
      steps.push({
        action: this.sentence(action),
        expected: last ? this.sentence(s.then) : 'The action is accepted'
      });
    });

    return { title: s.title, priority, gherkin, steps };
  }

  private sentence(text: string): string {
    const t = text.trim().replace(/^the\s+/i, m => m);
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  // ── CSV (ADO import contract: 9 columns, parent row + numbered step rows) ──
  private toCsv(cases: TestCase[]): string {
    const header = 'ID,Work Item Type,Title,Test Step,Step Action,Step Expected,Tags,Priority,Description';
    const rows: string[] = [header];

    for (const tc of cases) {
      rows.push([
        '',
        'Test Case',
        this.cell(tc.title),
        '', '', '',
        '',                                   // Tags — set later from the .feature file
        String(tc.priority),
        this.cell(tc.gherkin)
      ].join(','));

      tc.steps.forEach((step, i) => {
        rows.push([
          '', '', '',
          String(i + 1),
          this.cell(step.action),
          this.cell(step.expected),
          '', '', ''
        ].join(','));
      });
    }

    return rows.join('\n') + '\n';
  }

  /** Quote when the value holds a comma, quote or newline; double embedded quotes. */
  private cell(value: string): string {
    const v = value.replace(/—/g, '-');     // em dash breaks Excel's CP-1252 default
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  }

  private download(content: string, filename: string, mime: string): void {
    if (!this.isBrowser || !content) return;

    const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
