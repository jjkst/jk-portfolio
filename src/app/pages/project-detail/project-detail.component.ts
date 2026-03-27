import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Observable, switchMap, map, tap } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProjectService } from '../../services/project.service';
import { GithubService } from '../../services/github.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-detail',
  imports: [HeaderComponent, FooterComponent, RouterLink, NgIf, NgFor, AsyncPipe, MarkdownComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project$: Observable<Project> | undefined;
  readmeContent: string | null = null;
  readmeLoading = false;
  readmeError = false;

  constructor(
    private projectService: ProjectService,
    private githubService: GithubService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.project$ = this.route.params.pipe(
      switchMap(params => {
        const projectId = +params['id'];
        return this.projectService.getProjectById(projectId);
      }),
      map((response: HttpResponse<Project | undefined>) => {
        const body = response.body;
        return {
          Id: body?.Id ?? 0,
          Title: body?.Title ?? '',
          Subtitle: body?.Subtitle,
          Type: body?.Type ?? '',
          TechStack: body?.TechStack,
          FileName: body?.FileName ?? '',
          Github: body?.Github,
          Webpage: body?.Webpage,
          readmeExcludeSections: body?.readmeExcludeSections
        } as Project;
      }),
      tap(project => {
        if (project.Github && project.Github.includes('github.com')) {
          this.loadReadme(project.Github, project.readmeExcludeSections);
        } else {
          this.readmeError = true;
        }
      })
    );
  }

  private async loadReadme(githubUrl: string, excludeSections?: string[]): Promise<void> {
    this.readmeLoading = true;
    this.readmeError = false;
    try {
      this.readmeContent = await this.githubService.fetchReadme(githubUrl, excludeSections);
      if (!this.readmeContent) {
        this.readmeError = true;
      }
    } catch {
      this.readmeError = true;
    } finally {
      this.readmeLoading = false;
    }
  }
}
