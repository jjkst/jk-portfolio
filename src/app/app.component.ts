import { Component, DestroyRef, Inject, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'jk-portfolio';
  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        if (!isPlatformBrowser(this.platformId)) return;

        const navEnd = event as NavigationEnd;
        const url = navEnd.urlAfterRedirects;
        const fragmentIndex = url.indexOf('#');

        if (fragmentIndex !== -1) {
          const fragment = url.substring(fragmentIndex + 1);
          // Delay to ensure DOM is rendered
          setTimeout(() => {
            const el = document.getElementById(fragment);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
  }
}
