import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Project } from '../../models/project.modal';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-projectspage',
  imports: [HeaderComponent, CommonModule, MaterialModule, FooterComponent],
  templateUrl: './projectspage.component.html',
  styleUrl: './projectspage.component.scss',
})
export class ProjectsPageComponent implements OnInit {
  projects: Project[] = [];

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadproducts();
  }

  async loadproducts(): Promise<void> {
    try {
      const response = await this.projectService.getProjects();
      if (response.status === 200 && Array.isArray(response.body)) {
        this.projects =
          response.body.map((project) => ({
            Id: project.Id,
            Title: project.Title,
            Type: project.Type,
            FileName: project.FileName,
          })) || [];
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  goToProject(projectId: number) {
    this.router.navigate(['/project', projectId]);
  }
}
