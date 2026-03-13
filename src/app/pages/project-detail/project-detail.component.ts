import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { Project } from '../../models/project.modal';
import { ImageCarouselComponent } from '../../components/image-carousel/image-carousel.component';


@Component({
  selector: 'app-project-detail',
  imports: [HeaderComponent, FooterComponent, RouterLink, NgFor, NgIf, AsyncPipe, ImageCarouselComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {

  project$: Observable<Project> | undefined;

  constructor(private projectService: ProjectService, private route: ActivatedRoute) { }

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
          Roles: body?.Roles,
          TechStack: body?.TechStack,
          Description: body?.Description,
          Features: body?.Features,
          FileName: body?.FileName ?? '',
          Screenshots: body?.Screenshots,
          Github: body?.Github,
          Webpage: body?.Webpage
        } as Project;
      })
    );
  }
}
