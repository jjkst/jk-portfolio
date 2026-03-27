import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
