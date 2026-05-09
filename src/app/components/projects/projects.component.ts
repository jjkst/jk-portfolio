import { Component, HostListener, Inject, OnInit, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../models/project.model';
import { HorizontalCardListComponent, MaterialModule } from 'ruku-bookings';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, RouterLink, HorizontalCardListComponent, MaterialModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  testprojects: Project[] = [];
  developmentprojects: Project[] = [];
  itemsPerPage = 3;

  @ViewChildren(HorizontalCardListComponent)
  cardLists!: QueryList<HorizontalCardListComponent<Project>>;

  private touchStartX = 0;
  private touchStartY = 0;
  private readonly isBrowser: boolean;

  constructor(
    private projectService: ProjectService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadproducts();
    this.updateItemsPerPage();
  }

  @HostListener('window:resize')
  updateItemsPerPage(): void {
    if (!this.isBrowser) return;
    const w = window.innerWidth;
    this.itemsPerPage = w <= 600 ? 1 : w <= 1100 ? 2 : 3;
  }

  onTouchStart(event: TouchEvent): void {
    const t = event.changedTouches[0];
    this.touchStartX = t.screenX;
    this.touchStartY = t.screenY;
  }

  onTouchEnd(event: TouchEvent, listIndex: number): void {
    const t = event.changedTouches[0];
    const dx = t.screenX - this.touchStartX;
    const dy = t.screenY - this.touchStartY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    const list = this.cardLists?.toArray()[listIndex];
    if (!list) return;
    if (dx < 0) list.scrollRight();
    else list.scrollLeft();
  }

  async loadproducts(): Promise<void> {
    try {
      const response = await this.projectService.getProjects();
      if (response.status === 200 && Array.isArray(response.body)) {
        let projects =
          response.body.map((product) => ({
            Id: product.Id,
            Title: product.Title,
            Type: product.Type,
            FileName: product.FileName,
            Github: product.Github
          })) || [];
        this.testprojects = projects.filter(p => p.Type === 'Test Automation');
        this.developmentprojects = projects.filter(p => p.Type === 'Development');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  getProjectImageUrl(project: Project): string {
    return `assets/${project.FileName}`;
  }

  getProjectTitle(project: Project): string {
    return project.Title;
  }

}
