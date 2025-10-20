import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { Observable, switchMap, map } from 'rxjs';
import { Project } from '../../models/project.modal';


@Component({
  selector: 'app-project-detail',
  imports: [HeaderComponent, FooterComponent, RouterLink, NgFor, NgIf, AsyncPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {

  project$: Observable<Project> | undefined;

  constructor(private router: Router, private projectService: ProjectService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.project$ = this.route?.params.pipe(
      switchMap(params => {
        const projectId = +params['id'];
        return this.projectService.getProjectById(projectId);
      }),
      map((response: any) => {
        return {
          Id: response.body.Id,
          Title: response.body.Title,
          Subtitle: response.body.Subtitle,
          Type: response.body.Type,
          Roles: response.body.Roles,
          TechStack: response.body.TechStack,
          Description: response.body.Description,
          Features: response.body.Features,
          FileName: response.body.FileName,
          Github: response.body.Github,
          Webpage: response.body.Webpage
        };
      })
    );
  }
      
  goToProject(projectId: number) {
    this.router.navigate(['/project', projectId]);
  }
}
