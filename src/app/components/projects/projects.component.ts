import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalCardListComponent } from '../horizontal-card-list/horizontal-card-list.component';
import { Project } from '../../models/project.modal';
import { MaterialModule } from '../../material.module';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, HorizontalCardListComponent, MaterialModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  testprojects: Project[] = [];
  developmentprojects: Project[] = [];

  constructor(private projectService: ProjectService) {}   

  ngOnInit(): void {
    this.loadproducts();
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
            Description: product.Description,
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
