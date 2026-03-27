import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private http = inject(HttpClient);
  private cache = new Map<string, string>();

  /**
   * Extract owner/repo from a GitHub URL.
   * e.g. "https://github.com/jjkst/playwright-typescript-bdd" → "jjkst/playwright-typescript-bdd"
   */
  private extractRepo(githubUrl: string): string | null {
    const match = githubUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    return match ? match[1].replace(/\.git$/, '') : null;
  }

  /**
   * Fetch the raw README.md from a GitHub repo.
   * Tries 'main' branch first, falls back to 'master'.
   */
  async fetchReadme(githubUrl: string, excludeSections?: string[]): Promise<string | null> {
    const repo = this.extractRepo(githubUrl);
    if (!repo) return null;

    if (this.cache.has(repo)) {
      return this.cache.get(repo)!;
    }

    for (const branch of ['main', 'master']) {
      try {
        const url = `https://raw.githubusercontent.com/${repo}/${branch}/README.md`;
        const markdown = await firstValueFrom(
          this.http.get(url, { responseType: 'text' })
        );
        let processed = this.rewriteImageUrls(markdown, repo, branch);
        if (excludeSections?.length) {
          processed = this.removeSections(processed, excludeSections);
        }
        this.cache.set(repo, processed);
        return processed;
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Rewrite relative image/link paths in markdown to absolute GitHub URLs.
   * e.g. ![](docs/screenshot.png) → ![](https://raw.githubusercontent.com/owner/repo/main/docs/screenshot.png)
   */
  /**
   * Remove markdown sections by heading name.
   * Removes from the heading line until the next heading of equal or higher level.
   */
  private removeSections(markdown: string, sections: string[]): string {
    const lowerSections = sections.map(s => s.toLowerCase().trim());
    const lines = markdown.split('\n');
    const result: string[] = [];
    let skipping = false;
    let skipLevel = 0;

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim().toLowerCase();

        if (lowerSections.includes(title)) {
          skipping = true;
          skipLevel = level;
          continue;
        }

        if (skipping && level <= skipLevel) {
          skipping = false;
        }
      }

      if (!skipping) {
        result.push(line);
      }
    }

    return result.join('\n');
  }

  private rewriteImageUrls(markdown: string, repo: string, branch: string): string {
    const baseUrl = `https://raw.githubusercontent.com/${repo}/${branch}/`;

    // Rewrite markdown images: ![alt](relative/path)
    return markdown.replace(
      /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
      (_, alt, path) => `![${alt}](${baseUrl}${path})`
    );
  }
}
